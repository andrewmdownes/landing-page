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
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  // Get the access token
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

  // Debug function to log information
  const addDebugInfo = useCallback((info: string) => {
    console.log(`🗺️ Mapbox Debug: ${info}`)
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`])
  }, [])

  // Test the Mapbox token
  const testMapboxToken = useCallback(async (token: string) => {
    if (!token) {
      addDebugInfo('No token provided for testing')
      return false
    }

    try {
      addDebugInfo(`Testing token: ${token.substring(0, 10)}...`)
      
      // Test with a simple geocoding request
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}`
      )
      
      if (response.ok) {
        addDebugInfo('✅ Token test successful')
        setTokenValid(true)
        return true
      } else {
        addDebugInfo(`❌ Token test failed: ${response.status} ${response.statusText}`)
        setTokenValid(false)
        return false
      }
    } catch (error) {
      addDebugInfo(`❌ Token test error: ${error}`)
      setTokenValid(false)
      return false
    }
  }, [addDebugInfo])

  // Ensure component is mounted client-side
  useEffect(() => {
    setMounted(true)
    addDebugInfo('Component mounted')
  }, [addDebugInfo])

  // Test token when component mounts
  useEffect(() => {
    if (mounted && MAPBOX_ACCESS_TOKEN) {
      testMapboxToken(MAPBOX_ACCESS_TOKEN)
    }
  }, [mounted, MAPBOX_ACCESS_TOKEN, testMapboxToken])

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

    try {
      // Add pickup marker if available
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
        addDebugInfo('Pickup marker added')
      }

      // Add dropoff marker if available
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
        addDebugInfo('Dropoff marker added')
      }

      // Add current location marker if available
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
        addDebugInfo('Current location marker added')
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
        addDebugInfo(`Route line added with ${coordinates.length} points`)
      }

      // Fit bounds if we have valid coordinates, otherwise center on a default location
      if (hasValidCoordinates && !bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        })
        addDebugInfo('Map bounds fitted to content')
      } else {
        // Default to Florida if no coordinates
        map.setCenter([-81.5158, 27.6648]) // Center of Florida
        map.setZoom(6)
        addDebugInfo('No coordinates found, centering on Florida')
      }

    } catch (error) {
      addDebugInfo(`Error adding map content: ${error}`)
      console.error('Error adding map content:', error)
    }

    addDebugInfo('Map content setup completed')
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, clearMarkers, addDebugInfo])

  // Initialize map
  const initializeMap = useCallback(async () => {
    addDebugInfo(`Init check: mounted=${mounted}, hasContainer=${!!mapRef.current}`)
    
    if (!mounted) {
      addDebugInfo('Not mounted yet')
      return
    }
    
    if (!mapRef.current) {
      addDebugInfo('Container ref is null, waiting...')
      return
    }

    // Check if Mapbox token is available
    if (!MAPBOX_ACCESS_TOKEN) {
      addDebugInfo('No Mapbox access token found')
      setError('Mapbox access token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.')
      setIsLoading(false)
      return
    }

    // Wait for token validation if it's still pending
    if (tokenValid === null) {
      addDebugInfo('Waiting for token validation...')
      setTimeout(() => initializeMap(), 1000)
      return
    }

    if (tokenValid === false) {
      addDebugInfo('Token validation failed, cannot initialize map')
      setError('Mapbox access token is invalid. Please check your token in the environment variables.')
      setIsLoading(false)
      return
    }

    try {
      addDebugInfo('Starting map initialization with validated token')
      
      // Set the access token
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
      
      // Force container to have dimensions if needed
      if (mapRef.current) {
        mapRef.current.style.width = '100%'
        mapRef.current.style.height = '100%'
        mapRef.current.style.minHeight = '400px'
        mapRef.current.style.position = 'relative'
        
        // Wait a brief moment for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      // Check container dimensions
      const containerRect = mapRef.current.getBoundingClientRect()
      addDebugInfo(`Container size: ${containerRect.width}x${containerRect.height}`)
      
      // Create map regardless of dimensions (it will resize automatically)
      addDebugInfo('Creating Mapbox map instance...')
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-81.5158, 27.6648], // Default to center of Florida
        zoom: 6,
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
        console.error('Mapbox error:', e)
        setError(`Map error: ${e.error?.message || 'Unknown error'}`)
        setIsLoading(false)
      })

      map.on('styledata', () => {
        addDebugInfo('Map style loaded')
      })

      map.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          addDebugInfo(`Source loaded: ${e.sourceId}`)
        }
      })

      // Timeout fallback
      setTimeout(() => {
        if (isLoading) {
          addDebugInfo('Map load timeout - setting as loaded anyway')
          if (map && !mapInstanceRef.current) {
            mapInstanceRef.current = map
            addMapContent(map)
            setError(null)
            setIsLoading(false)
          }
        }
      }, 15000) // 15 second timeout

    } catch (err) {
      addDebugInfo(`Initialization error: ${err}`)
      console.error('Map initialization error:', err)
      setError(err instanceof Error ? err.message : 'Unknown initialization error')
      setIsLoading(false)
    }
  }, [mounted, addMapContent, addDebugInfo, isLoading, MAPBOX_ACCESS_TOKEN, tokenValid])

  // Initialize when mounted and token is validated
  useEffect(() => {
    if (!mounted) return

    addDebugInfo('Component ready - starting initialization')
    
    // Wait for container to be available in DOM
    const waitForContainer = () => {
      if (mapRef.current) {
        addDebugInfo('Container found, initializing map')
        initializeMap()
      } else {
        addDebugInfo('Container not ready, retrying in 100ms')
        setTimeout(waitForContainer, 100)
      }
    }
    
    // Start checking for container
    setTimeout(waitForContainer, 50)

    return () => {
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
          
          {/* Enhanced debug info for loading state */}
          <div className="bg-gray-50 rounded p-3 text-xs text-left max-w-sm">
            <div className="font-semibold mb-2">Debug Info:</div>
            {debugInfo.map((info, idx) => (
              <div key={idx} className="text-gray-600">{info}</div>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div>Token: {MAPBOX_ACCESS_TOKEN ? `✅ ${MAPBOX_ACCESS_TOKEN.substring(0, 10)}...` : '❌ Missing'}</div>
              <div>Token Valid: {tokenValid === null ? '⏳ Testing...' : tokenValid ? '✅ Yes' : '❌ No'}</div>
              <div>Container Ref: {mapRef.current ? '✅ Found' : '❌ Missing'}</div>
              <div>Container Dimensions: {mapRef.current ? `${mapRef.current.getBoundingClientRect().width}x${mapRef.current.getBoundingClientRect().height}` : 'N/A'}</div>
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
          
          {/* Enhanced debug info for error state */}
          <div className="bg-red-50 rounded p-3 text-xs text-left mb-4">
            <div className="font-semibold mb-2 text-red-800">Debug Info:</div>
            {debugInfo.map((info, idx) => (
              <div key={idx} className="text-red-700">{info}</div>
            ))}
            <div className="mt-2 pt-2 border-t border-red-200">
              <div>Token: {MAPBOX_ACCESS_TOKEN ? `✅ ${MAPBOX_ACCESS_TOKEN.substring(0, 10)}...` : '❌ Missing'}</div>
              <div>Token Valid: {tokenValid === null ? '⏳ Testing...' : tokenValid ? '✅ Yes' : '❌ No'}</div>
              <div>Container Ref: {mapRef.current ? '✅ Found' : '❌ Missing'}</div>
              <div>Container Dimensions: {mapRef.current ? `${mapRef.current.getBoundingClientRect().width}x${mapRef.current.getBoundingClientRect().height}` : 'N/A'}</div>
              <div>Has coordinates: {coordinates.length > 0 ? '✅ Yes' : '❌ No'}</div>
              <div>Has current location: {currentLocation ? '✅ Yes' : '❌ No'}</div>
              <div>Environment: {process.env.NODE_ENV}</div>
            </div>
            
            {/* Test token button */}
            <div className="mt-2 pt-2 border-t border-red-200">
              <button
                onClick={() => testMapboxToken(MAPBOX_ACCESS_TOKEN)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Re-test Token
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              setDebugInfo([])
              setTokenValid(null)
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
          height: '100%',
          position: 'relative'
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

      {/* Enhanced status indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 text-gray-800 p-2 rounded text-xs z-10 border max-w-xs">
        <div>Status: {mapInstanceRef.current ? '✅ Loaded' : '⏳ Loading'}</div>
        <div>Token: {tokenValid === null ? '⏳ Testing...' : tokenValid ? '✅ Valid' : '❌ Invalid'}</div>
        <div>Container: {mapRef.current ? '✅ Found' : '❌ Missing'}</div>
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