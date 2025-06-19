// components/LiveTrackingMap.tsx
'use client'

import { useEffect, useRef } from 'react'
import { MapPin, AlertCircle } from 'lucide-react'

interface TrackingData {
  session: {
    id: string
    created_at: string
    expires_at: string
  }
  ride: {
    from: string
    to: string
    pickup_location?: {
      name: string
      address: string
    }
    dropoff_location?: {
      name: string
      address: string
    }
  }
  coordinates: Array<{
    latitude: number
    longitude: number
    timestamp: string
  }>
  last_updated: string | null
}

interface LiveTrackingMapProps {
  trackingData: TrackingData
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function LiveTrackingMap({ trackingData }: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    return () => {
      // Cleanup markers and polyline
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Update map when tracking data changes
    if (mapInstanceRef.current && window.google) {
      updateMapWithData()
    }
  }, [trackingData])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    // Default center (if no coordinates available)
    const defaultCenter = { lat: 29.6516, lng: -82.3248 } // Gainesville, FL

    // Use the latest coordinate if available
    const currentLocation = trackingData.coordinates[0]
    const center = currentLocation 
      ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
      : defaultCenter

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: currentLocation ? 14 : 10,
      center,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    })

    updateMapWithData()
  }

  const updateMapWithData = () => {
    if (!mapInstanceRef.current || !window.google) return

    // Clear existing markers and polyline
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    const { coordinates } = trackingData
    
    if (coordinates.length === 0) return

    // Create current location marker (most recent coordinate)
    const currentLocation = coordinates[0]
    const currentMarker = new window.google.maps.Marker({
      position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
      map: mapInstanceRef.current,
      title: 'Current Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      },
      zIndex: 1000
    })

    markersRef.current.push(currentMarker)

    // Create path if we have multiple coordinates
    if (coordinates.length > 1) {
      const path = coordinates.reverse().map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude
      }))

      polylineRef.current = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#5DBE62',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      })

      polylineRef.current.setMap(mapInstanceRef.current)

      // Add start marker for the path
      if (path.length > 1) {
        const startMarker = new window.google.maps.Marker({
          position: path[0],
          map: mapInstanceRef.current,
          title: 'Trip Start',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#5DBE62',
            fillOpacity: 0.8,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }
        })
        markersRef.current.push(startMarker)
      }

      // Fit map to show all coordinates
      const bounds = new window.google.maps.LatLngBounds()
      path.forEach(coord => bounds.extend(coord))
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 })
    } else {
      // Single location - center map on it
      mapInstanceRef.current.setCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      })
      mapInstanceRef.current.setZoom(14)
    }

    // Add info window for current location
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: 600;">Current Location</h3>
          <p style="margin: 0; color: #666; font-size: 12px;">
            Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}
          </p>
        </div>
      `
    })

    currentMarker.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, currentMarker)
    })
  }

  // Show message if no coordinates available
  if (trackingData.coordinates.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Location Data</h3>
          <p className="text-gray-600 max-w-sm">
            The driver hasn&apos;t started sharing their location yet, or there may be a connectivity issue.
          </p>
        </div>
      </div>
    )
  }

  // Show error if Maps API key is missing
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-gray-600 max-w-sm">
            Google Maps configuration is missing. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full" />
      
      {/* Map overlay with trip info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">Live Tracking</span>
        </div>
        <div className="text-xs text-gray-600">
          <p>{trackingData.ride.from} → {trackingData.ride.to}</p>
          <p className="mt-1">
            {trackingData.coordinates.length} location update{trackingData.coordinates.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Current Location</span>
          </div>
          {trackingData.coordinates.length > 1 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#5DBE62] rounded-full opacity-80"></div>
                <span className="text-gray-700">Trip Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#5DBE62]"></div>
                <span className="text-gray-700">Route Traveled</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}