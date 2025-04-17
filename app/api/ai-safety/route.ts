import { type NextRequest, NextResponse } from "next/server"

// Simple rule-based AI module for generating safety instructions
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const disasterType = searchParams.get("type") || "flood"
  const severity = searchParams.get("severity") || "moderate"

  // Get safety tips based on disaster type and severity
  const safetyTips = generateSafetyTips(disasterType, severity)

  return NextResponse.json({ safetyTips })
}

function generateSafetyTips(disasterType: string, severity: string): string[] {
  // Base tips for each disaster type
  const baseTips: Record<string, string[]> = {
    flood: [
      "Move to higher ground immediately if in low-lying areas",
      "Avoid walking or driving through flood waters",
      "Follow evacuation orders if issued by local authorities",
      "Keep emergency supplies ready",
    ],
    cyclone: [
      "Stay indoors and away from windows",
      "Secure loose objects that could be blown away",
      "Keep emergency supplies including food, water, and medications",
      "Follow evacuation orders immediately if issued",
    ],
    earthquake: [
      "Drop, cover, and hold on if you feel shaking",
      "Stay away from windows and exterior walls",
      "Be prepared for aftershocks",
      "Check for gas leaks or damage to utilities after the shaking stops",
    ],
    heatwave: [
      "Stay in air-conditioned buildings as much as possible",
      "Drink plenty of fluids, even if you don't feel thirsty",
      "Wear lightweight, light-colored, loose-fitting clothing",
      "Check on those at high risk twice a day",
    ],
  }

  // Additional tips based on severity
  const severityTips: Record<string, Record<string, string[]>> = {
    flood: {
      minor: ["Monitor local news for updates", "Move valuable items to higher levels in your home"],
      moderate: [
        "Prepare for possible evacuation",
        "Charge mobile devices and keep power banks ready",
        "Fill clean containers with drinking water",
      ],
      severe: [
        "Evacuate immediately if ordered",
        "If trapped, move to the highest level of the building",
        "Signal for help if needed",
        "Do not attempt to swim through fast-moving water",
      ],
    },
    cyclone: {
      minor: ["Secure outdoor furniture and objects", "Charge electronic devices"],
      moderate: [
        "Prepare a safe room in your home",
        "Have multiple ways to receive weather alerts",
        "Fill bathtubs and containers with water",
      ],
      severe: [
        "Evacuate immediately if in a coastal area",
        "If unable to evacuate, stay in a small, interior room",
        "Keep mattresses nearby to protect from flying debris",
        "Expect power outages that could last for days",
      ],
    },
    earthquake: {
      minor: ["Check for small cracks in walls", "Secure items that may have shifted"],
      moderate: [
        "Check for structural damage before re-entering buildings",
        "Be prepared for aftershocks",
        "Check on neighbors, especially the elderly",
      ],
      severe: [
        "Evacuate damaged buildings immediately",
        "Be aware of potential landslides",
        "Avoid bridges or roads that might be damaged",
        "Prepare for extended disruption to utilities and services",
      ],
    },
    heatwave: {
      minor: ["Use fans to circulate air", "Take cool showers or baths"],
      moderate: [
        "Avoid strenuous activities during peak heat hours",
        "Use a buddy system when working in the heat",
        "Know the signs of heat exhaustion and heat stroke",
      ],
      severe: [
        "Seek air-conditioned environments immediately",
        "Never leave children or pets in parked vehicles",
        "Check on elderly neighbors twice daily",
        "If you don't have AC, go to a public cooling center",
      ],
    },
  }

  // Get base tips for the disaster type
  const tips = [...(baseTips[disasterType] || baseTips.flood)]

  // Add severity-specific tips
  const additionalTips = severityTips[disasterType]?.[severity] || []
  tips.push(...additionalTips)

  return tips
}
