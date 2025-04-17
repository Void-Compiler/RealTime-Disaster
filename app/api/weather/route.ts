import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "5e57e4b68a6447dfbd5224926251604" // WeatherAPI key
const BASE_URL = "https://api.weatherapi.com/v1"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const q = searchParams.get("q")

  // Determine query parameter
  let queryParam = ""
  if (lat && lon) {
    queryParam = `${lat},${lon}`
  } else if (q) {
    queryParam = q
  } else {
    // Default to Delhi if no parameters provided
    queryParam = "Delhi"
  }

  try {
    // Fetch data from WeatherAPI
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(queryParam)}&aqi=no`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Fallback to mock data if API call fails
    const mockWeatherData = {
      location: {
        name: "Delhi",
        region: "Delhi",
        country: "India",
        lat: 28.67,
        lon: 77.22,
        tz_id: "Asia/Kolkata",
        localtime_epoch: Date.now() / 1000,
        localtime: new Date().toLocaleString(),
      },
      current: {
        last_updated_epoch: Date.now() / 1000,
        last_updated: new Date().toLocaleString(),
        temp_c: 32.0,
        temp_f: 89.6,
        is_day: 1,
        condition: {
          text: "Partly cloudy",
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          code: 1003,
        },
        wind_mph: 12.5,
        wind_kph: 20.2,
        wind_degree: 280,
        wind_dir: "W",
        pressure_mb: 1008.0,
        pressure_in: 29.77,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 65,
        cloud: 25,
        feelslike_c: 34.5,
        feelslike_f: 94.1,
        vis_km: 10.0,
        vis_miles: 6.2,
        uv: 6.0,
        gust_mph: 14.3,
        gust_kph: 23.0,
      },
    }

    return NextResponse.json(mockWeatherData)
  }
}
