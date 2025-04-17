"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Check, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MobileRegistration() {
  const { toast } = useToast()
  const [mobileNumber, setMobileNumber] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation for Indian mobile numbers
    if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    try {
      // Call our SMS API to register the number
      const response = await fetch("/api/sms/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: mobileNumber }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Registration failed")
      }

      setIsRegistered(true)
      toast({
        title: "Registration successful",
        description: "You will now receive emergency alerts via SMS",
      })
    } catch (error) {
      console.error("Error registering mobile number:", error)
      toast({
        title: "Registration failed",
        description: "There was an error registering your mobile number. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const sendTestMessage = async () => {
    if (!isRegistered || !mobileNumber) {
      toast({
        title: "Not registered",
        description: "Please register your mobile number first",
        variant: "destructive",
      })
      return
    }

    try {
      // Call our SMS API to send a test message
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: mobileNumber,
          message:
            "This is a test alert from Disaster Alert System. In case of a real emergency, important safety information would be included here.",
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to send test message")
      }

      toast({
        title: "Test alert sent",
        description: `A test alert has been sent to ${mobileNumber}`,
      })
    } catch (error) {
      console.error("Error sending test message:", error)
      toast({
        title: "Failed to send test message",
        description: "There was an error sending the test message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-teal-700 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Emergency SMS Alerts
        </CardTitle>
        <CardDescription>Register your mobile number to receive emergency alerts via SMS</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile-number">Mobile Number</Label>
            <div className="flex gap-2">
              <Input
                id="mobile-number"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                disabled={isRegistered}
                className="flex-1"
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                title="Please enter a valid 10-digit Indian mobile number"
              />
              <Button type="submit" disabled={isRegistering || isRegistered} className="bg-teal-600 hover:bg-teal-700">
                {isRegistering ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : isRegistered ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </div>

          {isRegistered && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              Your mobile number has been registered successfully. You will receive alerts for emergencies in your area.
            </div>
          )}
        </CardContent>
      </form>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          onClick={sendTestMessage}
          disabled={!isRegistered}
        >
          <Bell className="h-4 w-4" />
          Send Test Alert
        </Button>
      </CardFooter>
    </Card>
  )
}
