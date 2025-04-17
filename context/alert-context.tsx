"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"

interface AlertContextType {
  activeAlert: {
    id: string
    type: string
    severity: string
    location: string
    message: string
    timestamp: string
  } | null
  setActiveAlert: (alert: any | null) => void
  showBulletin: boolean
  setShowBulletin: (show: boolean) => void
  dismissAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<any | null>(null)
  const [showBulletin, setShowBulletin] = useState(false)

  // Check for alerts on load
  useEffect(() => {
    const checkForAlerts = async () => {
      try {
        const response = await fetch("/api/alerts/active")
        if (response.ok) {
          const data = await response.json()
          if (data.alert) {
            setActiveAlert(data.alert)
            setShowBulletin(true)
          }
        }
      } catch (error) {
        console.error("Error checking for alerts:", error)
      }
    }

    checkForAlerts()

    // Poll for new alerts every 30 seconds
    const interval = setInterval(checkForAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const dismissAlert = () => {
    setShowBulletin(false)
  }

  return (
    <AlertContext.Provider
      value={{
        activeAlert,
        setActiveAlert,
        showBulletin,
        setShowBulletin,
        dismissAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}
