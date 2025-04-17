"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Lock, User } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple client-side authentication for demo purposes
    // In a real app, this would be handled by a secure server-side authentication system
    try {
      // Default credentials for demo
      if (username === "admin" && password === "disaster2024") {
        // Set a session token in localStorage (for demo only)
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            isAuthenticated: true,
            username: "admin",
            timestamp: Date.now(),
          }),
        )

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-teal-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2">Logging in...</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </CardFooter>
        </form>

        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-center text-gray-500">
            Default credentials for demo: username <strong>admin</strong>, password <strong>disaster2024</strong>
          </p>
        </div>
      </Card>
    </div>
  )
}
