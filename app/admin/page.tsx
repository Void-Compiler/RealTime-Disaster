import type { Metadata } from "next"
import AdminDashboard from "@/components/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Odisha Disaster Alert System",
  description: "Administrative dashboard for managing disaster alerts and data",
}

export default function AdminPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Manage disaster alerts, data, and system settings</p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  )
}
