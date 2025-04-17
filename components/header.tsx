"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { AlertTriangle, Bell, Menu, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAdmin = () => {
      const authData = localStorage.getItem("adminAuth")
      if (authData) {
        try {
          const { isAuthenticated } = JSON.parse(authData)
          setIsAdmin(isAuthenticated)
        } catch (error) {
          console.error("Auth check error:", error)
          setIsAdmin(false)
        }
      }
    }

    checkAdmin()
  }, [])

  const mockSubscribe = () => {
    alert("This would subscribe you to notifications in a real application. Feature is mocked for demo purposes.")
    setNotificationCount(0)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <AlertTriangle className="h-5 w-5 text-teal-600" />
                  <span>Odisha Alerts</span>
                </Link>
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <span>Home</span>
                </Link>
                <Link href="/history" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <span>History & Learning</span>
                </Link>
                <Link href="/report" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <span>Report Incident</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-teal-600" />
            <span className="hidden md:inline">Odisha Disaster Alert System</span>
            <span className="md:hidden">Odisha Alerts</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-teal-600">
            Home
          </Link>
          <Link href="/history" className="transition-colors hover:text-teal-600">
            History & Learning
          </Link>
          <Link href="/report" className="transition-colors hover:text-teal-600">
            Report Incident
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="transition-colors hover:text-teal-600 flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative" onClick={mockSubscribe}>
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          {!isAdmin && (
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
