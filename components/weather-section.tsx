"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplets, Loader2, Sun, Wind } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/context/search-context"

export default function WeatherSection() {
  const { weatherData, isSearching } = useSearch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (weatherData) {
      setLoading(false)
    }
  }, [weatherData])

  const getAlertBadge = (condition: string, temp: number) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
      return <Badge className="bg-red-500">Severe</Badge>
    }
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <Badge className="bg-orange-400">Moderate Risk</Badge>
    }
    if (conditionLower.includes("snow")) {
      return <Badge className="bg-blue-500">Snow Alert</Badge>
    }
    if (temp > 40) {
      return <Badge className="bg-red-500">Extreme Heat</Badge>
    }
    if (temp > 35) {
      return <Badge className="bg-orange-400">Heat Alert</Badge>
    }
    if (temp < 5) {
      return <Badge className="bg-blue-500">Cold Alert</Badge>
    }
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      return <Badge className="bg-green-500">Clear</Badge>
    }

    return <Badge className="bg-gray-500">{condition}</Badge>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-teal-700">Current Weather</CardTitle>
        <CardDescription>
          {weatherData
            ? `${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`
            : "Search for a location"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading || isSearching ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : weatherData ? (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                    className="h-16 w-16"
                  />
                  <div>
                    <div className="text-3xl font-bold">{Math.round(weatherData.current.temp_c)}°C</div>
                    <div className="text-gray-500">{weatherData.current.condition.text}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {getAlertBadge(weatherData.current.condition.text, weatherData.current.temp_c)}
                  <span className="text-sm mt-1">{weatherData.current.condition.text}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-sky-50 rounded-lg">
                  <Droplets className="h-6 w-6 text-blue-500 mb-1" />
                  <span className="text-sm text-gray-500">Humidity</span>
                  <span className="font-medium">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-sky-50 rounded-lg">
                  <Wind className="h-6 w-6 text-blue-500 mb-1" />
                  <span className="text-sm text-gray-500">Wind</span>
                  <span className="font-medium">{weatherData.current.wind_kph} km/h</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-sky-50 rounded-lg">
                  <Sun className="h-6 w-6 text-blue-500 mb-1" />
                  <span className="text-sm text-gray-500">Feels Like</span>
                  <span className="font-medium">{Math.round(weatherData.current.feelslike_c)}°C</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Feels Like</div>
                    <div className="font-medium">{Math.round(weatherData.current.feelslike_c)}°C</div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Pressure</div>
                    <div className="font-medium">{weatherData.current.pressure_mb} hPa</div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Visibility</div>
                    <div className="font-medium">{weatherData.current.vis_km} km</div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">UV Index</div>
                    <div className="font-medium">{weatherData.current.uv}</div>
                  </div>
                </div>

                <div className="bg-sky-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Wind</div>
                  <div className="font-medium">
                    {weatherData.current.wind_kph} km/h from {weatherData.current.wind_dir} (
                    {weatherData.current.wind_degree}°)
                  </div>
                </div>

                <div className="bg-sky-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Local Time</div>
                  <div className="font-medium">{weatherData.location.localtime}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts">
              <div className="space-y-3">
                <div className="border-l-4 border-orange-400 bg-orange-50 p-3 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-orange-800">Weather Alert</div>
                    {getAlertBadge(weatherData.current.condition.text, weatherData.current.temp_c)}
                  </div>
                  <p className="text-sm mt-1">
                    Current conditions: {weatherData.current.condition.text} in {weatherData.location.name}.
                    {weatherData.current.condition.text.toLowerCase().includes("rain") &&
                      " Be prepared for possible flooding in low-lying areas."}
                    {weatherData.current.condition.text.toLowerCase().includes("thunder") &&
                      " Seek shelter immediately and avoid open areas."}
                    {weatherData.current.temp_c > 35 &&
                      " High temperature alert. Stay hydrated and avoid prolonged exposure to sun."}
                    {weatherData.current.temp_c < 5 &&
                      " Low temperature alert. Dress warmly and be cautious of icy conditions."}
                    {weatherData.current.wind_kph > 40 && " Strong winds alert. Secure loose objects outdoors."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-6 text-gray-500">Search for a location to see weather information</div>
        )}
      </CardContent>
    </Card>
  )
}
