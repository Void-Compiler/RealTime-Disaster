import { type NextRequest, NextResponse } from "next/server"

// Mock disaster alerts API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || "all"
  const type = searchParams.get("type") || "all"

  // Mock database of disaster alerts
  const allAlerts = [
    {
      id: "flood-001",
      type: "flood",
      severity: "moderate",
      location: "Cuttack District",
      affectedAreas: ["Cuttack", "Choudwar", "Banki"],
      timestamp: "2023-08-15T08:30:00Z",
      description:
        "Moderate flooding reported in Cuttack district due to heavy rainfall and rising water levels in Mahanadi River.",
      safetyInstructions: [
        "Move to higher ground immediately if in low-lying areas",
        "Avoid walking or driving through flood waters",
        "Follow evacuation orders if issued by local authorities",
        "Keep emergency supplies ready",
      ],
      shelters: [
        { name: "Cuttack High School", location: "MG Road, Cuttack", capacity: 200 },
        { name: "Government College", location: "College Square, Cuttack", capacity: 350 },
      ],
    },
    {
      id: "cyclone-001",
      type: "cyclone",
      severity: "severe",
      location: "Coastal Odisha",
      affectedAreas: ["Puri", "Konark", "Astaranga", "Kakatpur"],
      timestamp: "2023-09-20T14:15:00Z",
      description:
        "Severe cyclonic storm approaching coastal Odisha with wind speeds of 120-130 km/h. Expected landfall near Puri within 24 hours.",
      safetyInstructions: [
        "Stay indoors and away from windows",
        "Secure loose objects that could be blown away",
        "Keep emergency supplies including food, water, and medications",
        "Follow evacuation orders immediately if issued",
        "Keep mobile phones charged and stay updated with official alerts",
      ],
      shelters: [
        { name: "Puri Town Hall", location: "Grand Road, Puri", capacity: 500 },
        { name: "Government School", location: "Beach Road, Puri", capacity: 300 },
      ],
    },
    {
      id: "earthquake-001",
      type: "earthquake",
      severity: "minor",
      location: "Western Odisha",
      affectedAreas: ["Sambalpur", "Bargarh", "Jharsuguda"],
      timestamp: "2023-10-05T03:45:00Z",
      description:
        "Minor earthquake of magnitude 3.5 recorded in Western Odisha. No major damage reported, but aftershocks possible.",
      safetyInstructions: [
        "Drop, cover, and hold on if you feel shaking",
        "Stay away from windows and exterior walls",
        "Be prepared for aftershocks",
        "Check for gas leaks or damage to utilities",
      ],
    },
    {
      id: "heatwave-001",
      type: "heatwave",
      severity: "extreme",
      location: "Interior Odisha",
      affectedAreas: ["Bolangir", "Titlagarh", "Sonepur", "Boudh"],
      timestamp: "2023-05-12T10:00:00Z",
      description:
        "Extreme heatwave conditions with temperatures exceeding 45°C expected to continue for the next 3-4 days.",
      safetyInstructions: [
        "Stay indoors during peak heat hours (11 AM - 4 PM)",
        "Drink plenty of water and stay hydrated",
        "Wear lightweight, light-colored clothing",
        "Check on elderly neighbors and those without air conditioning",
        "Never leave children or pets in parked vehicles",
      ],
    },
  ]

  // Filter alerts based on query parameters
  let filteredAlerts = allAlerts

  if (location !== "all") {
    filteredAlerts = filteredAlerts.filter(
      (alert) =>
        alert.location.toLowerCase().includes(location.toLowerCase()) ||
        alert.affectedAreas.some((area) => area.toLowerCase().includes(location.toLowerCase())),
    )
  }

  if (type !== "all") {
    filteredAlerts = filteredAlerts.filter((alert) => alert.type === type)
  }

  return NextResponse.json({ alerts: filteredAlerts })
}
