"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Check, LogOut, Plus, RefreshCw, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: "flood-001",
      type: "flood",
      severity: "moderate",
      location: "Cuttack District",
      timestamp: new Date().toISOString(),
    },
    {
      id: "cyclone-001",
      type: "cyclone",
      severity: "severe",
      location: "Coastal Odisha",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ])

  const [newAlert, setNewAlert] = useState({
    type: "",
    severity: "moderate",
    location: "",
    description: "",
    affectedAreas: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingEmergency, setIsSendingEmergency] = useState(false)
  const [registeredNumbers, setRegisteredNumbers] = useState<string[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authData = localStorage.getItem("adminAuth")
      if (!authData) {
        router.push("/admin/login")
        return
      }

      try {
        const { isAuthenticated, timestamp } = JSON.parse(authData)

        // Check if the session is still valid (24 hours)
        const isValid = isAuthenticated && Date.now() - timestamp < 24 * 60 * 60 * 1000

        if (!isValid) {
          localStorage.removeItem("adminAuth")
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)

        // Fetch registered numbers
        fetchRegisteredNumbers()
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("adminAuth")
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchRegisteredNumbers = async () => {
    try {
      // In a real app, you would fetch this from your API
      // For demo purposes, we'll use mock data
      setRegisteredNumbers(["+919876543210", "+919876543211", "+919876543212"])
    } catch (error) {
      console.error("Error fetching registered numbers:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAlert((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAlert((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would submit to an API
      // await fetch('/api/admin/alerts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAlert)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add to active alerts
      const newId = `${newAlert.type}-${Date.now()}`
      const createdAlert = {
        id: newId,
        type: newAlert.type,
        severity: newAlert.severity,
        location: newAlert.location,
        timestamp: new Date().toISOString(),
      }

      setActiveAlerts((prev) => [createdAlert, ...prev])

      toast({
        title: "Alert created",
        description: "The new alert has been created and published.",
      })

      // Reset form
      setNewAlert({
        type: "",
        severity: "moderate",
        location: "",
        description: "",
        affectedAreas: "",
        message: "",
      })
    } catch (error) {
      console.error("Error creating alert:", error)
      toast({
        title: "Creation failed",
        description: "There was an error creating the alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      // In a real app, you would submit to an API
      // await fetch(`/api/admin/alerts/${id}`, {
      //   method: 'DELETE'
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from active alerts
      setActiveAlerts((prev) => prev.filter((alert) => alert.id !== id))

      toast({
        title: "Alert deleted",
        description: "The alert has been removed from the system.",
      })
    } catch (error) {
      console.error("Error deleting alert:", error)
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTestAlert = async () => {
    toast({
      title: "Test alert sent",
      description: "A test notification has been sent to all connected devices.",
    })
  }

  const handleSendEmergencyAlert = async (alert: any) => {
    setIsSendingEmergency(true)

    try {
      // Create emergency message
      const emergencyAlert = {
        ...alert,
        message: `EMERGENCY: ${alert.severity.toUpperCase()} ${alert.type.toUpperCase()} alert in ${alert.location}. Take immediate action. Stay tuned for updates.`,
      }

      // Set as active alert for the bulletin
      await fetch("/api/alerts/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert: emergencyAlert }),
      })

      // Send SMS to registered numbers
      await fetch("/api/alerts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emergencyAlert),
      })

      toast({
        title: "Emergency alert sent",
        description: `Emergency alert sent to ${registeredNumbers.length} registered numbers and displayed on the website.`,
      })
    } catch (error) {
      console.error("Error sending emergency alert:", error)
      toast({
        title: "Emergency alert failed",
        description: "There was an error sending the emergency alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmergency(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Admin Dashboard</h1>
          <p className="text-gray-500">Manage disaster alerts and system settings</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Manage Alerts</TabsTrigger>
          <TabsTrigger value="create">Create Alert</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Active Alerts
              </CardTitle>
              <CardDescription>Manage currently active disaster alerts in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length > 0 ? (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                            </span>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <span className="text-sm text-gray-500">{alert.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleTestAlert}>
                          <Bell className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-700 hover:bg-red-800"
                          onClick={() => handleSendEmergencyAlert(alert)}
                          disabled={isSendingEmergency}
                        >
                          {isSendingEmergency ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Emergency
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">No active alerts in the system</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Alerts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Create New Alert
              </CardTitle>
              <CardDescription>Create and publish a new disaster alert to the system</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateAlert}>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Alert Type</Label>
                    <Select required value={newAlert.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="cyclone">Cyclone</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="landslide">Landslide</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="heatwave">Heatwave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      required
                      value={newAlert.severity}
                      onValueChange={(value) => handleSelectChange("severity", value)}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter affected location"
                    value={newAlert.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affectedAreas">Affected Areas</Label>
                  <Input
                    id="affectedAreas"
                    name="affectedAreas"
                    placeholder="Enter affected areas (comma separated)"
                    value={newAlert.affectedAreas}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the disaster situation"
                    rows={4}
                    value={newAlert.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Emergency Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter emergency message to be sent via SMS"
                    rows={2}
                    value={newAlert.message}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">
                    This message will be sent to all registered users in case of emergency.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Creating...</span>
                      <span className="animate-spin">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Alert
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system settings and data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenWeatherMap API Key</Label>
                <Input id="api-key" type="password" value="a08475a8cc20b8b9b645b376aeb99348" readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Data Refresh Interval (minutes)</Label>
                <Input id="refresh-interval" type="number" defaultValue={15} min={5} max={60} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-radius">Notification Radius (km)</Label>
                <Input id="notification-radius" type="number" defaultValue={50} min={10} max={200} />
              </div>

              <div className="space-y-2">
                <Label>Registered Numbers ({registeredNumbers.length})</Label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {registeredNumbers.length > 0 ? (
                    <ul className="space-y-1">
                      {registeredNumbers.map((number, index) => (
                        <li key={index} className="text-sm">
                          {number}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No registered numbers yet.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Demo Mode</Label>
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      handleSendEmergencyAlert({
                        id: `cyclone-${Date.now()}`,
                        type: "cyclone",
                        severity: "severe",
                        location: "Coastal Odisha",
                        message:
                          "EMERGENCY: SEVERE CYCLONE approaching coastal Odisha. Wind speeds of 120-130 km/h expected. Evacuate to designated shelters immediately. Stay tuned for updates.",
                      })
                    }
                  >
                    Trigger Demo Cyclone Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      handleSendEmergencyAlert({
                        id: `flood-${Date.now()}`,
                        type: "flood",
                        severity: "extreme",
                        location: "Mahanadi River Basin",
                        message:
                          "EMERGENCY: EXTREME FLOOD alert for Mahanadi River Basin. Immediate evacuation required from low-lying areas. Water levels rising rapidly.",
                      })
                    }
                  >
                    Trigger Demo Flood Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      handleSendEmergencyAlert({
                        id: `earthquake-${Date.now()}`,
                        type: "earthquake",
                        severity: "high",
                        location: "Western Odisha",
                        message:
                          "EMERGENCY: HIGH EARTHQUAKE alert in Western Odisha. Magnitude 5.8 recorded. Take cover under sturdy furniture. Stay away from buildings and power lines.",
                      })
                    }
                  >
                    Trigger Demo Earthquake Alert
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
