"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, Loader2, MapPin, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSearch } from "@/context/search-context"

interface DisasterInfo {
  type: string
  severity: "low" | "moderate" | "high" | "severe" | "extreme"
  riskScore: number
  explanation: string
  potentialHazards: string[]
  safetyRecommendations: string[]
  shelters: {
    name: string
    distance: string
    capacity: string
  }[]
}

export default function SafetyTipsSection() {
  const { weatherData } = useSearch()
  const [disasterInfo, setDisasterInfo] = useState<DisasterInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // If we have weather data, get AI analysis and shelters
    if (weatherData) {
      getDisasterAnalysis(weatherData)
    } else {
      // If no weather data provided, set loading to false
      setLoading(false)
    }
  }, [weatherData])

  const getDisasterAnalysis = async (weather: any) => {
    setLoading(true)
    try {
      // Get AI analysis of disaster risk
      const analysisResponse = await fetch("/api/ai/disaster-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weatherData: weather,
          location: `${weather.location.name}, ${weather.location.region}, ${weather.location.country}`,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error(`Error getting disaster analysis: ${analysisResponse.status}`)
      }

      const analysisData = await analysisResponse.json()

      if (!analysisData.success) {
        throw new Error(analysisData.error || "Failed to get disaster analysis")
      }

      // Get shelters for this location
      const sheltersResponse = await fetch(
        `/api/shelters?location=${encodeURIComponent(weather.location.name)}&lat=${weather.location.lat}&lon=${weather.location.lon}`,
      )

      if (!sheltersResponse.ok) {
        throw new Error(`Error getting shelters: ${sheltersResponse.status}`)
      }

      const sheltersData = await sheltersResponse.json()

      if (!sheltersData.success) {
        throw new Error(sheltersData.error || "Failed to get shelters")
      }

      // Combine the data
      const analysis = analysisData.analysis
      const disasterInfo: DisasterInfo = {
        type: weather.current.condition.text,
        severity: analysis.riskLevel.toLowerCase() as DisasterInfo["severity"],
        riskScore: analysis.riskScore,
        explanation: analysis.explanation,
        potentialHazards: analysis.potentialHazards,
        safetyRecommendations: analysis.safetyRecommendations,
        shelters: sheltersData.shelters,
      }

      setDisasterInfo(disasterInfo)
    } catch (error) {
      console.error("Error fetching disaster info:", error)
      toast({
        title: "Error",
        description: "Failed to load safety information. Please try again.",
        variant: "destructive",
      })

      // Set fallback data
      setDisasterInfo({
        type: weather.current.condition.text,
        severity: "moderate",
        riskScore: 3,
        explanation: "Based on current weather conditions, there is a moderate risk level.",
        potentialHazards: ["Weather-related hazards", "Potential travel disruptions"],
        safetyRecommendations: [
          "Stay informed about weather updates",
          "Keep emergency supplies ready",
          "Follow official guidance",
        ],
        shelters: [
          { name: "Local Community Center", distance: "5.0 km", capacity: "500 people" },
          { name: "Regional Emergency Shelter", distance: "7.5 km", capacity: "600 people" },
          { name: "District Relief Camp", distance: "10.0 km", capacity: "800 people" },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return <Badge className="bg-green-500">Low Risk</Badge>
      case "moderate":
        return <Badge className="bg-orange-400">Moderate Risk</Badge>
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>
      case "severe":
        return <Badge className="bg-red-700">Severe Risk</Badge>
      case "extreme":
        return <Badge className="bg-purple-700">Extreme Risk</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-teal-700 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              AI Safety Analysis
            </CardTitle>
            <CardDescription>
              {weatherData
                ? `For ${weatherData.location.name}, ${weatherData.location.region}`
                : "Search for a location to see safety information"}
            </CardDescription>
          </div>
          {disasterInfo && getSeverityBadge(disasterInfo.severity)}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : disasterInfo && weatherData ? (
          <div className="space-y-4">
            <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
              <div className="font-medium text-orange-800 mb-1">{disasterInfo.type} Safety Information</div>
              <p className="text-sm">{disasterInfo.explanation}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-1 mb-2 text-red-700">
                <AlertTriangle className="h-4 w-4" /> Potential Hazards
              </h3>
              <ul className="space-y-1">
                {disasterInfo.potentialHazards.map((hazard, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-1">⚠</span>
                    <span>{hazard}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-1 mb-2 text-green-700">
                <AlertTriangle className="h-4 w-4" /> Safety Recommendations
              </h3>
              <ul className="space-y-1">
                {disasterInfo.safetyRecommendations.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                <Home className="h-4 w-4" /> Nearby Shelters
              </h3>
              <div className="space-y-2">
                {disasterInfo.shelters.map((shelter, index) => (
                  <div key={index} className="bg-sky-50 p-2 rounded-lg text-sm">
                    <div className="font-medium">{shelter.name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {shelter.distance}
                      </span>
                      <span>Capacity: {shelter.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            {weatherData
              ? "No safety information available for this location"
              : "Search for a location to see safety information"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
