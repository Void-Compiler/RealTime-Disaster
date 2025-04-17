"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAlert } from "@/context/alert-context"
import { motion, AnimatePresence } from "framer-motion"

export default function EmergencyBulletin() {
  const { activeAlert, showBulletin, dismissAlert } = useAlert()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showBulletin && activeAlert) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [showBulletin, activeAlert])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-red-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <div>
                  <div className="font-bold text-lg">
                    {activeAlert?.type} Alert: {activeAlert?.severity} - {activeAlert?.location}
                  </div>
                  <p>{activeAlert?.message}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={dismissAlert} className="text-white hover:bg-red-700">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
