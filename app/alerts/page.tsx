import type { Metadata } from "next"
import DisasterAlertDashboard from "@/components/disaster-alert-dashboard"

export const metadata: Metadata = {
  title: "Disaster Alerts | Odisha Disaster Alert System",
  description: "View current disaster alerts and warnings for Odisha, India",
}

export default function AlertsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Disaster Alerts</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Current disaster alerts and warnings for Odisha and surrounding areas
          </p>
        </div>
        <DisasterAlertDashboard />
      </div>
    </div>
  )
}
