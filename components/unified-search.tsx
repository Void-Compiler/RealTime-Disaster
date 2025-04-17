"use client"

import type React from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/context/search-context"
import { useToast } from "@/hooks/use-toast"

export default function UnifiedSearch() {
  const { searchQuery, setSearchQuery, searchLocation, isSearching } = useSearch()
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    searchLocation(searchQuery)
  }

  const getUserLocation = () => {
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
        async (position) => {
          const { latitude, longitude } = position.coords

          // Use reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )

            if (response.ok) {
              const data = await response.json()
              if (data && data.display_name) {
                setSearchQuery(data.display_name)
                searchLocation(data.display_name)
              } else {
                // If we can't get a name, use coordinates
                searchLocation(`${latitude},${longitude}`)
              }
            } else {
              // If reverse geocoding fails, use coordinates
              searchLocation(`${latitude},${longitude}`)
            }
          } catch (error) {
            console.error("Error with reverse geocoding:", error)
            searchLocation(`${latitude},${longitude}`)
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
        },
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

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <Input
        placeholder="Search for a location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isSearching} className="bg-teal-600 hover:bg-teal-700">
        {isSearching ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
      <Button type="button" variant="outline" onClick={getUserLocation} title="Use my location">
        <MapPin className="h-4 w-4" />
      </Button>
    </form>
  )
}
