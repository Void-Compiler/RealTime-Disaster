"use client"

import { useEffect, useState } from "react"
import { Info, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SafetyTip {
  id: number
  tip: string
}

export default function SafetyTips() {
  const [tips, setTips] = useState<SafetyTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchSafetyTips = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/safety-tips?disaster=flood&level=moderate')
        // const data = await response.json()

        // Mock data for demonstration
        setTimeout(() => {
          const mockTips: SafetyTip[] = [
            { id: 1, tip: "Stay informed through local news and weather updates." },
            { id: 2, tip: "Keep emergency supplies ready, including food, water, and medications." },
            { id: 3, tip: "Avoid areas prone to flooding and follow evacuation orders if issued." },
            { id: 4, tip: "Move valuable items to higher levels in your home if flooding is expected." },
          ]
          setTips(mockTips)
          setLoading(false)
        }, 1200)
      } catch (error) {
        console.error("Error fetching safety tips:", error)
        setLoading(false)
      }
    }

    fetchSafetyTips()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Safety Tips
        </CardTitle>
        <CardDescription>AI-generated safety recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : tips.length > 0 ? (
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip.id} className="text-sm">
                • {tip.tip}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-gray-500">No safety tips available</div>
        )}
      </CardContent>
    </Card>
  )
}
