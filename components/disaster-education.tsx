"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DisasterEducationContent {
  id: string
  type: string
  title: string
  description: string
  beforeDisaster: string[]
  duringDisaster: string[]
  afterDisaster: string[]
}

export default function DisasterEducation() {
  const [activeTab, setActiveTab] = useState("flood")

  const educationContent: DisasterEducationContent[] = [
    {
      id: "flood-education",
      type: "flood",
      title: "Flood Safety & Preparedness",
      description:
        "Floods are among the most common natural disasters in Odisha, particularly during the monsoon season. Understanding how to prepare for, survive during, and recover after a flood can save lives and reduce property damage.",
      beforeDisaster: [
        "Know your area's flood risk and evacuation routes",
        "Prepare an emergency kit with food, water, medications, and important documents",
        "Install check valves in plumbing to prevent floodwater backup",
        "Consider flood insurance for your property",
        "Keep important documents in a waterproof container",
        "Elevate electrical panel, water heater, and electric appliances",
        "Clean drains and gutters regularly",
        "Store valuables and important items on upper floors",
      ],
      duringDisaster: [
        "Listen to emergency officials and evacuate if ordered",
        "Move to higher ground immediately if flooding occurs",
        "Do not walk, swim, or drive through flood waters - just 6 inches of moving water can knock you down",
        "Stay off bridges over fast-moving water",
        "If trapped in a building, go to the highest level (but not into a closed attic)",
        "Only get on the roof if necessary and signal for help",
        "Disconnect utilities if instructed by authorities",
        "Keep children away from floodwater as it may be contaminated",
      ],
      afterDisaster: [
        "Return home only when authorities say it's safe",
        "Avoid walking or driving through flood waters",
        "Use caution when entering buildings and watch for hidden damage",
        "Clean and disinfect everything that got wet",
        "Throw away food that may have been in contact with floodwater",
        "Be aware of areas where floodwaters have receded as roads may be weakened",
        "Take pictures of damage for insurance claims",
        "Prevent mold by removing wet items immediately",
      ],
    },
    {
      id: "cyclone-education",
      type: "cyclone",
      title: "Cyclone Safety & Preparedness",
      description:
        "Cyclones are a recurring threat to coastal Odisha. Proper preparation and knowledge of safety procedures can significantly reduce the risk to life and property.",
      beforeDisaster: [
        "Stay informed about weather updates and warnings",
        "Prepare an emergency kit with essential supplies for at least 3 days",
        "Secure your home - trim trees, reinforce doors and windows",
        "Know your evacuation route and shelter locations",
        "Keep important documents in waterproof containers",
        "Fill clean containers with drinking water",
        "Charge mobile phones and keep power banks ready",
        "Secure or bring inside loose outdoor items",
      ],
      duringDisaster: [
        "Stay indoors and away from windows, skylights, and glass doors",
        "Close all interior doors and secure external doors",
        "Take refuge in a small interior room, closet, or hallway on the lowest level",
        "Lie on the floor under a table or another sturdy object if the building is damaged",
        "Do not go outside during the 'eye' of the cyclone - conditions will rapidly deteriorate again",
        "Turn off utilities if instructed to do so",
        "Avoid using candles for lighting due to fire risk",
        "Keep a battery-powered radio for emergency updates",
      ],
      afterDisaster: [
        "Stay inside until official word that the storm has passed",
        "Check for injuries and provide first aid if needed",
        "Avoid downed power lines and report them to authorities",
        "Be careful entering damaged buildings",
        "Drink only bottled or boiled water until water supplies are declared safe",
        "Use phones only for emergencies",
        "Document damage with photos for insurance claims",
        "Help neighbors, especially elderly or disabled persons",
      ],
    },
    {
      id: "earthquake-education",
      type: "earthquake",
      title: "Earthquake Safety & Preparedness",
      description:
        "While Odisha is not in a high seismic zone, earthquakes can still occur. Knowing how to respond quickly and appropriately during an earthquake can prevent injuries and save lives.",
      beforeDisaster: [
        "Identify safe places in each room - under sturdy furniture or against interior walls",
        "Secure heavy furniture, appliances, and hanging items",
        "Store breakable items in low, closed cabinets with latches",
        "Learn how to shut off utilities",
        "Have emergency supplies ready",
        "Create a family emergency communication plan",
        "Consider earthquake insurance",
        "Repair defective electrical wiring and leaky gas connections",
      ],
      duringDisaster: [
        "Drop, Cover, and Hold On - drop to the ground, take cover under sturdy furniture, and hold on",
        "If there's no table nearby, cover your face and head with your arms and crouch in an inside corner",
        "Stay away from glass, windows, outside doors and walls",
        "Stay inside until the shaking stops",
        "If outdoors, move to a clear area away from buildings, trees, and power lines",
        "If in a vehicle, pull over and stay inside until shaking stops",
        "If trapped under debris, do not light a match or move about",
        "Tap on a pipe or wall so rescuers can locate you",
      ],
      afterDisaster: [
        "Expect aftershocks - be ready to Drop, Cover, and Hold On",
        "Check yourself and others for injuries",
        "Look for and extinguish small fires",
        "Listen to a battery-operated radio for emergency information",
        "Inspect utilities - check for gas leaks, damaged electrical wiring",
        "Stay out of damaged buildings",
        "Be careful around broken glass and debris",
        "Help people who require special assistance",
      ],
    },
    {
      id: "heatwave-education",
      type: "heatwave",
      title: "Heatwave Safety & Preparedness",
      description:
        "Heatwaves can be deadly, especially for vulnerable populations like the elderly, children, and those with chronic illnesses. Understanding how to prepare for and cope during extreme heat can prevent heat-related illnesses and save lives.",
      beforeDisaster: [
        "Stay informed about weather forecasts and heat alerts",
        "Install window reflectors to reflect heat back outside",
        "Cover windows with drapes or shades",
        "Add insulation to keep heat out",
        "Learn to recognize the symptoms of heat-related illnesses",
        "Identify places with air conditioning where you can go",
        "Prepare a cooler with ice packs",
        "Check on family, friends, and neighbors who are vulnerable",
      ],
      duringDisaster: [
        "Stay in air-conditioned buildings as much as possible",
        "Drink plenty of fluids, even if you don't feel thirsty",
        "Wear lightweight, light-colored, loose-fitting clothing",
        "Take cool showers or baths",
        "Avoid strenuous activities during the hottest part of the day (11 AM - 4 PM)",
        "Use a buddy system when working in the heat",
        "Never leave children or pets in parked vehicles",
        "Check on those at high risk twice a day",
      ],
      afterDisaster: [
        "Continue to drink plenty of fluids",
        "Monitor those at high risk for signs of heat-related illness",
        "Seek medical attention if you or someone you know has symptoms of heat-related illness",
        "Rest and recover in cool environments",
        "Avoid alcohol and caffeine",
        "Eat light, cool meals",
        "Continue to check on vulnerable neighbors and family members",
        "Prepare for potential power outages due to high electricity demand",
      ],
    },
  ]

  const currentContent = educationContent.find((content) => content.type === activeTab) || educationContent[0]

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Disaster Education</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Learn how to prepare for, respond during, and recover after different types of disasters
        </p>
      </div>

      <Tabs defaultValue="flood" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="flood">Floods</TabsTrigger>
          <TabsTrigger value="cyclone">Cyclones</TabsTrigger>
          <TabsTrigger value="earthquake">Earthquakes</TabsTrigger>
          <TabsTrigger value="heatwave">Heatwaves</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.title}</CardTitle>
              <CardDescription>{currentContent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="before">
                <AccordionItem value="before">
                  <AccordionTrigger>
                    Before a {currentContent.type.charAt(0).toUpperCase() + currentContent.type.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {currentContent.beforeDisaster.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-primary"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="during">
                  <AccordionTrigger>
                    During a {currentContent.type.charAt(0).toUpperCase() + currentContent.type.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {currentContent.duringDisaster.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-primary"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="after">
                  <AccordionTrigger>
                    After a {currentContent.type.charAt(0).toUpperCase() + currentContent.type.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {currentContent.afterDisaster.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-primary"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
