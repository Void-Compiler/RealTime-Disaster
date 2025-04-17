"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface HistoricalDisaster {
  id: string
  type: string
  name?: string
  date: string
  location: string
  description: string
  impact: string
  casualties?: number
  economicLoss?: string
  imageUrl: string
}

export default function DisasterHistorySection() {
  const [activeTab, setActiveTab] = useState("all")

  const historicalDisasters: HistoricalDisaster[] = [
    {
      id: "super-cyclone-1999",
      type: "cyclone",
      name: "Super Cyclone",
      date: "October 29, 1999",
      location: "Coastal Odisha",
      description:
        "One of the most severe cyclones to hit Odisha with wind speeds of up to 260 km/h. It made landfall near Paradip and caused widespread devastation.",
      impact:
        "The cyclone caused extensive damage to infrastructure, agriculture, and housing. It resulted in massive flooding and storm surges that inundated coastal areas.",
      casualties: 9887,
      economicLoss: "₹13,000 crore",
      imageUrl: "/images/super-cyclone-1999.jpg",
    },
    {
      id: "phailin-2013",
      type: "cyclone",
      name: "Cyclone Phailin",
      date: "October 12, 2013",
      location: "Gopalpur, Odisha",
      description:
        "Very Severe Cyclonic Storm Phailin was the second-strongest tropical cyclone to make landfall in India since records began. It had wind speeds of up to 220 km/h.",
      impact:
        "Despite its intensity, improved disaster preparedness and evacuation of nearly a million people limited casualties. However, it caused significant damage to crops and infrastructure.",
      casualties: 45,
      economicLoss: "₹4,200 crore",
      imageUrl: "/images/cyclone-phailin.jpg",
    },
    {
      id: "fani-2019",
      type: "cyclone",
      name: "Cyclone Fani",
      date: "May 3, 2019",
      location: "Puri, Odisha",
      description:
        "Extremely Severe Cyclonic Storm Fani was one of the strongest cyclones to hit Odisha since the 1999 Super Cyclone. It had wind speeds of up to 215 km/h.",
      impact:
        "The cyclone caused extensive damage to infrastructure, particularly in Puri, Bhubaneswar, and Cuttack. Massive evacuation efforts helped minimize casualties.",
      casualties: 64,
      economicLoss: "₹24,176 crore",
      imageUrl: "/images/cyclone-fani.jpg",
    },
    {
      id: "flood-2011",
      type: "flood",
      date: "September 2011",
      location: "Mahanadi River Basin",
      description:
        "Severe flooding occurred in the Mahanadi River basin affecting 19 districts of Odisha. Heavy rainfall and water released from the Hirakud Dam caused widespread inundation.",
      impact:
        "The floods affected over 3.3 million people and damaged over 200,000 hectares of cropland. It also damaged infrastructure including roads, bridges, and public buildings.",
      casualties: 39,
      economicLoss: "₹3,265 crore",
      imageUrl: "/images/flood-2011.jpg",
    },
    {
      id: "flood-2001",
      type: "flood",
      date: "July 2001",
      location: "Multiple River Basins",
      description:
        "Heavy monsoon rains caused severe flooding across multiple river basins in Odisha, affecting 24 out of 30 districts.",
      impact:
        "The floods affected over 7 million people and damaged over 300,000 houses. Agricultural losses were significant with over 400,000 hectares of cropland damaged.",
      casualties: 102,
      economicLoss: "₹1,840 crore",
      imageUrl: "/images/flood-2001.jpg",
    },
    {
      id: "earthquake-1995",
      type: "earthquake",
      date: "May 2, 1995",
      location: "Western Odisha",
      description:
        "A moderate earthquake of magnitude 5.2 struck western Odisha, with its epicenter near Khariar in Nuapada district.",
      impact:
        "The earthquake caused damage to buildings and infrastructure in several districts including Nuapada, Kalahandi, and Bolangir.",
      casualties: 7,
      economicLoss: "₹62 crore",
      imageUrl: "/images/earthquake-1995.jpg",
    },
  ]

  const filteredDisasters =
    activeTab === "all" ? historicalDisasters : historicalDisasters.filter((disaster) => disaster.type === activeTab)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-teal-700 md:text-3xl">
          Historical Disasters in Odisha
        </h2>
        <p className="mt-2 text-gray-500">A timeline of major disasters that have affected Odisha in the past</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Disasters</TabsTrigger>
          <TabsTrigger value="cyclone">Cyclones</TabsTrigger>
          <TabsTrigger value="flood">Floods</TabsTrigger>
          <TabsTrigger value="earthquake">Earthquakes</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDisasters.map((disaster) => (
              <Card key={disaster.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={disaster.imageUrl || "/placeholder.svg"}
                    alt={disaster.name || disaster.type}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {disaster.name ||
                        `${disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)} of ${new Date(disaster.date).getFullYear()}`}
                    </CardTitle>
                    <Badge>{disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}</Badge>
                  </div>
                  <CardDescription>
                    {disaster.date} • {disaster.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{disaster.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impact:</h4>
                    <p className="text-sm text-gray-500">{disaster.impact}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {disaster.casualties !== undefined && (
                      <div>
                        <span className="text-gray-500">Casualties:</span>
                        <p className="font-medium">{disaster.casualties.toLocaleString()}</p>
                      </div>
                    )}
                    {disaster.economicLoss && (
                      <div>
                        <span className="text-gray-500">Economic Loss:</span>
                        <p className="font-medium">{disaster.economicLoss}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
