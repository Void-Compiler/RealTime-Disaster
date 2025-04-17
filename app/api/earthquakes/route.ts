import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to fetch real data from USGS API
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson")

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter to only show earthquakes in or near India (roughly)
    const filteredData = {
      ...data,
      features: data.features.filter((quake: any) => {
        const coords = quake.geometry.coordinates
        const lat = coords[1]
        const lon = coords[0]

        // Rough bounding box for India and surrounding areas
        return lat >= 5 && lat <= 40 && lon >= 65 && lon <= 100
      }),
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error("Error fetching earthquake data:", error)

    // Fallback to mock data if API call fails
    const mockEarthquakeData = {
      type: "FeatureCollection",
      metadata: {
        generated: Date.now(),
        title: "Mock Earthquake Data for India",
      },
      features: [
        {
          type: "Feature",
          properties: {
            mag: 4.5,
            place: "75km NE of Bhubaneswar, India",
            time: Date.now() - 86400000, // 1 day ago
            title: "M 4.5 - 75km NE of Bhubaneswar, India",
            alert: null,
            status: "reviewed",
          },
          geometry: {
            type: "Point",
            coordinates: [86.5, 20.8, 10],
          },
          id: "mock1",
        },
        {
          type: "Feature",
          properties: {
            mag: 3.2,
            place: "120km W of Kolkata, India",
            time: Date.now() - 172800000, // 2 days ago
            title: "M 3.2 - 120km W of Kolkata, India",
            alert: null,
            status: "reviewed",
          },
          geometry: {
            type: "Point",
            coordinates: [87.1, 22.6, 5],
          },
          id: "mock2",
        },
        {
          type: "Feature",
          properties: {
            mag: 5.1,
            place: "Northern India",
            time: Date.now() - 345600000, // 4 days ago
            title: "M 5.1 - Northern India",
            alert: "yellow",
            status: "reviewed",
          },
          geometry: {
            type: "Point",
            coordinates: [77.2, 28.6, 15],
          },
          id: "mock3",
        },
      ],
    }

    return NextResponse.json(mockEarthquakeData)
  }
}
