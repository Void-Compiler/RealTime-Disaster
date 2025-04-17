import { type NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = "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"
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Valid messages array is required" }, { status: 400 })
    }

    // Add system message to guide the AI's responses
    const systemMessage = {
      role: "system",
      content: `You are a helpful disaster management assistant for the Odisha Disaster Alert System. 
      Your primary goal is to provide accurate information about disasters, safety measures, and emergency procedures.
      Focus on being informative, clear, and reassuring. Provide practical advice that can help people stay safe during various types of disasters.
      When discussing disaster severity, use the following scale:
      - Low: Minimal risk to life and property
      - Moderate: Some risk to vulnerable populations and property
      - High: Significant risk to life and property
      - Severe: High risk to life and property, immediate action required
      - Extreme: Catastrophic risk, evacuation may be necessary
      
      Keep responses concise and focused on disaster management, weather events, and safety.`,
    }

    const allMessages = [systemMessage, ...messages]

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://disaster-alert-system.vercel.app", // Replace with your actual domain
        "X-Title": "Disaster Alert System",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta", // Using a faster model for chat
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: data.choices[0].message,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process chat message",
      },
      { status: 500 },
    )
  }
}
