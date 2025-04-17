"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Camera, MapPin, Upload } from "lucide-react"

export default function IncidentReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    incidentType: "",
    location: "",
    description: "",
    severity: "moderate",
    name: "",
    contact: "",
    useLocation: false,
    images: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }))
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter your location manually.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          useLocation: true,
        }))

        alert("Location detected and added to the report.")
      },
      (error) => {
        console.error("Error getting location:", error)

        // Handle specific error types
        if (error.code === 1) {
          // PERMISSION_DENIED
          alert("Location permission denied. Please enter your location manually.")
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          alert("Location information is unavailable. Please enter your location manually.")
        } else if (error.code === 3) {
          // TIMEOUT
          alert("The request to get your location timed out. Please try again or enter your location manually.")
        } else {
          alert("Unable to retrieve your location. Please enter your location manually.")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Thank you for your report. Authorities have been notified.")

      // Reset form
      setFormData({
        incidentType: "",
        location: "",
        description: "",
        severity: "moderate",
        name: "",
        contact: "",
        useLocation: false,
        images: [],
      })
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("There was an error submitting your report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-700">
          <AlertTriangle className="h-5 w-5" />
          Incident Report Form
        </CardTitle>
        <CardDescription>
          Report a disaster or emergency situation in your area. Your information helps us respond quickly.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type</Label>
                <Select
                  required
                  value={formData.incidentType}
                  onValueChange={(value) => handleSelectChange("incidentType", value)}
                >
                  <SelectTrigger id="incidentType">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="cyclone">Cyclone</SelectItem>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="landslide">Landslide</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <RadioGroup
                  defaultValue="moderate"
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange("severity", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="minor" id="minor" />
                    <Label htmlFor="minor" className="text-sm font-normal">
                      Minor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="text-sm font-normal">
                      Moderate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe" className="text-sm font-normal">
                      Severe
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseLocation}
                  className="h-7 gap-1 text-xs"
                >
                  <MapPin className="h-3 w-3" />
                  Use My Location
                </Button>
              </div>
              <Input
                id="location"
                name="location"
                placeholder="Enter location details"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the incident, including any immediate dangers or needs"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Images (Optional)</Label>
              <div className="grid gap-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium">Your Contact Information (Optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Phone Number</Label>
                  <Input
                    id="contact"
                    name="contact"
                    placeholder="Your phone number"
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
            {isSubmitting ? (
              <>
                <span className="mr-2">Submitting...</span>
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
                <Upload className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
