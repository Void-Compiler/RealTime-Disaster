"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ArrowUpRight, Filter, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface DisasterAlert {
  id: string
  type: "flood" | "cyclone" | "earthquake" | "heatwave"
  severity: "minor" | "moderate" | "severe" | "extreme"
  location: string
  affectedAreas: string[]
  timestamp: string
  description: string
  safetyInstructions: string[]
  shelters?: { name: string; location: string; capacity: number }[]
}

export default function DisasterAlertDashboard() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  useEffect(() => {
    // Simulate API call with mock data
    const fetchAlerts = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/disaster-alerts')
        // const data = await response.json()

        // Mock data for demonstration
        setTimeout(() => {
          const mockAlerts: DisasterAlert[] = [
            {
              id: "flood-001",
              type: "flood",
              severity: "moderate",
              location: "Cuttack District",
              affectedAreas: ["Cuttack", "Choudwar", "Banki"],
              timestamp: "2023-08-15T08:30:00Z",
              description:
                "Moderate flooding reported in Cuttack district due to heavy rainfall and rising water levels in Mahanadi River.",
              safetyInstructions: [
                "Move to higher ground immediately if in low-lying areas",
                "Avoid walking or driving through flood waters",
                "Follow evacuation orders if issued by local authorities",
                "Keep emergency supplies ready",
              ],
              shelters: [
                { name: "Cuttack High School", location: "MG Road, Cuttack", capacity: 200 },
                { name: "Government College", location: "College Square, Cuttack", capacity: 350 },
              ],
            },
            {
              id: "cyclone-001",
              type: "cyclone",
              severity: "severe",
              location: "Coastal Odisha",
              affectedAreas: ["Puri", "Konark", "Astaranga", "Kakatpur"],
              timestamp: "2023-09-20T14:15:00Z",
              description:
                "Severe cyclonic storm approaching coastal Odisha with wind speeds of 120-130 km/h. Expected landfall near Puri within 24 hours.",
              safetyInstructions: [
                "Stay indoors and away from windows",
                "Secure loose objects that could be blown away",
                "Keep emergency supplies including food, water, and medications",
                "Follow evacuation orders immediately if issued",
                "Keep mobile phones charged and stay updated with official alerts",
              ],
              shelters: [
                { name: "Puri Town Hall", location: "Grand Road, Puri", capacity: 500 },
                { name: "Government School", location: "Beach Road, Puri", capacity: 300 },
              ],
            },
            {
              id: "earthquake-001",
              type: "earthquake",
              severity: "minor",
              location: "Western Odisha",
              affectedAreas: ["Sambalpur", "Bargarh", "Jharsuguda"],
              timestamp: "2023-10-05T03:45:00Z",
              description:
                "Minor earthquake of magnitude 3.5 recorded in Western Odisha. No major damage reported, but aftershocks possible.",
              safetyInstructions: [
                "Drop, cover, and hold on if you feel shaking",
                "Stay away from windows and exterior walls",
                "Be prepared for aftershocks",
                "Check for gas leaks or damage to utilities",
              ],
            },
            {
              id: "heatwave-001",
              type: "heatwave",
              severity: "extreme",
              location: "Interior Odisha",
              affectedAreas: ["Bolangir", "Titlagarh", "Sonepur", "Boudh"],
              timestamp: "2023-05-12T10:00:00Z",
              description:
                "Extreme heatwave conditions with temperatures exceeding 45°C expected to continue for the next 3-4 days.",
              safetyInstructions: [
                "Stay indoors during peak heat hours (11 AM - 4 PM)",
                "Drink plenty of water and stay hydrated",
                "Wear lightweight, light-colored clothing",
                "Check on elderly neighbors and those without air conditioning",
                "Never leave children or pets in parked vehicles",
              ],
            },
          ]
          setAlerts(mockAlerts)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "minor":
        return <Badge className="bg-yellow-500">Minor</Badge>
      case "moderate":
        return <Badge className="bg-orange-500">Moderate</Badge>
      case "severe":
        return <Badge className="bg-red-600">Severe</Badge>
      case "extreme":
        return <Badge className="bg-purple-700">Extreme</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flood":
        return "💧"
      case "cyclone":
        return "🌀"
      case "earthquake":
        return "🌋"
      case "heatwave":
        return "🔥"
      default:
        return "⚠️"
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(alert.type)

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search alerts by location or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("flood")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, "flood"])
                  } else {
                    setSelectedTypes(selectedTypes.filter((type) => type !== "flood"))
                  }
                }}
              >
                Floods
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("cyclone")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, "cyclone"])
                  } else {
                    setSelectedTypes(selectedTypes.filter((type) => type !== "cyclone"))
                  }
                }}
              >
                Cyclones
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("earthquake")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, "earthquake"])
                  } else {
                    setSelectedTypes(selectedTypes.filter((type) => type !== "earthquake"))
                  }
                }}
              >
                Earthquakes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("heatwave")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, "heatwave"])
                  } else {
                    setSelectedTypes(selectedTypes.filter((type) => type !== "heatwave"))
                  }
                }}
              >
                Heatwaves
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="severe">Severe & Extreme</TabsTrigger>
          <TabsTrigger value="recent">Recent (24h)</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>
                          {getTypeIcon(alert.type)} {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </span>
                      </CardTitle>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <CardDescription>{alert.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{alert.description}</p>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Affected Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.affectedAreas.map((area) => (
                          <Badge key={area} variant="outline">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Safety Instructions:</h4>
                      <ul className="text-sm">
                        {alert.safetyInstructions.slice(0, 3).map((instruction, index) => (
                          <li key={index} className="mb-1">
                            • {instruction}
                          </li>
                        ))}
                        {alert.safetyInstructions.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            + {alert.safetyInstructions.length - 3} more instructions
                          </li>
                        )}
                      </ul>
                    </div>
                    {alert.shelters && (
                      <div className="pt-2">
                        <Link href={`/alerts/${alert.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <span>View Shelters & Details</span>
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || selectedTypes.length > 0
                  ? "Try adjusting your search or filters"
                  : "There are currently no active alerts for your area"}
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="severe" className="mt-4">
          {/* Similar content as "all" but filtered for severe & extreme alerts */}
          <div className="grid gap-6 md:grid-cols-2">
            {alerts
              .filter((alert) => ["severe", "extreme"].includes(alert.severity))
              .map((alert) => (
                <Card key={alert.id} className="overflow-hidden">
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>
                          {getTypeIcon(alert.type)} {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </span>
                      </CardTitle>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <CardDescription>{alert.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{alert.description}</p>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Affected Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.affectedAreas.map((area) => (
                          <Badge key={area} variant="outline">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Safety Instructions:</h4>
                      <ul className="text-sm">
                        {alert.safetyInstructions.slice(0, 3).map((instruction, index) => (
                          <li key={index} className="mb-1">
                            • {instruction}
                          </li>
                        ))}
                        {alert.safetyInstructions.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            + {alert.safetyInstructions.length - 3} more instructions
                          </li>
                        )}
                      </ul>
                    </div>
                    {alert.shelters && (
                      <div className="pt-2">
                        <Link href={`/alerts/${alert.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <span>View Shelters & Details</span>
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          {/* Similar content as "all" but filtered for recent alerts */}
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No recent alerts</h3>
            <p className="mt-2 text-sm text-gray-500">There are no new alerts in the last 24 hours</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
