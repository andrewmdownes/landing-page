'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Car, AlertCircle, RefreshCw } from 'lucide-react'
import GoogleMap from '../../../components/GoogleMap'
import { getTrackingData, type TrackingData } from '../../../lib/tracking'

export default function LiveTrackingPage() {
  const params = useParams()
  const token = params.token as string
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const fetchTrackingData = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true)
      }

      const { data, error: fetchError } = await getTrackingData(token)

      if (fetchError) {
        throw new Error(fetchError)
      }

      setTrackingData(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Error fetching tracking data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    fetchTrackingData()
    const interval = setInterval(() => {
      fetchTrackingData(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchTrackingData])

  const handleRefresh = () => {
    fetchTrackingData(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5DBE62] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tracking Not Available</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-[#5DBE62] text-white px-6 py-2 rounded-lg hover:bg-[#4DA952] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!trackingData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#88C5A3] to-[#5DBE62] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Live Ride Tracking
              </h1>
              <p className="text-white/90">
                {trackingData.ride.from} → {trackingData.ride.to}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80 mb-1">Ride Date</div>
              <div className="font-semibold">
                {formatDate(trackingData.ride.date)}
              </div>
              <div className="text-sm text-white/90">
                {trackingData.ride.time}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#5DBE62]" />
                  Live Location
                </h2>
                <div className="flex items-center gap-4">
                  {lastUpdated && (
                    <span className="text-xs text-gray-500">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5DBE62] transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="h-96 md:h-[500px]">
                {trackingData.last_coordinate ? (
                  <GoogleMap
                    coordinates={trackingData.coordinates}
                    currentLocation={trackingData.last_coordinate}
                    pickupLocation={trackingData.ride.pickup_location}
                    dropoffLocation={trackingData.ride.dropoff_location}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No location data available yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-[#5DBE62]" />
                Current Status
              </h3>
              
              {trackingData.last_coordinate ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Live Tracking Active</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Last Update:</strong><br />
                    {formatTime(trackingData.last_coordinate.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-700">Waiting for Location</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-[#5DBE62] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">From</span>
                  </div>
                  <div className="ml-5">
                    <p className="font-semibold text-gray-900">{trackingData.ride.from}</p>
                    {trackingData.ride.pickup_location && (
                      <p className="text-sm text-gray-600">
                        {trackingData.ride.pickup_location.name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">To</span>
                  </div>
                  <div className="ml-5">
                    <p className="font-semibold text-gray-900">{trackingData.ride.to}</p>
                    {trackingData.ride.dropoff_location && (
                      <p className="text-sm text-gray-600">
                        {trackingData.ride.dropoff_location.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-bold mb-2">Ribit</p>
          <p className="text-gray-400 text-sm">
            Safe, affordable ridesharing for university students
          </p>
        </div>
      </div>
    </div>
  )
}