"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationMapProps {
  className?: string
}

export default function LocationMap({ className }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [map, setMap] = useState<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)

  // Default coordinates for Odisha
  const defaultCoordinates = { lat: 20.2961, lng: 85.8245 }

  useEffect(() => {
    // Dynamic import of leaflet
    import("leaflet").then((L) => {
      setLeaflet(L)

      // Import leaflet CSS
      import("leaflet/dist/leaflet.css")

      // Initialize map
      if (mapRef.current && !map) {
        const leafletMap = L.map(mapRef.current).setView([defaultCoordinates.lat, defaultCoordinates.lng], 7)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMap)

        // Add marker for Odisha
        L.marker([defaultCoordinates.lat, defaultCoordinates.lng])
          .addTo(leafletMap)
          .bindPopup("Bhubaneswar, Odisha")
          .openPopup()

        setMap(leafletMap)
        setLoading(false)
      }
    })

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [map])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })

          if (map && leaflet) {
            map.setView([latitude, longitude], 10)

            // Clear previous markers
            map.eachLayer((layer: any) => {
              if (layer instanceof leaflet.Marker) {
                map.removeLayer(layer)
              }
            })

            // Add new marker
            leaflet.marker([latitude, longitude]).addTo(map).bindPopup("Your Location").openPopup()
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div className={`relative h-[400px] ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Button onClick={getUserLocation} className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Find My Location</span>
        </Button>
      </div>
    </div>
  )
}
