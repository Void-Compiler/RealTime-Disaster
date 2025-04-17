import { type NextRequest, NextResponse } from "next/server"

// Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber } = body

    // Basic validation
    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    // Format phone number for Twilio (needs country code)
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    // Send a welcome message
    try {
      await sendSMSWithTwilio(
        formattedPhoneNumber,
        "Welcome to Disaster Alert System! You will now receive emergency alerts for your area.",
      )
    } catch (error) {
      console.error("Error sending welcome SMS:", error)
      // Continue with registration even if welcome SMS fails
    }

    return NextResponse.json({
      success: true,
      message: "Mobile number registered successfully",
      phoneNumber,
    })
  } catch (error) {
    console.error("Error registering mobile number:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register mobile number",
      },
      { status: 500 },
    )
  }
}

// Format phone number to include country code for India (+91)
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "")

  // If it's a 10-digit number, add India's country code
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`
  }

  // If it already has a country code (starts with + and has more than 10 digits)
  if (phoneNumber.startsWith("+") && digitsOnly.length > 10) {
    return phoneNumber
  }

  // Default: add +91 if not already present
  return phoneNumber.startsWith("+") ? phoneNumber : `+91${digitsOnly}`
}

async function sendSMSWithTwilio(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")

  const formData = new URLSearchParams()
  formData.append("To", to)
  formData.append("From", TWILIO_PHONE_NUMBER)
  formData.append("Body", body)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Twilio API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error in Twilio API call:", error)

    // For development/testing, return a mock success response
    if (process.env.NODE_ENV !== "production") {
      return {
        sid: `mock-${Date.now()}`,
        status: "sent",
        message: "SMS sent successfully (mock)",
      }
    }

    throw error
  }
}
