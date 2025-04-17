import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SearchProvider } from "@/context/search-context"
import { AlertProvider } from "@/context/alert-context"
import EmergencyBulletin from "@/components/emergency-bulletin"

const inter = Inter({ subsets: ["latin"] })

// Metadata needs to be in a separate file for client components
const metadata: Metadata = {
  title: "Odisha Disaster Alert System",
  description: "Real-time disaster alerts and safety information for Odisha, India",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SearchProvider>
            <AlertProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <EmergencyBulletin />
              </div>
            </AlertProvider>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'