"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchLocation: (query: string) => void
  weatherData: any | null
  setWeatherData: (data: any) => void
  mapLocation: { lat: number; lng: number } | null
  setMapLocation: (location: { lat: number; lng: number } | null) => void
  isSearching: boolean
  setIsSearching: (isSearching: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState<any | null>(null)
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const searchLocation = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    setSearchQuery(query)

    try {
      // Fetch weather data
      const weatherResponse = await fetch(`/api/weather?q=${encodeURIComponent(query)}`)
      if (weatherResponse.ok) {
        const data = await weatherResponse.json()
        setWeatherData(data)

        // Update map location based on weather data
        if (data && data.location) {
          setMapLocation({
            lat: data.location.lat,
            lng: data.location.lon,
          })
        }
      }
    } catch (error) {
      console.error("Error searching location:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchLocation,
        weatherData,
        setWeatherData,
        mapLocation,
        setMapLocation,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
