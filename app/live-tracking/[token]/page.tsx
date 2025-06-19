'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Car, AlertCircle, RefreshCw } from 'lucide-react'
import GoogleMap from '../../../components/GoogleMap'
import { getTrackingData } from '../../../lib/tracking'

interface TrackingData {
  session: {
    id: any
    created_at: any
    expires_at: any
    last_updated: any
  }
  ride: {
    from: any
    to: any
    date: any
    time: any
    pickup_location?: any
    dropoff_location?: any
  }
  coordinates: Array<{
    latitude: any
    longitude: any
    timestamp: any
  }>
  last_coordinate?: {
    latitude: any
    longitude: any
    timestamp: any
  } | null
}

export default function LiveTrackingPage() {
  const params = useParams()
  const token = params.token as string
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Fetch tracking data - useCallback to fix dependency warning
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

  // Setup polling
  useEffect(() => {
    // Initial fetch
    fetchTrackingData()

    // Set up interval for updates every 30 seconds
    const interval = setInterval(() => {
      fetchTrackingData(true)
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [fetchTrackingData])

  // Manual refresh
  const handleRefresh = () => {
    fetchTrackingData(true)
  }

  // Loading state
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

  // Error state
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
      {/* Header */}
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
              <div className="text-sm text-white/80 mb-1">
                Ride Date
              </div>
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
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#5DBE62]" />
                  Live Location
                </h2>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5DBE62] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
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
                      <p className="text-sm text-gray-500">Waiting for GPS updates...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Current Status */}
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
                  
                  <div className="text-sm text-gray-600">
                    <strong>Coordinates:</strong><br />
                    {trackingData.last_coordinate.latitude.toFixed(6)}, {trackingData.last_coordinate.longitude.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-700">Waiting for Location</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    The driver will share their location when the ride begins.
                  </p>
                </div>
              )}
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
              
              <div className="space-y-4">
                {/* From */}
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

                {/* To */}
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

            {/* Session Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#5DBE62]" />
                Session Information
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Started:</span>
                  <span className="ml-2 font-medium">{formatTime(trackingData.session.created_at)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Expires:</span>
                  <span className="ml-2 font-medium">{formatTime(trackingData.session.expires_at)}</span>
                </div>
                {lastUpdated && (
                  <div>
                    <span className="text-gray-600">Page Updated:</span>
                    <span className="ml-2 font-medium">{formatTime(lastUpdated.toISOString())}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Auto-refresh:</strong> This page updates every 30 seconds with the latest location data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
