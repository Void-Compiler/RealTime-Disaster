import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-teal-600" />
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Odisha Disaster Alert System</p>
        </div>
        <nav className="flex gap-4 text-sm text-gray-500">
          <Link href="#" className="transition-colors hover:text-teal-600">
            About
          </Link>
          <Link href="#" className="transition-colors hover:text-teal-600">
            Contact
          </Link>
          <Link href="#" className="transition-colors hover:text-teal-600">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-teal-600">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
