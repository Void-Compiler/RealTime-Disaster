"use client"

declare module "*.css";

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useSearch } from "@/context/search-context"
import { useToast } from "@/hooks/use-toast"

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [weatherMarkers, setWeatherMarkers] = useState<any[]>([])
  const { weatherData, mapLocation, isSearching } = useSearch()
  const { toast } = useToast()

  // Default coordinates for India (center)
  const defaultCoordinates = { lat: 20.5937, lng: 78.9629 }

  useEffect(() => {
    // Dynamic import of leaflet
    import("leaflet").then((L) => {
      setLeaflet(L)

      // Import leaflet CSS
      import("leaflet/dist/leaflet.css")

      // Initialize map
      if (mapRef.current && !map) {
        const leafletMap = L.map(mapRef.current)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMap)

        setMap(leafletMap)
        setLoading(false)

        // Set default view (center of India)
        leafletMap.setView([defaultCoordinates.lat, defaultCoordinates.lng], 5)

        // Fetch earthquake data
        fetchEarthquakeData(leafletMap, L)
      }
    })

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Update map when location changes
  useEffect(() => {
    if (map && leaflet && mapLocation) {
      // Update map view
      map.setView([mapLocation.lat, mapLocation.lng], 10)
      
      // Clear previous location markers
      map.eachLayer((layer: any) => {
        if (
          layer instanceof leaflet.Marker &&
          layer._popup &&
          layer._popup.getContent().includes("Searched Location")
        ) {
          map.removeLayer(layer)
        }
      })
      
      // Add new marker
      leaflet
        .marker([mapLocation.lat, mapLocation.lng])
        .addTo(map)
        .bindPopup(`Searched Location: ${weatherData?.location.name || ""}`)
        .openPopup()
    }
  }, [map, leaflet, mapLocation, weatherData])

  // Fetch earthquake data from USGS API
  const fetchEarthquakeData = async (mapInstance = map, leafletInstance = leaflet) => {
    try {
      const response = await fetch("/api/earthquakes")
      const data = await response.json()

      // Add earthquake data to map
      if (mapInstance && leafletInstance && data.features) {
        data.features.forEach((quake: any) => {
          const coords = quake.geometry.coordinates
          const magnitude = quake.properties.mag
          const title = quake.properties.title

          // Size and color based on magnitude
          const radius = Math.max(magnitude * 5000, 10000)
          const color = magnitude > 5 ? "#ff0000" : magnitude > 4 ? "#ff6600" : "#ffcc00"

          leafletInstance
            .circle([coords[1], coords[0]], {
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              radius: radius,
            })
            .addTo(mapInstance)
            .bindPopup(`
              <b>${title}</b><br>
              Magnitude: ${magnitude}<br>
              Time: ${new Date(quake.properties.time).toLocaleString()}<br>
              Depth: ${coords[2]} km
            `)
        })
      }
    } catch (error) {
      console.error("Error fetching earthquake data:", error)
    }
  }

  const findMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please search manually.",
        variant: "destructive",
      })
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          if (map && leaflet) {
            map.setView([latitude, longitude], 10)

            // Clear previous user location markers
            map.eachLayer((layer: any) => {
              if (
                layer instanceof leaflet.Marker &&
                layer._popup &&
                layer._popup.getContent().includes("Your Location")
              ) {
                map.removeLayer(layer)
              }
            })

            // Add new marker
            leaflet.marker([latitude, longitude]).addTo(map).bindPopup("Your Location").openPopup()
          }
        },
        (error) => {
          console.error("Error getting location:", error)

          let errorMessage = "Unable to get your location. Please search manually."

          // Handle specific error types
          if (error.code === 1) {
            errorMessage = "Location permission denied. Please enable location access in your browser settings."
          } else if (error.code === 2) {
            errorMessage = "Location information is unavailable."
          } else if (error.code === 3) {
            errorMessage = "Location request timed out. Please try again."
          }

          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      )
    } catch (error) {
      console.error("Geolocation error:", error)
      toast({
        title: "Geolocation error",
        description: "There was an error accessing your location. Please search manually.",
        variant: "destructive",
      })
    }
  }

  // Function to add weather data for nearby cities
  const addNearbyWeatherData = async () => {
    if (!map || !leaflet) return

    // Use current map center
    const centerPoint = { lat: map.getCenter().lat, lng: map.getCenter().lng }

    // Define nearby cities around the center point (approximately within 100-200km)
    const nearbyOffsets = [
      { lat: 0.5, lng: 0.5 },
      { lat: -0.5, lng: 0.5 },
      { lat: 0.5, lng: -0.5 },
      { lat: -0.5, lng: -0.5 },
      { lat: 0, lng: 0.7 },
      { lat: 0.7, lng: 0 },
      { lat: 0, lng: -0.7 },
      { lat: -0.7, lng: 0 },
    ]

    // Clear existing weather markers except for the current location
    weatherMarkers.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
    setWeatherMarkers([])

    toast({
      title: "Loading nearby weather",
      description: "Fetching weather data for nearby locations...",
    })

    // Add weather data for nearby locations
    for (const offset of nearbyOffsets) {
      const lat = centerPoint.lat + offset.lat
      const lng = centerPoint.lng + offset.lng

      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}`)
        if (response.ok) {
          const data = await response.json()
          addWeatherMarker(data, map, leaflet)
        }
      } catch (error) {
        console.error(`Error fetching weather for nearby location (${lat}, ${lng}):`, error)
      }
    }
  }

  // Add weather marker to the map
  const addWeatherMarker = (data: any, mapInstance: any, leafletInstance: any) => {
    // Create a custom icon based on the weather condition
    const getWeatherIconUrl = (iconCode: string) => {
      // WeatherAPI icon format
      return `https:${iconCode}`
    }

    const weatherIcon = leafletInstance.divIcon({
      html: `
        <div class="bg-white p-1 rounded-full border border-blue-500 flex items-center justify-center" style="width: 40px; height: 40px;">
          <img src="${getWeatherIconUrl(data.current.condition.icon)}" alt="${data.current.condition.text}" style="width: 100%; height: 100%;" />
        </div>
      `,
      className: "weather-icon",
      iconSize: [40, 40],
    })

    // Create the marker
    const marker = leafletInstance
      .marker([data.location.lat, data.location.lon], { icon: weatherIcon })
      .addTo(mapInstance)
      .bindPopup(
        `
        <div class="weather-popup">
          <h3 class="font-bold">${data.location.name}, ${data.location.region}</h3>
          <div class="flex items-center">
            <img src="${getWeatherIconUrl(data.current.condition.icon)}" alt="${data.current.condition.text}" width="50" />
            <span class="text-xl">${data.current.temp_c}°C</span>
          </div>
          <p>${data.current.condition.text}</p>
          <div class="text-sm mt-2">
            <div>Humidity: ${data.current.humidity}%</div>
            <div>Wind: ${data.current.wind_kph} km/h</div>
            <div>Feels like: ${data.current.feelslike_c}°C</div>
          </div>
        </div>
      `,
        { maxWidth: 300 },
      )

    // Store the marker reference to remove it later if needed
    setWeatherMarkers((prev) => [...prev, marker])

    return marker
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-teal-700">Disaster Map</CardTitle>
        <CardDescription>View current weather patterns and disaster zones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full rounded-md overflow-hidden border">
          {(loading || isSearching) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
            </div>
          )}
          <div ref={mapRef} className="h-full w-full z-0"></div>

          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button
              onClick={findMyLocation}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Find My Location</span>
            </Button>
            <Button
              onClick={addNearbyWeatherData}
              variant="outline"
              className="bg-white hover:bg-gray-100 flex items-center gap-2"
            >
              <span>Show Nearby Weather</span>
            </Button>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md">
            <div className="text-sm font-medium mb-1">Map Legend</div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-70"></div>
                <span>Heavy Rainfall</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
                <span>Strong Winds</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
                <span>Safe Zones</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
                <span>Earthquakes</span>
              </div>
            </div>
          </div>
        </div>
            </CardContent>
        </Card>
      )}
