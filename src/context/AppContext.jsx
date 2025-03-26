"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Mock data
const mockUser = {
  id: "1",
  username: "testuser",
  email: "test@example.com",
  profilePhoto: "/placeholder.svg?height=40&width=40",
}

const mockFolders = [
  { id: "all", name: "All Notes", userId: "1" },
  { id: "personal", name: "Personal", userId: "1" },
  { id: "work", name: "Work", userId: "1" },
  { id: "projects", name: "Projects", userId: "1" },
]

const mockNotes = [
  {
    id: "1",
    title: "Welcome to SafeNotes",
    content: "This is a secure note-taking application. You can create, edit, and organize your notes here.",
    userId: "1",
    isPinned: true,
    isPrivate: false,
    createdAt: "2025-03-12T08:00:00Z",
    updatedAt: "2025-03-12T08:00:00Z",
    type: "text",
  },
  {
    id: "2",
    title: "Getting Started",
    content:
      "1. Create folders to organize your notes 2. Pin important notes 3. Password-protect sensitive information",
    userId: "1",
    isPinned: false,
    isPrivate: false,
    createdAt: "2025-03-12T08:00:00Z",
    updatedAt: "2025-03-12T08:00:00Z",
    type: "text",
  },
  {
    id: "3",
    title: "Shopping List",
    content: "",
    userId: "1",
    isPinned: false,
    isPrivate: false,
    createdAt: "2025-03-12T08:00:00Z",
    updatedAt: "2025-03-12T08:00:00Z",
    type: "checklist",
    checklistItems: [
      { id: "cl1", text: "Milk", checked: true },
      { id: "cl2", text: "Eggs", checked: false },
      { id: "cl3", text: "Bread", checked: false },
    ],
  },
]

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [folders, setFolders] = useState([])
  const [notes, setNotes] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }

    setFolders(mockFolders)
    setNotes(mockNotes)
    setCurrentFolder("all")
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  // Set sidebar open state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const addFolder = (name) => {
    if (!user) return
    const newFolder = {
      id: Date.now().toString(),
      name,
      userId: user.id,
    }
    setFolders([...folders, newFolder])
  }

  const renameFolder = (id, newName) => {
    setFolders(folders.map((folder) => (folder.id === id ? { ...folder, name: newName } : folder)))
  }

  const deleteFolder = (id) => {
    // Don't allow deleting the "All Notes" folder
    if (id === "all") return

    // Move notes from the deleted folder to "All Notes"
    setNotes(notes.map((note) => (note.folderId === id ? { ...note, folderId: "all" } : note)))

    // Remove the folder
    setFolders(folders.filter((folder) => folder.id !== id))

    // If the current folder is being deleted, switch to "All Notes"
    if (currentFolder === id) {
      setCurrentFolder("all")
    }
  }

  const addNote = (note) => {
    if (!user) return
    const newNote = {
      id: Date.now().toString(),
      title: note.title || "Untitled Note",
      content: note.content || "",
      folderId: note.folderId || currentFolder,
      userId: user.id,
      isPinned: note.isPinned || false,
      isPrivate: note.isPrivate || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collaborators: note.collaborators || [],
      type: note.type || "text",
      checklistItems: note.type === "checklist" ? note.checklistItems || [] : undefined,
      images: note.type === "image" ? note.images || [] : undefined,
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (id, updates) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note)),
    )
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const pinNote = (id) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const makeNotePrivate = (id, password) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isPrivate: true, password } : note)))
  }

  const duplicateNote = (id) => {
    const noteToDuplicate = notes.find((note) => note.id === id)
    if (!noteToDuplicate || !user) return

    const duplicatedNote = {
      ...noteToDuplicate,
      id: Date.now().toString(),
      title: `${noteToDuplicate.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    }
    setNotes([...notes, duplicatedNote])
  }

  const addCollaborator = (noteId, email, role) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const collaborators = note.collaborators || []
          return {
            ...note,
            collaborators: [...collaborators, { email, role }],
          }
        }
        return note
      }),
    )
  }

  const addChecklistItem = (noteId, text) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId && note.type === "checklist") {
          const checklistItems = note.checklistItems || []
          return {
            ...note,
            checklistItems: [...checklistItems, { id: Date.now().toString(), text, checked: false }],
            updatedAt: new Date().toISOString(),
          }
        }
        return note
      }),
    )
  }

  const toggleChecklistItem = (noteId, itemId) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId && note.type === "checklist" && note.checklistItems) {
          return {
            ...note,
            checklistItems: note.checklistItems.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item,
            ),
            updatedAt: new Date().toISOString(),
          }
        }
        return note
      }),
    )
  }

  const deleteChecklistItem = (noteId, itemId) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId && note.type === "checklist" && note.checklistItems) {
          return {
            ...note,
            checklistItems: note.checklistItems.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        }
        return note
      }),
    )
  }

  const addImageToNote = (noteId, imageUrl) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const images = note.images || []
          return {
            ...note,
            images: [...images, { id: Date.now().toString(), url: imageUrl }],
            updatedAt: new Date().toISOString(),
          }
        }
        return note
      }),
    )
  }

  return (
    <AppContext.Provider
      value={{
        user,
        folders,
        notes,
        currentFolder,
        searchQuery,
        sidebarOpen,
        setUser,
        setFolders,
        setNotes,
        setCurrentFolder,
        setSearchQuery,
        setSidebarOpen,
        addFolder,
        renameFolder,
        deleteFolder,
        addNote,
        updateNote,
        deleteNote,
        pinNote,
        makeNotePrivate,
        duplicateNote,
        addCollaborator,
        addChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        addImageToNote,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

