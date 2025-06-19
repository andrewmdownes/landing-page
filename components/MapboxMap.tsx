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

// Set your Mapbox access token - we'll debug this
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

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
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Debug function to log information
  const addDebugInfo = useCallback((info: string) => {
    console.log(`🐛 Debug: ${info}`)
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`])
  }, [])

  // Ensure component is mounted client-side
  useEffect(() => {
    setMounted(true)
    addDebugInfo('Component mounted')
  }, [addDebugInfo])

  // Check access token on mount
  useEffect(() => {
    if (mounted) {
      addDebugInfo(`Access token: ${MAPBOX_ACCESS_TOKEN ? `${MAPBOX_ACCESS_TOKEN.slice(0, 10)}...` : 'MISSING'}`)
      
      if (!MAPBOX_ACCESS_TOKEN) {
        setError('Mapbox access token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.')
        setIsLoading(false)
        return
      }

      if (MAPBOX_ACCESS_TOKEN.includes('xxxxxxxxx')) {
        setError('Mapbox access token appears to be a placeholder. Please set a real token.')
        setIsLoading(false)
        return
      }

      // Set the access token
      try {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
        addDebugInfo('Access token set successfully')
      } catch (err) {
        addDebugInfo(`Failed to set access token: ${err}`)
        setError('Failed to set Mapbox access token')
        setIsLoading(false)
        return
      }
    }
  }, [mounted, addDebugInfo])

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
  }, [])

  // Add markers and route to map
  const addMapContent = useCallback((map: mapboxgl.Map) => {
    addDebugInfo('Adding map content...')
    
    // Clear existing markers
    clearMarkers()
    
    const bounds = new mapboxgl.LngLatBounds()
    let hasValidCoordinates = false

    // Add pickup marker
    if (pickupLocation?.latitude && pickupLocation?.longitude) {
      try {
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
        addDebugInfo('Pickup marker added')
      } catch (err) {
        addDebugInfo(`Failed to add pickup marker: ${err}`)
      }
    }

    // Add dropoff marker
    if (dropoffLocation?.latitude && dropoffLocation?.longitude) {
      try {
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
        addDebugInfo('Dropoff marker added')
      } catch (err) {
        addDebugInfo(`Failed to add dropoff marker: ${err}`)
      }
    }

    // Add current location marker
    if (currentLocation) {
      try {
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
        addDebugInfo('Current location marker added')
      } catch (err) {
        addDebugInfo(`Failed to add current location marker: ${err}`)
      }
    }

    // Add route line if we have coordinates
    if (coordinates.length > 1) {
      try {
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
        addDebugInfo(`Route line added with ${coordinates.length} points`)
      } catch (err) {
        addDebugInfo(`Failed to add route line: ${err}`)
      }
    }

    // Fit bounds if we have valid coordinates
    if (hasValidCoordinates && !bounds.isEmpty()) {
      try {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        })
        addDebugInfo('Map bounds fitted')
      } catch (err) {
        addDebugInfo(`Failed to fit bounds: ${err}`)
      }
    }

    addDebugInfo('Map content completed')
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, clearMarkers, addDebugInfo])

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mounted || !mapRef.current) {
      addDebugInfo('Not ready - waiting for mount/container')
      return
    }

    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN.includes('xxxxxxxxx')) {
      addDebugInfo('Invalid access token detected')
      setError('Please set a valid Mapbox access token in your environment variables')
      setIsLoading(false)
      return
    }

    try {
      addDebugInfo('Starting map initialization...')
      
      // Check container dimensions
      const containerRect = mapRef.current.getBoundingClientRect()
      addDebugInfo(`Container size: ${containerRect.width}x${containerRect.height}`)
      
      if (containerRect.width === 0 || containerRect.height === 0) {
        throw new Error('Container has zero dimensions')
      }

      // Determine center
      let center: [number, number] = [-81.3792, 28.5383] // Default to Orlando
      
      if (currentLocation) {
        center = [currentLocation.longitude, currentLocation.latitude]
        addDebugInfo(`Using current location as center: ${center}`)
      } else if (pickupLocation?.latitude && pickupLocation?.longitude) {
        center = [parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)]
        addDebugInfo(`Using pickup location as center: ${center}`)
      } else {
        addDebugInfo(`Using default center: ${center}`)
      }

      // Create map
      addDebugInfo('Creating Mapbox map instance...')
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom: 10,
        attributionControl: false
      })

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Set up event listeners
      map.on('load', () => {
        addDebugInfo('Map load event fired')
        mapInstanceRef.current = map
        addMapContent(map)
        setError(null)
        setIsLoading(false)
      })

      map.on('error', (e) => {
        addDebugInfo(`Map error: ${e.error?.message || 'Unknown error'}`)
        setError(`Map error: ${e.error?.message || 'Unknown error'}`)
        setIsLoading(false)
      })

      // Timeout fallback
      setTimeout(() => {
        if (isLoading) {
          addDebugInfo('Map load timeout - forcing completion')
          if (map && !mapInstanceRef.current) {
            mapInstanceRef.current = map
            addMapContent(map)
            setError(null)
            setIsLoading(false)
          }
        }
      }, 10000) // 10 second timeout

    } catch (err) {
      addDebugInfo(`Initialization error: ${err}`)
      setError(err instanceof Error ? err.message : 'Unknown initialization error')
      setIsLoading(false)
    }
  }, [mounted, currentLocation, pickupLocation, dropoffLocation, addMapContent, addDebugInfo, isLoading])

  // Initialize when mounted
  useEffect(() => {
    if (!mounted) return

    addDebugInfo('Component ready - starting initialization')
    
    const timer = setTimeout(() => {
      initializeMap()
    }, 500)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        addDebugInfo('Cleaning up map instance')
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mounted, initializeMap, addDebugInfo])

  // Update content when data changes
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      addDebugInfo('Updating map content due to data change')
      addMapContent(mapInstanceRef.current)
    }
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, isLoading, addMapContent, addDebugInfo])

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5DBE62] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm mb-4">Loading Mapbox...</p>
          
          {/* Debug info */}
          <div className="bg-gray-50 rounded p-3 text-xs text-left max-w-sm">
            <div className="font-semibold mb-2">Debug Info:</div>
            {debugInfo.map((info, idx) => (
              <div key={idx} className="text-gray-600">{info}</div>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div>Token: {MAPBOX_ACCESS_TOKEN ? '✅ Present' : '❌ Missing'}</div>
              <div>Container: {mapRef.current ? '✅ Found' : '❌ Missing'}</div>
              <div>Mounted: {mounted ? '✅ Yes' : '❌ No'}</div>
            </div>
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
          
          {/* Debug info for error state */}
          <div className="bg-red-50 rounded p-3 text-xs text-left mb-4">
            <div className="font-semibold mb-2 text-red-800">Debug Info:</div>
            {debugInfo.map((info, idx) => (
              <div key={idx} className="text-red-700">{info}</div>
            ))}
          </div>
          
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              setDebugInfo([])
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

      {/* Enhanced status indicator with debug info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 text-gray-800 p-2 rounded text-xs z-10 border max-w-xs">
        <div>Status: {mapInstanceRef.current ? '✅ Loaded' : '⏳ Loading'}</div>
        <div>Markers: {markersRef.current.length}</div>
        <div>Coordinates: {coordinates.length}</div>
        {debugInfo.length > 0 && (
          <div className="mt-1 pt-1 border-t border-gray-200">
            <div className="font-semibold">Latest:</div>
            <div className="text-gray-600">{debugInfo[debugInfo.length - 1]}</div>
          </div>
        )}
      </div>
    </div>
  )
}