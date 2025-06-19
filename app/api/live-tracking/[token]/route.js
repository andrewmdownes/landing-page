// app/api/live-tracking/[token]/route.js
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request, { params }) {
  try {
    const { token } = params
    
    if (!token) {
      return NextResponse.json(
        { error: 'Tracking token is required' }, 
        { status: 400 }
      )
    }

    console.log('Fetching tracking session for token:', token)

    // Get tracking session by token (public access)
    const { data: session, error: sessionError } = await supabase
      .from('live_tracking_sessions')
      .select(`
        *,
        rides(
          id,
          departure_date,
          departure_time,
          from_city:cities!from_city_id(name),
          to_city:cities!to_city_id(name),
          pickup_location:city_points!pickup_location_id(id, name, address, latitude, longitude),
          dropoff_location:city_points!dropoff_location_id(id, name, address, latitude, longitude)
        )
      `)
      .eq('session_token', token)
      .eq('is_active', true)
      .single()

    if (sessionError) {
      console.error('Session fetch error:', sessionError)
      if (sessionError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tracking session not found or expired' }, 
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch tracking session' }, 
        { status: 500 }
      )
    }

    // Check if session is still valid
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Tracking session has expired' }, 
        { status: 410 }
      )
    }

    // Get latest coordinates (last 10 points for route trail)
    const { data: coordinates, error: coordsError } = await supabase
      .from('tracking_coordinates')
      .select('latitude, longitude, timestamp')
      .eq('session_id', session.id)
      .order('timestamp', { ascending: false })
      .limit(10)

    if (coordsError) {
      console.error('Coordinates fetch error:', coordsError)
      // Don't fail the request if coordinates can't be fetched
    }

    // Format response data
    const responseData = {
      session: {
        id: session.id,
        created_at: session.created_at,
        expires_at: session.expires_at,
        last_updated: session.updated_at,
      },
      ride: {
        from: session.rides?.from_city?.name || 'Unknown',
        to: session.rides?.to_city?.name || 'Unknown',
        date: session.rides?.departure_date,
        time: session.rides?.departure_time?.slice(0, 5),
        pickup_location: session.rides?.pickup_location || null,
        dropoff_location: session.rides?.dropoff_location || null,
      },
      coordinates: coordinates || [],
      last_coordinate: coordinates?.[0] || null,
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Add CORS headers for public access
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}