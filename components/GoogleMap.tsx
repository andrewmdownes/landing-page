// Fixed GoogleMap.tsx - Replace your existing file with this version

'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Coordinate {
  latitude: number
  longitude: number
  timestamp: string
}

interface Location {
  id: string
  name: string
  address: string
  latitude: string
  longitude: string
}

interface GoogleMapProps {
  coordinates: Coordinate[]
  currentLocation?: Coordinate
  pickupLocation?: Location
  dropoffLocation?: Location
}

interface DebugInfo {
  hasApiKey: boolean
  apiKeyPreview: string
  currentLocation?: Coordinate
  pickupLocation?: Location
  dropoffLocation?: Location
  coordinatesCount: number
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyD4iFbmtX7jKqh-glzClWjSDpGyG8wQ1Ak'

export default function GoogleMap({ 
  coordinates, 
  currentLocation, 
  pickupLocation, 
  dropoffLocation
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)

  // Initialize map only once
  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('🗺️ Initializing Google Maps...')
        console.log('🔑 API Key:', GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.substring(0, 20)}...` : 'MISSING')
        
        setIsLoading(true)
        setDebugInfo({
          hasApiKey: !!GOOGLE_MAPS_API_KEY,
          apiKeyPreview: GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.substring(0, 20)}...` : 'MISSING',
          currentLocation,
          pickupLocation,
          dropoffLocation,
          coordinatesCount: coordinates.length
        })

        if (!GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key is missing')
        }

        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['maps', 'geometry']
        })

        console.log('📡 Loading Google Maps API...')
        await loader.load()
        console.log('✅ Google Maps API loaded successfully')

        if (!mapRef.current) {
          console.error('❌ Map container ref is null')
          throw new Error('Map container not found')
        }

        console.log('📍 Map container found, creating map...')

        let center = { lat: 28.5383, lng: -81.3792 } // Default: Gainesville area

        if (currentLocation) {
          center = {
            lat: currentLocation.latitude,
            lng: currentLocation.longitude
          }
          console.log('📍 Using current location as center:', center)
        } else if (pickupLocation) {
          center = {
            lat: parseFloat(pickupLocation.latitude),
            lng: parseFloat(pickupLocation.longitude)
          }
          console.log('📍 Using pickup location as center:', center)
        } else {
          console.log('📍 Using default center (Gainesville):', center)
        }

        const mapOptions: google.maps.MapOptions = {
          center,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'cooperative',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }

        console.log('🗺️ Creating map with options:', mapOptions)
        const map = new google.maps.Map(mapRef.current, mapOptions)
        mapInstanceRef.current = map
        
        console.log('✅ Map created successfully')
        setError(null)
      } catch (err) {
        console.error('💥 Error initializing Google Maps:', err)
        setError(`Failed to load Google Maps: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }

    initMap()
  }, [coordinates.length, currentLocation, pickupLocation, dropoffLocation]) // Include all dependencies

  const clearMapElements = () => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
  }

  // Update map content when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) {
      console.log('⏳ Skipping map update - map not ready or still loading')
      return
    }

    console.log('🔄 Updating map content...')
    console.log('📊 Data:', {
      currentLocation: !!currentLocation,
      pickupLocation: !!pickupLocation,
      dropoffLocation: !!dropoffLocation,
      coordinatesCount: coordinates.length
    })

    clearMapElements()
    const bounds = new google.maps.LatLngBounds()
    let hasValidCoordinates = false

    if (pickupLocation && pickupLocation.latitude && pickupLocation.longitude) {
      console.log('📍 Adding pickup marker')
      const pickupMarker = new google.maps.Marker({
        position: {
          lat: parseFloat(pickupLocation.latitude),
          lng: parseFloat(pickupLocation.longitude)
        },
        map: mapInstanceRef.current,
        title: `Pickup: ${pickupLocation.name}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#5DBE62',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      markersRef.current.push(pickupMarker)
      bounds.extend(pickupMarker.getPosition()!)
      hasValidCoordinates = true
    }

    if (dropoffLocation && dropoffLocation.latitude && dropoffLocation.longitude) {
      console.log('📍 Adding dropoff marker')
      const dropoffMarker = new google.maps.Marker({
        position: {
          lat: parseFloat(dropoffLocation.latitude),
          lng: parseFloat(dropoffLocation.longitude)
        },
        map: mapInstanceRef.current,
        title: `Dropoff: ${dropoffLocation.name}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ff6b6b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      markersRef.current.push(dropoffMarker)
      bounds.extend(dropoffMarker.getPosition()!)
      hasValidCoordinates = true
    }

    if (currentLocation) {
      console.log('📍 Adding current location marker')
      const currentMarker = new google.maps.Marker({
        position: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude
        },
        map: mapInstanceRef.current,
        title: 'Current Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#007AFF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        animation: google.maps.Animation.BOUNCE
      })

      markersRef.current.push(currentMarker)
      bounds.extend(currentMarker.getPosition()!)
      hasValidCoordinates = true
    }

    if (coordinates.length > 1) {
      console.log('📍 Adding coordinate trail')
      const path = coordinates.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude
      }))

      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#5DBE62',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current
      })

      coordinates.forEach(coord => {
        bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude))
      })
      hasValidCoordinates = true
    }

    if (pickupLocation && dropoffLocation && 
        pickupLocation.latitude && pickupLocation.longitude &&
        dropoffLocation.latitude && dropoffLocation.longitude) {
      console.log('🗺️ Adding route directions')
      
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#34D399',
          strokeOpacity: 0.6,
          strokeWeight: 3
        }
      })

      directionsRenderer.setMap(mapInstanceRef.current)

      directionsService.route({
        origin: {
          lat: parseFloat(pickupLocation.latitude),
          lng: parseFloat(pickupLocation.longitude)
        },
        destination: {
          lat: parseFloat(dropoffLocation.latitude),
          lng: parseFloat(dropoffLocation.longitude)
        },
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)
          console.log('✅ Route directions added')
        } else {
          console.warn('⚠️ Failed to get directions:', status)
        }
      })
    }

    if (hasValidCoordinates && !bounds.isEmpty()) {
      console.log('📐 Fitting map to bounds')
      mapInstanceRef.current.fitBounds(bounds)
      
      const listener = google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        if (mapInstanceRef.current!.getZoom()! > 15) {
          mapInstanceRef.current!.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }

    console.log('✅ Map content updated')

  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5DBE62] mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading Google Maps...</p>
          {debugInfo && (
            <div className="mt-2 text-xs text-gray-500">
              <div>API Key: {debugInfo.hasApiKey ? 'Present' : 'Missing'}</div>
              <div>Current Location: {debugInfo.currentLocation ? 'Yes' : 'No'}</div>
              <div>Coordinates: {debugInfo.coordinatesCount}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          {debugInfo && (
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <div><strong>Debug Info:</strong></div>
              <div>API Key: {debugInfo.apiKeyPreview}</div>
              <div>Has Current Location: {debugInfo.currentLocation ? 'Yes' : 'No'}</div>
              <div>Has Pickup: {debugInfo.pickupLocation ? 'Yes' : 'No'}</div>
              <div>Has Dropoff: {debugInfo.dropoffLocation ? 'Yes' : 'No'}</div>
              <div>Coordinates Count: {debugInfo.coordinatesCount}</div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#5DBE62] text-white px-4 py-2 rounded text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-[#5DBE62] rounded-full"></div>
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-[#ff6b6b] rounded-full"></div>
          <span>Dropoff</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#007AFF] rounded-full"></div>
          <span>Live Location</span>
        </div>
      </div>

      {/* Debug info overlay - remove this once working */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
        <div>Map Status: {mapInstanceRef.current ? 'Loaded' : 'Not Loaded'}</div>
        <div>Markers: {markersRef.current.length}</div>
        <div>Current Loc: {currentLocation ? 'Yes' : 'No'}</div>
      </div>
    </div>
  )
}