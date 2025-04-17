import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || ""
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  try {
    // In a real application, you would query a database or external API
    // For this demo, we'll use mock data based on the location
    const shelters = getNearestShelters(location, lat, lon)

    return NextResponse.json({
      success: true,
      shelters,
    })
  } catch (error) {
    console.error("Error fetching shelters:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch shelters",
      },
      { status: 500 },
    )
  }
}

function getNearestShelters(location: string, lat: string | null, lon: string | null) {
  // Mock database of shelters across India
  const allShelters = {
    mumbai: [
      { name: "Mumbai City Hall", distance: "2.5 km", capacity: "500 people" },
      { name: "Andheri Sports Complex", distance: "4.8 km", capacity: "750 people" },
      { name: "Juhu Municipal School", distance: "6.2 km", capacity: "300 people" },
    ],
    delhi: [
      { name: "Delhi Community Center", distance: "1.8 km", capacity: "600 people" },
      { name: "Connaught Place Shelter", distance: "3.5 km", capacity: "450 people" },
      { name: "Nehru Stadium", distance: "7.0 km", capacity: "1200 people" },
    ],
    kolkata: [
      { name: "Salt Lake Stadium", distance: "4.2 km", capacity: "800 people" },
      { name: "Kolkata Municipal School", distance: "2.9 km", capacity: "350 people" },
      { name: "Eden Gardens Complex", distance: "5.5 km", capacity: "650 people" },
    ],
    chennai: [
      { name: "Marina Beach Shelter", distance: "3.1 km", capacity: "400 people" },
      { name: "Chennai Central Stadium", distance: "5.3 km", capacity: "700 people" },
      { name: "T Nagar Community Hall", distance: "2.7 km", capacity: "250 people" },
    ],
    bangalore: [
      { name: "Cubbon Park Shelter", distance: "2.3 km", capacity: "350 people" },
      { name: "Bangalore City Hall", distance: "4.1 km", capacity: "500 people" },
      { name: "Electronic City Campus", distance: "8.5 km", capacity: "600 people" },
    ],
    hyderabad: [
      { name: "Hussain Sagar Shelter", distance: "3.7 km", capacity: "450 people" },
      { name: "HITEC City Complex", distance: "6.2 km", capacity: "550 people" },
      { name: "Charminar Community Center", distance: "2.9 km", capacity: "300 people" },
    ],
    bhubaneswar: [
      { name: "Bhubaneswar Community Center", distance: "3.2 km", capacity: "250 people" },
      { name: "Kalinga Stadium", distance: "5.7 km", capacity: "1000 people" },
      { name: "KIIT University Campus", distance: "8.1 km", capacity: "500 people" },
    ],
    cuttack: [
      { name: "Cuttack High School", distance: "2.1 km", capacity: "200 people" },
      { name: "Government College", distance: "3.5 km", capacity: "350 people" },
      { name: "Barabati Stadium", distance: "4.8 km", capacity: "800 people" },
    ],
    puri: [
      { name: "Puri Town Hall", distance: "1.5 km", capacity: "500 people" },
      { name: "Government School", distance: "2.8 km", capacity: "300 people" },
      { name: "Jagannath Temple Complex", distance: "3.2 km", capacity: "450 people" },
    ],
  }

  // Normalize location name for lookup
  const normalizedLocation = location.toLowerCase().trim()

  // If we have shelters for this specific location, return them
  if (normalizedLocation && normalizedLocation in allShelters) {
    return allShelters[normalizedLocation as keyof typeof allShelters]
  }

  // If we have coordinates but no specific location match, return the closest city's shelters
  // In a real app, you would calculate the nearest shelters based on coordinates
  if (lat && lon) {
    // For demo purposes, just return a default set
    return [
      { name: "Nearest Community Center", distance: "4.3 km", capacity: "400 people" },
      { name: "Regional Emergency Shelter", distance: "6.8 km", capacity: "650 people" },
      { name: "District School Complex", distance: "9.2 km", capacity: "550 people" },
    ]
  }

  // Default fallback
  return [
    { name: "Central Community Shelter", distance: "5.0 km", capacity: "500 people" },
    { name: "Regional Emergency Center", distance: "7.5 km", capacity: "600 people" },
    { name: "National Disaster Relief Camp", distance: "10.0 km", capacity: "800 people" },
  ]
}
