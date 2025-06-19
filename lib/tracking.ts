import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch tracking data function (similar to your signupToWaitlist)
export async function getTrackingData(token: string) {
  try {
    // Get tracking session by token
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

    // Check if session is still valid
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    
    if (now > expiresAt) {
      return { data: null, error: 'Tracking session has expired' }
    }

    // Get latest coordinates
    const { data: coordinates, error: coordsError } = await supabase
      .from('tracking_coordinates')
      .select('latitude, longitude, timestamp')
      .eq('session_id', session.id)
      .order('timestamp', { ascending: false })
      .limit(10)

    if (coordsError) {
      console.warn('Could not fetch coordinates:', coordsError)
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

    return { data: responseData, error: null }
  } catch (error) {
    console.error('Tracking fetch error:', error)
    return { data: null, error: 'Failed to fetch tracking data' }
  }
}
