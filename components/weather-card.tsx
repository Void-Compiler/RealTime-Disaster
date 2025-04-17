"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Loader2, Sun, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  rainfall: number
  icon: React.ReactNode
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchWeather = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from a weather API
        // const response = await fetch('/api/weather?location=bhubaneswar')
        // const data = await response.json()

        // Mock data for demonstration
        setTimeout(() => {
          const mockWeather: WeatherData = {
            location: "Bhubaneswar, Odisha",
            temperature: 32,
            condition: "Partly Cloudy",
            humidity: 75,
            windSpeed: 12,
            rainfall: 0,
            icon: <Cloud className="h-8 w-8 text-gray-500" />,
          }
          setWeather(mockWeather)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching weather data:", error)
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "windy":
        return <Wind className="h-8 w-8 text-gray-500" />
      case "partly cloudy":
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>{weather?.location || "Loading location..."}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getWeatherIcon(weather.condition)}
                <span className="text-2xl font-bold">{weather.temperature}°C</span>
              </div>
              <span className="text-sm text-gray-500">{weather.condition}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-gray-500">Humidity</span>
                <span className="font-medium">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500">Wind</span>
                <span className="font-medium">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500">Rainfall</span>
                <span className="font-medium">{weather.rainfall} mm</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Failed to load weather data</div>
        )}
      </CardContent>
    </Card>
  )
}
