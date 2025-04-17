import { NextResponse } from "next/server"

// In a real app, this would be stored in a database
let activeAlert: any = null

export async function GET() {
  try {
    // In a real app, you would query your database for active alerts
    return NextResponse.json({
      success: true,
      alert: activeAlert,
    })
  } catch (error) {
    console.error("Error fetching active alert:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch active alert",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Set or clear the active alert
    if (body.clear) {
      activeAlert = null
    } else {
      activeAlert = body.alert
    }

    return NextResponse.json({
      success: true,
      alert: activeAlert,
    })
  } catch (error) {
    console.error("Error updating active alert:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update active alert",
      },
      { status: 500 },
    )
  }
}
