import DisasterHistorySection from "@/components/disaster-history-section"
import DisasterEducationSection from "@/components/disaster-education-section"

export default function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">Disaster History & Learning</h1>
        <p className="text-gray-600 mb-8">Learn about past disasters in Odisha and how to prepare for future events</p>

        <div className="space-y-12">
          <DisasterHistorySection />
          <DisasterEducationSection />
        </div>
      </div>
    </main>
  )
}
