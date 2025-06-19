// Robust GoogleMap.tsx - Multiple strategies to ensure container exists
// Replace your GoogleMap.tsx with this version

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Wait for DOM and initialize map
  const initializeMap = useCallback(async () => {
    if (!mounted) {
      console.log('⏳ Component not mounted yet, waiting...')
      return
    }

    try {
      console.log('🗺️ Starting map initialization...')
      
      if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is missing')
      }

      // Multiple strategies to find the container
      let container: HTMLElement | null = null
      
      // Strategy 1: Use ref
      if (mapRef.current) {
        container = mapRef.current
        console.log('✅ Container found via ref')
      }
      
      // Strategy 2: Query by ID as fallback
      if (!container) {
        container = document.getElementById('google-map-container')
        if (container) {
          console.log('✅ Container found via getElementById')
        }
      }
      
      // Strategy 3: Query by class as fallback
      if (!container) {
        container = document.querySelector('.google-map-container')
        if (container) {
          console.log('✅ Container found via querySelector')
        }
      }

      if (!container) {
        throw new Error('Map container still not found after all strategies')
      }

      console.log('📐 Container dimensions:', {
        width: container.offsetWidth,
        height: container.offsetHeight,
        display: window.getComputedStyle(container).display,
        visibility: window.getComputedStyle(container).visibility
      })

      // Load Google Maps API
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['maps', 'geometry']
      })

      console.log('📡 Loading Google Maps API...')
      await loader.load()
      console.log('✅ Google Maps API loaded')

      // Determine center
      let center = { lat: 28.5383, lng: -81.3792 }
      
      if (currentLocation) {
        center = { lat: currentLocation.latitude, lng: currentLocation.longitude }
      } else if (pickupLocation?.latitude && pickupLocation?.longitude) {
        center = { lat: parseFloat(pickupLocation.latitude), lng: parseFloat(pickupLocation.longitude) }
      }

      console.log('📍 Map center:', center)

      // Create map
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'cooperative',
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }

      const map = new google.maps.Map(container, mapOptions)
      mapInstanceRef.current = map
      
      console.log('✅ Map created successfully')
      
      // Add markers and content
      addMapContent(map)
      
      setError(null)
      setIsLoading(false)

    } catch (err) {
      console.error('💥 Map initialization failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setIsLoading(false)
    }
  }, [mounted, currentLocation, pickupLocation, dropoffLocation, coordinates])

  // Add markers and content to map
  const addMapContent = (map: google.maps.Map) => {
    console.log('🔄 Adding map content...')
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    const bounds = new google.maps.LatLngBounds()
    let hasValidCoordinates = false

    // Add pickup marker
    if (pickupLocation?.latitude && pickupLocation?.longitude) {
      const pickup = new google.maps.Marker({
        position: { lat: parseFloat(pickupLocation.latitude), lng: parseFloat(pickupLocation.longitude) },
        map,
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
      markersRef.current.push(pickup)
      bounds.extend(pickup.getPosition()!)
      hasValidCoordinates = true
    }

    // Add dropoff marker
    if (dropoffLocation?.latitude && dropoffLocation?.longitude) {
      const dropoff = new google.maps.Marker({
        position: { lat: parseFloat(dropoffLocation.latitude), lng: parseFloat(dropoffLocation.longitude) },
        map,
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
      markersRef.current.push(dropoff)
      bounds.extend(dropoff.getPosition()!)
      hasValidCoordinates = true
    }

    // Add current location marker
    if (currentLocation) {
      const current = new google.maps.Marker({
        position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        map,
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
      markersRef.current.push(current)
      bounds.extend(current.getPosition()!)
      hasValidCoordinates = true
    }

    // Add coordinate trail
    if (coordinates.length > 1) {
      const path = coordinates.map(coord => ({ lat: coord.latitude, lng: coord.longitude }))
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#5DBE62',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      })
      coordinates.forEach(coord => bounds.extend({ lat: coord.latitude, lng: coord.longitude }))
      hasValidCoordinates = true
    }

    // Fit bounds
    if (hasValidCoordinates && !bounds.isEmpty()) {
      map.fitBounds(bounds)
      
      // Limit zoom level
      const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
        if (map.getZoom()! > 15) map.setZoom(15)
        google.maps.event.removeListener(listener)
      })
    }

    console.log('✅ Map content added')
  }

  // Initialize when mounted
  useEffect(() => {
    if (!mounted) return

    console.log('🚀 Component mounted, waiting for DOM...')
    
    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap()
    }, 500) // Longer delay

    return () => clearTimeout(timer)
  }, [mounted, initializeMap])

  // Update content when data changes
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      addMapContent(mapInstanceRef.current)
    }
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, isLoading])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 bg-gray-300 rounded mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Initializing...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5DBE62] mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading Google Maps...</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Container: {mapRef.current ? 'Found' : 'Searching...'}</div>
            <div>Mounted: {mounted ? 'Yes' : 'No'}</div>
          </div>
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
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded mb-4">
            <div>Mounted: {mounted ? 'Yes' : 'No'}</div>
            <div>Ref Current: {mapRef.current ? 'Found' : 'Missing'}</div>
            <div>API Key: Present</div>
          </div>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              setTimeout(initializeMap, 100)
            }}
            className="bg-[#5DBE62] text-white px-4 py-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* Multiple container strategies */}
      <div 
        ref={mapRef}
        id="google-map-container"
        className="google-map-container w-full h-full"
        style={{ 
          minHeight: '400px',
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'relative'
        }}
      />
      
      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs z-10">
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

      {/* Debug overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-10">
        <div>Status: {mapInstanceRef.current ? 'Loaded' : 'Loading'}</div>
        <div>Markers: {markersRef.current.length}</div>
        <div>Container: {mapRef.current ? 'Found' : 'Missing'}</div>
      </div>
    </div>
  )
}