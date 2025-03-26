"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { ThemeToggle } from "./theme-toggle"
import { Search, Menu, X } from "lucide-react"

export default function Navbar() {
  const { user, setUser, notes, setSearchQuery, searchQuery } = useAppContext()
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(filteredNotes)
  }, [searchQuery, notes])

  const handleSignOut = () => {
    setUser(null)
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // The search is already being handled by the searchQuery state
    // Close any mobile menu if open
    setShowMobileMenu(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and mobile menu button */}
        <div className="flex items-center">
          <button
            className="mr-2 p-1 rounded-md md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center">
            <img
              src="/Logo.png?height=24&width=24"
              alt="SafeNotes Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-xl font-bold dark:text-white hidden sm:inline">SafeNotes</span>
          </Link>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md mx-4 hidden md:block">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((note) => (
                <button
                  key={note.id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => {
                    setSearchQuery(note.title)
                    setSearchResults([])
                  }}
                >
                  <div className="font-medium">{note.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {note.content.substring(0, 60)}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* User menu and theme toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
            >
              <img
                src={user?.profilePhoto || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </button>

            {showDropdown && (
              <div
                className="fixed right-4 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                style={{ zIndex: 1000 }}
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium dark:text-white">{user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileMenu && (
        <div className="md:hidden mt-3 pb-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {searchResults.length > 0 && (
            <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((note) => (
                <button
                  key={note.id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => {
                    setSearchQuery(note.title)
                    setSearchResults([])
                    setShowMobileMenu(false)
                  }}
                >
                  <div className="font-medium">{note.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {note.content.substring(0, 60)}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

