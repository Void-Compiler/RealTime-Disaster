import { type NextRequest, NextResponse } from "next/server"

// Mock SMS API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, message } = body

    // Validate phone number (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 })
    }

    // In a real application, this would connect to an SMS service like Twilio, AWS SNS, etc.
    // For demo purposes, we'll just simulate a successful SMS send

    console.log(`[MOCK SMS] To: ${phoneNumber}, Message: ${message}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      messageId: `mock-${Date.now()}`,
      phoneNumber,
      message: "SMS sent successfully (mock)",
    })
  } catch (error) {
    console.error("Error sending SMS:", error)
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 })
  }
}
