"use client"

import { useState, useRef, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import {
  FolderIcon,
  PlusIcon,
  MoreVertical,
  Edit2,
  Trash2,
  CheckSquare,
  Image,
  FileText,
  ChevronLeft,
} from "lucide-react"

export default function Sidebar() {
  const {
    folders,
    currentFolder,
    setCurrentFolder,
    addFolder,
    renameFolder,
    deleteFolder,
    addNote,
    sidebarOpen,
    setSidebarOpen,
  } = useAppContext()
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [showNoteLayoutModal, setShowNoteLayoutModal] = useState(false)
  const [folderMenuOpen, setFolderMenuOpen] = useState(null)
  const folderMenuRef = useRef(null)

  const noteLayoutOptions = [
    { id: "text", name: "Text Note", icon: "FileText" },
    { id: "checklist", name: "Checklist", icon: "CheckSquare" },
    { id: "image", name: "Image Note", icon: "Image" },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (folderMenuRef.current && !folderMenuRef.current.contains(event.target)) {
        setFolderMenuOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if we're on mobile and the sidebar is open
      if (window.innerWidth < 768 && sidebarOpen) {
        // Check if the click is outside the sidebar
        const sidebar = document.getElementById("sidebar")
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen, setSidebarOpen])

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim())
      setNewFolderName("")
      setShowFolderModal(false)
    }
  }

  const handleRenameFolder = () => {
    if (selectedFolder && newFolderName.trim()) {
      renameFolder(selectedFolder.id, newFolderName.trim())
      setNewFolderName("")
      setSelectedFolder(null)
      setShowRenameFolderModal(false)
    }
  }

  const handleDeleteFolder = (folderId) => {
    deleteFolder(folderId)
    setFolderMenuOpen(null)
  }

  const handleCreateNote = (layoutType) => {
    addNote({
      title: "Untitled Note",
      content: "",
      folderId: currentFolder,
      type: layoutType,
    })
    setShowNoteLayoutModal(false)
    // Close sidebar on mobile after creating a note
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const toggleFolderMenu = (folderId, event) => {
    event.stopPropagation()
    if (folderMenuOpen === folderId) {
      setFolderMenuOpen(null)
    } else {
      setFolderMenuOpen(folderId)
    }
  }

  const openRenameModal = (folder, event) => {
    event.stopPropagation()
    setSelectedFolder(folder)
    setNewFolderName(folder.name)
    setShowRenameFolderModal(true)
    setFolderMenuOpen(null)
  }

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId)
    // Close sidebar on mobile after selecting a folder
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div
      id="sidebar"
      className={`fixed md:relative z-20 h-full w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarOpen ? "left-0" : "-left-64 md:left-0"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold dark:text-white">Folders</h2>
        <div className="flex items-center">
          <button
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
            onClick={() => setShowFolderModal(true)}
            aria-label="Add folder"
          >
            <PlusIcon size={18} />
          </button>
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-120px)] overflow-auto p-2">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`relative flex items-center p-2 rounded-md mb-1 cursor-pointer ${
              currentFolder === folder.id
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => handleFolderClick(folder.id)}
          >
            <FolderIcon size={18} className={`mr-2 ${folder.id === "all" ? "text-blue-500 dark:text-blue-400" : ""}`} />
            <span className="flex-1 truncate">{folder.name}</span>

            {folder.id !== "all" && (
              <button
                className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={(e) => toggleFolderMenu(folder.id, e)}
                aria-label="Folder options"
              >
                <MoreVertical size={16} />
              </button>
            )}

            {folderMenuOpen === folder.id && (
              <div
                ref={folderMenuRef}
                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
              >
                <button
                  className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                  onClick={(e) => openRenameModal(folder, e)}
                >
                  <Edit2 size={14} className="mr-2" />
                  Rename
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full bg-primary text-white rounded-md py-2 flex items-center justify-center hover:bg-blue-600"
          onClick={() => setShowNoteLayoutModal(true)}
        >
          <PlusIcon size={16} className="mr-1" />
          New Note
        </button>
      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowFolderModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                onClick={handleCreateFolder}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Folder Modal */}
      {showRenameFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Rename Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowRenameFolderModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                onClick={handleRenameFolder}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Layout Modal */}
      {showNoteLayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Choose Note Layout</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {noteLayoutOptions.map((option) => (
                <button
                  key={option.id}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => handleCreateNote(option.id)}
                >
                  {option.icon === "FileText" && <FileText size={24} className="mb-2" />}
                  {option.icon === "CheckSquare" && <CheckSquare size={24} className="mb-2" />}
                  {option.icon === "Image" && <Image size={24} className="mb-2" />}
                  <span className="text-sm">{option.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowNoteLayoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

