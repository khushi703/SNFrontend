"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import NotesList from "../components/NotesList"
import { Menu } from "lucide-react"

export default function HomePage() {
  const { user, sidebarOpen, setSidebarOpen } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar toggle button */}
        {!sidebarOpen && (
          <button
            className="absolute top-2 left-2 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}

        <Sidebar />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content area with padding to accommodate the toggle button on mobile */}
        <div className={`flex-1 ${!sidebarOpen ? "pl-12 md:pl-0" : ""} overflow-hidden`}>
          <NotesList />
        </div>
      </div>
    </div>
  )
}

