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
        zoom: 10
      })

      map.on('load', () => {
        console.log('✅ Map loaded successfully!')
        
        // Add pickup marker if available
        if (pickupLocation?.latitude && pickupLocation?.longitude) {
          new mapboxgl.Marker({ color: '#5DBE62' })
            .setLngLat([parseFloat(pickupLocation.longitude), parseFloat(pickupLocation.latitude)])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Pickup</h3><p>${pickupLocation.name}</p>`))
            .addTo(map)
        }

        // Add dropoff marker if available  
        if (dropoffLocation?.latitude && dropoffLocation?.longitude) {
          new mapboxgl.Marker({ color: '#ff6b6b' })
            .setLngLat([parseFloat(dropoffLocation.longitude), parseFloat(dropoffLocation.latitude)])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Dropoff</h3><p>${dropoffLocation.name}</p>`))
            .addTo(map)
        }

        // Add current location marker if available
        if (currentLocation) {
          new mapboxgl.Marker({ color: '#007AFF' })
            .setLngLat([currentLocation.longitude, currentLocation.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Current Location</h3><p>Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}</p>`))
            .addTo(map)
        }

        // Add route line if coordinates exist
        if (coordinates.length > 1) {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates.map(coord => [coord.longitude, coord.latitude])
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
              'line-width': 4
            }
          })
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
  }, []) // Only run once on mount

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstance.current) return

    // For now, just log when data changes
    console.log('📍 Location data updated:', {
      coordinates: coordinates.length,
      currentLocation: !!currentLocation,
      pickup: !!pickupLocation,
      dropoff: !!dropoffLocation
    })
  }, [coordinates, currentLocation, pickupLocation, dropoffLocation])

  return (
    <div className="w-full h-full relative bg-gray-100">
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ 
          minHeight: '400px',
          height: '100%',
          width: '100%'
        }}
      />
      
      {/* Simple status indicator */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded text-xs border">
        <div>Ref: {mapRef.current ? '✅' : '❌'}</div>
        <div>Map: {mapInstance.current ? '✅' : '❌'}</div>
        <div>Coords: {coordinates.length}</div>
      </div>
    </div>
  )
}