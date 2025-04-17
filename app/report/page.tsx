import IncidentReportForm from "@/components/incident-report-form"

export default function ReportPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">Report an Incident</h1>
        <p className="text-gray-600 mb-8">
          Help us track and respond to emergencies by reporting incidents in your area
        </p>

        <div className="max-w-2xl mx-auto">
          <IncidentReportForm />
        </div>
      </div>
    </main>
  )
}
