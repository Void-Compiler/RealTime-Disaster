import { type NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = "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"
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { weatherData, location } = body

    if (!weatherData) {
      return NextResponse.json({ success: false, error: "Weather data is required" }, { status: 400 })
    }

    // Extract relevant weather information
    const weatherInfo = {
      condition: weatherData.current.condition.text,
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.wind_kph,
      precipitation: weatherData.current.precip_mm,
      location: location || weatherData.location.name,
    }

    // Get AI analysis of disaster risk
    const analysis = await getDisasterRiskAnalysis(weatherInfo)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Error getting disaster risk analysis:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze disaster risk",
      },
      { status: 500 },
    )
  }
}

async function getDisasterRiskAnalysis(weatherInfo: any) {
  const prompt = `
    As a disaster management expert, analyze the following weather conditions and provide a disaster risk assessment:
    
    Location: ${weatherInfo.location}
    Weather Condition: ${weatherInfo.condition}
    Temperature: ${weatherInfo.temperature}°C
    Humidity: ${weatherInfo.humidity}%
    Wind Speed: ${weatherInfo.windSpeed} km/h
    Precipitation: ${weatherInfo.precipitation} mm
    
    Please provide:
    1. A risk level (Low, Moderate, High, Severe, or Extreme)
    2. A brief explanation of potential hazards
    3. Key safety recommendations
    
    Format your response as a JSON object with the following structure:
    {
      "riskLevel": "Low/Moderate/High/Severe/Extreme",
      "riskScore": 1-10,
      "explanation": "Brief explanation of the risk assessment",
      "potentialHazards": ["hazard1", "hazard2"],
      "safetyRecommendations": ["recommendation1", "recommendation2", "recommendation3"]
    }
  `

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://disaster-alert-system.vercel.app", // Replace with your actual domain
        "X-Title": "Disaster Alert System",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus:beta",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    // Parse the JSON response
    try {
      const analysis = JSON.parse(analysisText)
      return analysis
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      // If parsing fails, return a default analysis
      return {
        riskLevel: "Unknown",
        riskScore: 0,
        explanation: "Unable to analyze risk based on current data.",
        potentialHazards: ["Unknown"],
        safetyRecommendations: ["Stay informed through official channels"],
      }
    }
  } catch (error) {
    console.error("Error calling OpenRouter API:", error)

    // Return a fallback analysis for development
    return {
      riskLevel: "Moderate",
      riskScore: 4,
      explanation: "Fallback analysis due to API error. This is a generic assessment.",
      potentialHazards: ["Unknown weather conditions", "Potential service disruptions"],
      safetyRecommendations: [
        "Stay informed through local news",
        "Keep emergency supplies ready",
        "Follow official guidance",
      ],
    }
  }
}
