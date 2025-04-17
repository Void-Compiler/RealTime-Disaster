"use client"
import WeatherSection from "@/components/weather-section"
import MapSection from "@/components/map-section"
import SafetyTipsSection from "@/components/safety-tips-section"
import RecentAlerts from "@/components/recent-alerts"
import MobileRegistration from "@/components/mobile-registration"
import AiChat from "@/components/ai-chat"
import UnifiedSearch from "@/components/unified-search"
import { useSearch } from "@/context/search-context"

export default function Home() {
  const { weatherData } = useSearch()

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('/images/cyclone-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Odisha Disaster Alert System</h1>
        <p className="text-gray-200 mb-8">Real-time weather updates and disaster alerts for Odisha, India</p>

        <div className="mb-6">
          <UnifiedSearch />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather and Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <WeatherSection />
            <MapSection />
          </div>

          {/* Sidebar with Safety Tips, Recent Alerts, and Mobile Registration */}
          <div className="space-y-6">
            <MobileRegistration />
            <SafetyTipsSection weatherData={weatherData} />
            <RecentAlerts />
          </div>
        </div>
      </div>

      {/* AI Chat Component */}
      <AiChat />
    </div>
  )
}
