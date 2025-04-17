"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Alert {
  id: string
  type: string
  severity: "low" | "moderate" | "high" | "severe"
  location: string
  timestamp: string
  description: string
}

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchAlerts = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/alerts')
        // const data = await response.json()

        // Mock data for demonstration
        setTimeout(() => {
          const mockAlerts: Alert[] = [
            {
              id: "flood-001",
              type: "Flood",
              severity: "moderate",
              location: "Cuttack District",
              timestamp: "2023-08-15T08:30:00Z",
              description: "Moderate flooding reported in Cuttack district due to heavy rainfall.",
            },
            {
              id: "cyclone-001",
              type: "Cyclone",
              severity: "high",
              location: "Coastal Odisha",
              timestamp: "2023-08-14T14:15:00Z",
              description: "Cyclonic storm approaching coastal Odisha with wind speeds of 100-110 km/h.",
            },
            {
              id: "heatwave-001",
              type: "Heatwave",
              severity: "low",
              location: "Western Odisha",
              timestamp: "2023-08-10T10:00:00Z",
              description: "Heatwave conditions expected in western districts with temperatures reaching 40°C.",
            },
          ]
          setAlerts(mockAlerts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-green-500">Low</Badge>
      case "moderate":
        return <Badge className="bg-orange-400">Moderate</Badge>
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "severe":
        return <Badge className="bg-red-700">Severe</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const mockSubscribe = () => {
    alert("This would subscribe you to alerts in a real application. Feature is mocked for demo purposes.")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-teal-700 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
        <CardDescription>Latest disaster alerts for Odisha</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.severity === "high" || alert.severity === "severe" ? "text-red-500" : "text-orange-400"
                      }`}
                    />
                    <span className="font-medium">{alert.type}</span>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{alert.location}</div>
                <p className="text-sm mt-2">{alert.description}</p>
                <div className="text-xs text-gray-500 mt-2">Issued: {formatDate(alert.timestamp)}</div>
              </div>
            ))}

            <div className="pt-2">
              <Link href="/alerts">
                <Button variant="outline" className="w-full text-teal-700 border-teal-700 hover:bg-teal-50">
                  View All Alerts
                </Button>
              </Link>
            </div>

            <div className="pt-1">
              <Button onClick={mockSubscribe} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Bell className="h-4 w-4 mr-2" />
                Subscribe to Alerts
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No active alerts at this time</div>
        )}
      </CardContent>
    </Card>
  )
}
