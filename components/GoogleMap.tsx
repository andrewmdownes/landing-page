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

// Use your existing Google Maps API key
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

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)
        
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['maps', 'geometry']
        })

        await loader.load()

        if (!mapRef.current) return

        // Default center (Florida)
        let center = { lat: 28.5383, lng: -81.3792 } // Orlando, FL

        // If we have current location, center on that
        if (currentLocation) {
          center = {
            lat: currentLocation.latitude,
            lng: currentLocation.longitude
          }
        } else if (pickupLocation) {
          center = {
            lat: parseFloat(pickupLocation.latitude),
            lng: parseFloat(pickupLocation.longitude)
          }
        }

        const mapOptions: google.maps.MapOptions = {
          center,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#c9e2f3' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#dadada' }]
            }
          ]
        }

        const map = new google.maps.Map(mapRef.current, mapOptions)
        mapInstanceRef.current = map

        setError(null)
      } catch (err) {
        console.error('Error initializing Google Maps:', err)
        setError('Failed to load Google Maps. Please check your API key.')
      } finally {
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Clear existing markers and polylines
  const clearMapElements = () => {
    // Clear markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Clear polylines
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
  }

  // Update map with new data - fix dependencies
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return

    clearMapElements()

    const bounds = new google.maps.LatLngBounds()
    let hasValidCoordinates = false

    // Add pickup location marker
    if (pickupLocation) {
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

      const pickupInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>Pickup Location</strong><br/>
            ${pickupLocation.name}<br/>
            <small>${pickupLocation.address}</small>
          </div>
        `
      })

      pickupMarker.addListener('click', () => {
        pickupInfoWindow.open(mapInstanceRef.current, pickupMarker)
      })

      markersRef.current.push(pickupMarker)
      bounds.extend(pickupMarker.getPosition()!)
      hasValidCoordinates = true
    }

    // Add dropoff location marker
    if (dropoffLocation) {
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

      const dropoffInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>Dropoff Location</strong><br/>
            ${dropoffLocation.name}<br/>
            <small>${dropoffLocation.address}</small>
          </div>
        `
      })

      dropoffMarker.addListener('click', () => {
        dropoffInfoWindow.open(mapInstanceRef.current, dropoffMarker)
      })

      markersRef.current.push(dropoffMarker)
      bounds.extend(dropoffMarker.getPosition()!)
      hasValidCoordinates = true
    }

    // Add current location marker (if available)
    if (currentLocation) {
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

      const currentInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>Current Location</strong><br/>
            Updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}
          </div>
        `
      })

      currentMarker.addListener('click', () => {
        currentInfoWindow.open(mapInstanceRef.current, currentMarker)
      })

      markersRef.current.push(currentMarker)
      bounds.extend(currentMarker.getPosition()!)
      hasValidCoordinates = true
    }

    // Add coordinate trail (if available)
    if (coordinates.length > 1) {
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

      // Add all coordinates to bounds
      coordinates.forEach(coord => {
        bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude))
      })
      hasValidCoordinates = true
    }

    // Draw route between pickup and dropoff if both are available
    if (pickupLocation && dropoffLocation) {
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We're handling markers ourselves
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
        }
      })
    }

    // Fit map to bounds if we have valid coordinates
    if (hasValidCoordinates && !bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds)
      
      // Set minimum zoom level
      const listener = google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        if (mapInstanceRef.current!.getZoom()! > 15) {
          mapInstanceRef.current!.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }

  }, [coordinates, currentLocation, pickupLocation, dropoffLocation, isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5DBE62] mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map controls overlay */}
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
    </div>
  )
}