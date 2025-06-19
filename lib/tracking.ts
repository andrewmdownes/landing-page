// lib/tracking.ts - FINAL VERSION
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Shared Location interface
export interface Location {
  id: string
  name: string
  address: string
  latitude: string
  longitude: string
}

export interface TrackingData {
  session: {
    id: string
    created_at: string
    expires_at: string
    last_updated: string
  }
  ride: {
    from: string
    to: string
    date: string
    time: string
    pickup_location?: Location
    dropoff_location?: Location
  }
  coordinates: Array<{
    latitude: number
    longitude: number
    timestamp: string
  }>
  last_coordinate?: {
    latitude: number
    longitude: number
    timestamp: string
  }
}

export async function getTrackingData(token: string): Promise<{ data: TrackingData | null; error: string | null }> {
  try {
    const { data: sessions, error: sessionError } = await supabase
      .from('live_tracking_sessions')
      .select(`
        *,
        rides(
          id,
          departure_date,
          departure_time,
          from_city:cities!from_city_id(name),
          to_city:cities!to_city_id(name),
          pickup_location:city_points!pickup_location_id(id,name,address,latitude,longitude),
          dropoff_location:city_points!dropoff_location_id(id,name,address,latitude,longitude)
        )
      `)
      .eq('session_token', token)
      .eq('is_active', true)

    if (sessionError) {
      return { data: null, error: sessionError.message }
    }

    if (!sessions || sessions.length === 0) {
      return { data: null, error: 'Tracking session not found or expired' }
    }

    const session = sessions[0]
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    
    if (now > expiresAt) {
      return { data: null, error: 'Tracking session has expired' }
    }

    const { data: coordinates, error: coordsError } = await supabase
      .from('tracking_coordinates')
      .select('latitude, longitude, timestamp')
      .eq('session_id', session.id)
      .order('timestamp', { ascending: false })
      .limit(10)

    if (coordsError) {
      console.warn('Could not fetch coordinates:', coordsError)
    }

    const responseData: TrackingData = {
      session: {
        id: session.id,
        created_at: session.created_at,
        expires_at: session.expires_at,
        last_updated: session.updated_at,
      },
      ride: {
        from: session.rides?.from_city?.name || 'Unknown',
        to: session.rides?.to_city?.name || 'Unknown',
        date: session.rides?.departure_date || '',
        time: session.rides?.departure_time?.slice(0, 5) || '',
        pickup_location: session.rides?.pickup_location || undefined,
        dropoff_location: session.rides?.dropoff_location || undefined,
      },
      coordinates: (coordinates || []).map(coord => ({
        latitude: parseFloat(coord.latitude?.toString() || '0'),
        longitude: parseFloat(coord.longitude?.toString() || '0'),
        timestamp: coord.timestamp
      })),
      last_coordinate: coordinates?.[0] ? {
        latitude: parseFloat(coordinates[0].latitude?.toString() || '0'),
        longitude: parseFloat(coordinates[0].longitude?.toString() || '0'),
        timestamp: coordinates[0].timestamp
      } : undefined,
    }

    return { data: responseData, error: null }
  } catch (error) {
    console.error('Tracking fetch error:', error)
    return { data: null, error: 'Failed to fetch tracking data' }
  }
}