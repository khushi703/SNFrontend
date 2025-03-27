"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import NotesList from "../components/NotesList"
import { Menu } from "lucide-react"

export default function HomePage() {
  const { user, sidebarOpen, setSidebarOpen, currentFolder, setCurrentFolder } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  useEffect(() => {
    // Ensure a folder is selected when the component mounts
    if (user && !currentFolder) {
      setCurrentFolder("all")
    }
  }, [user, currentFolder, setCurrentFolder])

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar toggle button */}
        {!sidebarOpen && (
          <button
            className="fixed top-20 left-4 z-30 p-2 rounded-md bg-gray-100 dark:bg-gray-800 shadow-md md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}

        <Sidebar />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <NotesList key={currentFolder} />
        </div>
      </div>
    </div>
  )
}

