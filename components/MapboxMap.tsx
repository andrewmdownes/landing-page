'use client'

import { useEffect, useRef } from 'react'
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
  const mapInstance = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    // Hard-coded token (since we know it works)
    const MAPBOX_TOKEN = 'pk.eyJ1IjoicmliaXQ0MiIsImEiOiJjbWMzc2JyOXYwODRuMmtvaWR1dWJjNDVyIn0.CYHEuFkok2cF-N-XxX2PGA'
    
    if (!mapRef.current) {
      console.log('❌ Map container not found')
      return
    }

    if (mapInstance.current) {
      console.log('⚠️ Map already exists, skipping')
      return
    }

    try {
      console.log('🗺️ Creating map...')
      
      mapboxgl.accessToken = MAPBOX_TOKEN

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-81.3792, 28.5383], // Orlando
        zoom: 8
      })

      map.on('load', () => {
        console.log('✅ Map loaded successfully!')
        
        const bounds = new mapboxgl.LngLatBounds()
        let hasLocations = false

        // Add pickup marker if available
        if (pickupLocation?.latitude && pickupLocation?.longitude) {
          const pickupCoords: [number, number] = [
            parseFloat(pickupLocation.longitude), 
            parseFloat(pickupLocation.latitude)
          ]
          
          new mapboxgl.Marker({ color: '#5DBE62', scale: 1.2 })
            .setLngLat(pickupCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div>
                <h3 style="margin:0; color:#5DBE62;">🟢 Pickup</h3>
                <p style="margin:5px 0; font-weight:bold;">${pickupLocation.name}</p>
                <p style="margin:0; font-size:12px; color:#666;">${pickupLocation.address}</p>
              </div>
            `))
            .addTo(map)
          
          bounds.extend(pickupCoords)
          hasLocations = true
          console.log('✅ Pickup marker added:', pickupCoords)
        }

        // Add dropoff marker if available  
        if (dropoffLocation?.latitude && dropoffLocation?.longitude) {
          const dropoffCoords: [number, number] = [
            parseFloat(dropoffLocation.longitude), 
            parseFloat(dropoffLocation.latitude)
          ]
          
          new mapboxgl.Marker({ color: '#ff6b6b', scale: 1.2 })
            .setLngLat(dropoffCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div>
                <h3 style="margin:0; color:#ff6b6b;">🔴 Dropoff</h3>
                <p style="margin:5px 0; font-weight:bold;">${dropoffLocation.name}</p>
                <p style="margin:0; font-size:12px; color:#666;">${dropoffLocation.address}</p>
              </div>
            `))
            .addTo(map)
          
          bounds.extend(dropoffCoords)
          hasLocations = true
          console.log('✅ Dropoff marker added:', dropoffCoords)
        }

        // Add current location marker if available
        if (currentLocation) {
          const currentCoords: [number, number] = [
            currentLocation.longitude, 
            currentLocation.latitude
          ]
          
          // Create pulsing element for current location
          const el = document.createElement('div')
          el.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #007AFF;
            border: 3px solid white;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
            animation: pulse 2s infinite;
          `
          
          new mapboxgl.Marker({ element: el })
            .setLngLat(currentCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div>
                <h3 style="margin:0; color:#007AFF;">📍 Live Location</h3>
                <p style="margin:5px 0;">Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
                <p style="margin:0; font-size:12px; color:#666;">
                  ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            `))
            .addTo(map)
          
          bounds.extend(currentCoords)
          hasLocations = true
          console.log('✅ Live location marker added:', currentCoords)
        }

        // Add route line - either from coordinates or connect pickup to dropoff
        if (coordinates.length > 1) {
          // Use actual tracking coordinates
          const routeCoords: [number, number][] = coordinates.map(coord => [
            coord.longitude, 
            coord.latitude
          ])
          
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoords
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
              'line-width': 6,
              'line-opacity': 0.8
            }
          })
          
          // Extend bounds to include route
          routeCoords.forEach(coord => bounds.extend(coord))
          console.log(`✅ Live route added with ${coordinates.length} points`)
          
        } else if (pickupLocation?.latitude && pickupLocation?.longitude && 
                   dropoffLocation?.latitude && dropoffLocation?.longitude) {
          // Draw a straight line between pickup and dropoff
          const plannedRouteCoords: [number, number][] = [
            [parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)],
            [parseFloat(dropoffLocation.longitude), parseFloat(dropoffLocation.latitude)]
          ]
          
          map.addSource('planned-route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: plannedRouteCoords
              }
            }
          })

          map.addLayer({
            id: 'planned-route',
            type: 'line',
            source: 'planned-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#94a3b8',
              'line-width': 4,
              'line-opacity': 0.6,
              'line-dasharray': [2, 2]
            }
          })
          console.log('✅ Planned route added (dashed line)')
        }

        // Fit map to show all locations
        if (hasLocations && !bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 12
          })
          console.log('✅ Map fitted to bounds')
        }
      })

      map.on('error', (e) => {
        console.error('❌ Map error:', e)
      })

      mapInstance.current = map

    } catch (error) {
      console.error('❌ Failed to create map:', error)
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [pickupLocation, dropoffLocation, currentLocation, coordinates]) // Re-run when locations change

  return (
    <div className="w-full h-full relative bg-gray-100">
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
      
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ 
          minHeight: '400px',
          height: '100%',
          width: '100%'
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
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded text-xs border">
        <div>Map: {mapInstance.current ? '✅' : '⏳'}</div>
        <div>Coords: {coordinates.length}</div>
        <div>Pickup: {pickupLocation ? '✅' : '❌'}</div>
        <div>Dropoff: {dropoffLocation ? '✅' : '❌'}</div>
        <div>Live: {currentLocation ? '✅' : '❌'}</div>
      </div>
    </div>
  )
}