"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DisasterRisk {
  type: string
  level: "low" | "moderate" | "high" | "severe"
  description: string
}

export default function DisasterRiskAlert() {
  const [risk, setRisk] = useState<DisasterRisk | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchRiskData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/disaster-risk?location=bhubaneswar')
        // const data = await response.json()

        // Mock data for demonstration
        setTimeout(() => {
          const mockRisk: DisasterRisk = {
            type: "Flood",
            level: "moderate",
            description: "Moderate risk of flooding due to recent rainfall and rising water levels in nearby rivers.",
          }
          setRisk(mockRisk)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching risk data:", error)
        setLoading(false)
      }
    }

    fetchRiskData()
  }, [])

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-500">Low Risk</Badge>
      case "moderate":
        return <Badge className="bg-yellow-500">Moderate Risk</Badge>
      case "high":
        return <Badge className="bg-orange-500">High Risk</Badge>
      case "severe":
        return <Badge className="bg-red-600">Severe Risk</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Disaster Risk
        </CardTitle>
        <CardDescription>Current risk assessment for your area</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : risk ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{risk.type}</span>
              {getRiskBadge(risk.level)}
            </div>
            <p className="text-sm text-gray-500">{risk.description}</p>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No active risk alerts</div>
        )}
      </CardContent>
    </Card>
  )
}
