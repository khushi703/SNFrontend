import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <header className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <img src="\Logo.png" alt="SafeNotes Logo" width={24} height={24} className="mr-2" />
          <h1 className="text-xl font-bold">SafeNotes</h1>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link to="/contact" className="hover:text-primary">
            Contact Us
          </Link>
          <Link to="/help" className="hover:text-primary">
            Help
          </Link>
          <Link to="/forum" className="hover:text-primary">
            Support Forum
          </Link>
          <span className="hidden sm:inline text-gray-500">|</span>
          <Link to="/login" className="hover:text-primary">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-transparent border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8">
          <span className="text-primary">S</span>afe <span className="text-primary">S</span>mart{" "}
          <span className="text-primary">S</span>ecure
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-12">
          All your notes, securely stored and encrypted to ensure your privacy, accessible anytime and anywhere with
          seamless synchronization.
        </p>
        <Link
          to="/signup"
          className="bg-primary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Sign up now
        </Link>

        <div className="mt-10 sm:mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <img
              src="/Responsiv2.png?height=600&width=8000"
              alt="SafeNotes App Screenshot"
              width={1000}
              height={600}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

