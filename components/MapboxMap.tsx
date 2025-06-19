'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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

interface MapboxMapProps {
  coordinates: Coordinate[]
  currentLocation?: Coordinate
  pickupLocation?: Location
  dropoffLocation?: Location
}

// Set your Mapbox access token
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoicmlidXRhcHAiLCJhIjoiY2x0ZXh4eHh4eDAwMTNkcGNjY2NjY2NjYyJ9.xxxxxxxxxxxxxxxxxxxxxxxxx'

export default function MapboxMap({ 
  coordinates, 
  currentLocation, 
  pickupLocation, 
  dropoffLocation
}: MapboxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set Mapbox access token
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
  }, [])

  // Ensure component is mounted client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
  }, [])

  // Add markers and route to map
  const addMapContent = useCallback((map: mapboxgl.Map) => {
    console.log('🔄 Adding map content...')
    
    // Clear existing markers
    clearMarkers()
    
    const bounds = new mapboxgl.LngLatBounds()
    let hasValidCoordinates = false

    // Add pickup marker
    if (pickupLocation?.latitude && pickupLocation?.longitude) {
      const pickupMarker = new mapboxgl.Marker({
        color: '#5DBE62',
        scale: 0.8
      })
        .setLngLat([parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="font-semibold">Pickup Location</div>
          <div class="text-sm">${pickupLocation.name}</div>
          <div class="text-xs text-gray-600">${pickupLocation.address}</div>
        `))
        .addTo(map)
      
      markersRef.current.push(pickupMarker)
      bounds.extend([parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)])
      hasValidCoordinates = true
    }

    // Add dropoff marker
    if (dropoffLocation?.latitude && dropoffLocation?.longitude) {
      const dropoffMarker = new mapboxgl.Marker({
        color: '#ff6b6b',
        scale: 0.8
      })
        .setLngLat([parseFloat(dropoffLocation.longitude), parseFloat(dropoffLocation.latitude)])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="font-semibold">Dropoff Location</div>
          <div class="text-sm">${dropoffLocation.name}</div>
          <div class="text-xs text-gray-600">${dropoffLocation.address}</div>
        `))
        .addTo(map)
      
      markersRef.current.push(dropoffMarker)
      bounds.extend([parseFloat(dropoffLocation.longitude), parseFloat(dropoffLocation.latitude)])
      hasValidCoordinates = true
    }

    // Add current location marker
    if (currentLocation) {
      // Create custom element for pulsing current location
      const currentLocationEl = document.createElement('div')
      currentLocationEl.className = 'current-location-marker'
      currentLocationEl.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #007AFF;
        border: 3px solid white;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
        animation: pulse 2s infinite;
      `

      const currentMarker = new mapboxgl.Marker({
        element: currentLocationEl,
        anchor: 'center'
      })
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="font-semibold">Current Location</div>
          <div class="text-xs text-gray-600">Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}</div>
        `))
        .addTo(map)
      
      markersRef.current.push(currentMarker)
      bounds.extend([currentLocation.longitude, currentLocation.latitude])
      hasValidCoordinates = true
    }

    // Add route line if we have coordinates
    if (coordinates.length > 1) {
      const routeCoordinates = coordinates.map(coord => [coord.longitude, coord.latitude])
      
      // Remove existing route if it exists
      if (map.getSource('route')) {
        map.removeLayer('route')
        map.removeSource('route')
      }

      // Add route source and layer
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#5DBE62',
          'line-width': 4,
          'line-opacity': 0.8
        }
      })

      // Extend bounds to include all coordinates
      coordinates.forEach(coord => {
        bounds.extend([coord.longitude, coord.latitude])
      })
      hasValidCoordinates = true
    }

    // Add connection line between pickup and dropoff if both exist
    if (pickupLocation?.latitude && pickupLocation?.longitude && 
        dropoffLocation?.latitude && dropoffLocation?.longitude) {
      
      // Remove existing connection line if it exists
      if (map.getSource('connection-line')) {
        map.removeLayer('connection-line')
        map.removeSource('connection-line')
      }

      map.addSource('connection-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)],
              [parseFloat(dropoffLocation.longitude), parseFloat(dropoffLocation.latitude)]
            ]
          }
        }
      })

      map.addLayer({
        id: 'connection-line',
        type: 'line',
        source: 'connection-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#94a3b8',
          'line-width': 2,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2]
        }
      })
    }

    // Fit bounds if we have valid coordinates
    if (hasValidCoordinates && !bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      })
    }

    console.log('✅ Map content added')
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, clearMarkers])

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mounted || !mapRef.current) {
      console.log('⏳ Component not ready yet, waiting...')
      return
    }

    try {
      console.log('🗺️ Starting Mapbox initialization...')
      
      if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN.includes('xxxxxxxxx')) {
        throw new Error('Mapbox access token is missing or invalid')
      }

      console.log('📐 Container dimensions:', {
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
      })

      // Determine center
      let center: [number, number] = [-81.3792, 28.5383] // Default to Orlando
      
      if (currentLocation) {
        center = [currentLocation.longitude, currentLocation.latitude]
      } else if (pickupLocation?.latitude && pickupLocation?.longitude) {
        center = [parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)]
      }

      console.log('📍 Map center:', center)

      // Create map
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12', // You can change this to other styles
        center,
        zoom: 10,
        attributionControl: false
      })

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Wait for map to load
      map.on('load', () => {
        console.log('✅ Mapbox map loaded successfully')
        mapInstanceRef.current = map
        addMapContent(map)
        setError(null)
        setIsLoading(false)
      })

      map.on('error', (e) => {
        console.error('💥 Mapbox error:', e)
        setError('Map failed to load')
        setIsLoading(false)
      })

    } catch (err) {
      console.error('💥 Map initialization failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setIsLoading(false)
    }
  }, [mounted, currentLocation, pickupLocation, dropoffLocation, addMapContent])

  // Initialize when mounted
  useEffect(() => {
    if (!mounted) return

    console.log('🚀 Component mounted, initializing map...')
    
    const timer = setTimeout(() => {
      initializeMap()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mounted, initializeMap])

  // Update content when data changes
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      addMapContent(mapInstanceRef.current)
    }
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, isLoading, addMapContent])

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
          <p className="text-gray-600 text-sm">Loading Mapbox...</p>
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
      {/* Add CSS for pulsing animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
          }
        }
      `}</style>
      
      {/* Mapbox container */}
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ 
          minHeight: '400px',
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-10 border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-[#5DBE62] rounded-full"></div>
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-[#ff6b6b] rounded-full"></div>
          <span>Dropoff</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-[#007AFF] rounded-full"></div>
          <span>Live Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#5DBE62] rounded"></div>
          <span>Route</span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded text-xs z-10 border">
        <div>Status: {mapInstanceRef.current ? 'Loaded' : 'Loading'}</div>
        <div>Markers: {markersRef.current.length}</div>
        <div>Coordinates: {coordinates.length}</div>
      </div>
    </div>
  )
}