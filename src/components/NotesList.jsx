"use client"
// At the top of your file, add this constant
const API_BASE_URL = 'http://localhost:8080'; // Spring Boot default port

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import {
  MoreVertical,
  Pin,
  Trash2,
  Copy,
  Clock,
  Lock,
  Users,
  Check,
  Plus,
  X,
  Upload,
  Download,
  FileText,
} from "lucide-react"
import { formatDate } from "../utils/formatDate"
import CreateNoteModal from "./CreateNoteModal"

export default function NotesList() {
  const {
    notes,
    currentFolder,
    pinNote,
    deleteNote,
    duplicateNote,
    makeNotePrivate,
    addCollaborator,
    updateNote,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    addImageToNote,
    searchQuery,
    addNote,
  } = useAppContext()

  const [noteMenuOpen, setNoteMenuOpen] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCollaborationModal, setShowCollaborationModal] = useState(false)
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [password, setPassword] = useState("")
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [collaboratorRole, setCollaboratorRole] = useState("read")
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editedNoteTitle, setEditedNoteTitle] = useState("")
  const [editedNoteContent, setEditedNoteContent] = useState("")
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const menuRef = useRef(null)
  const fileInputRef = useRef(null)
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('http://localhost:8080/api/notes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        // Update your context with the fetched notes
        // You'll need to modify your context to handle this
        // For example: setFetchedNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [currentFolder]);

  const handleCreateNote = async (noteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: noteData.title,
          content: noteData.content,
          type: noteData.checklistItems && noteData.checklistItems.length > 0 ? "checklist" : "text",
          checklistItems: noteData.checklistItems || [],
          folderId: currentFolder === "all" ? null : currentFolder
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const createdNote = await response.json();
      addNote(createdNote); // Add the new note to your context
      setShowCreateNoteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset any state that should be cleared when changing folders
    setNoteMenuOpen(null)
    setEditingNoteId(null)

    // Close any open modals when changing folders
    setShowPasswordModal(false)
    setShowCollaborationModal(false)
    setShowVersionHistoryModal(false)
  }, [currentFolder])

  useEffect(() => {
    // Reset any editing state when changing folders
    setEditingNoteId(null)
    setNoteMenuOpen(null)
  }, [currentFolder])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setNoteMenuOpen(null)
      }
    }

    if (noteMenuOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [noteMenuOpen])

  // Filter notes based on current folder
  const filteredNotes = React.useMemo(() => {
    return currentFolder === "all" ? notes : notes.filter((note) => note.folderId === currentFolder)
  }, [notes, currentFolder])

  // Sort notes: searched notes first, then pinned, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // If there's a search query, prioritize matching notes
    if (searchQuery) {
      const aMatchesTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase())
      const bMatchesTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase())
      const aMatchesContent = a.content.toLowerCase().includes(searchQuery.toLowerCase())
      const bMatchesContent = b.content.toLowerCase().includes(searchQuery.toLowerCase())

      // Exact title matches first
      if (a.title.toLowerCase() === searchQuery.toLowerCase() && b.title.toLowerCase() !== searchQuery.toLowerCase())
        return -1
      if (b.title.toLowerCase() === searchQuery.toLowerCase() && a.title.toLowerCase() !== searchQuery.toLowerCase())
        return 1

      // Then partial title matches
      if (aMatchesTitle && !bMatchesTitle) return -1
      if (!aMatchesTitle && bMatchesTitle) return 1

      // Then content matches
      if (aMatchesContent && !bMatchesContent) return -1
      if (!aMatchesContent && bMatchesContent) return 1
    }

    // Then pinned notes
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    // Finally sort by updated date
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const toggleNoteMenu = (noteId, event) => {
    event.preventDefault()
    event.stopPropagation()

    if (noteMenuOpen === noteId) {
      setNoteMenuOpen(null)
    } else {
      setNoteMenuOpen(noteId)
      setSelectedNote(noteId)
    }
  }

  const handleMakePrivate = () => {
    if (selectedNote && password) {
      makeNotePrivate(selectedNote, password)
      setPassword("")
      setShowPasswordModal(false)
      setNoteMenuOpen(null)
    }
  }

  const handleAddCollaborator = () => {
    if (selectedNote && collaboratorEmail) {
      addCollaborator(selectedNote, collaboratorEmail, collaboratorRole)
      setCollaboratorEmail("")
      setCollaboratorRole("read")
      setShowCollaborationModal(false)
      setNoteMenuOpen(null)
    }
  }

  const handleAddChecklistItem = (noteId) => {
    if (newChecklistItem.trim()) {
      addChecklistItem(noteId, newChecklistItem.trim())
      setNewChecklistItem("")
    }
  }

  const startEditingNote = (note) => {
    setEditingNoteId(note.id)
    setEditedNoteTitle(note.title)
    setEditedNoteContent(note.content)
  }

  const saveEditedNote = () => {
    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: editedNoteTitle,
        content: editedNoteContent,
      })
      setEditingNoteId(null)
    }
  }

  const handleImageUpload = (noteId) => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file && selectedNote) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(file)
      addImageToNote(selectedNote, imageUrl)
    }
  }

  const downloadNoteAsText = (note) => {
    let textContent = `${note.title}\n\n${note.content}`

    if (note.type === "checklist" && note.checklistItems) {
      textContent = `${note.title}\n\n`
      note.checklistItems.forEach((item) => {
        textContent += `${item.checked ? "✓" : "☐"} ${item.text}\n`
      })
    }

    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setNoteMenuOpen(null)
  }

  const downloadNoteAsJSON = (note) => {
    const jsonContent = JSON.stringify(note, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setNoteMenuOpen(null)
  }

  // const handleCreateNote = (noteData) => {
  //   const { title, content, checklistItems, image } = noteData

  //   const newNote = {
  //     title,
  //     content,
  //     type: checklistItems && checklistItems.length > 0 ? "checklist" : "text",
  //     checklistItems: checklistItems || [],
  //     images: image ? [{ id: Date.now().toString(), url: image }] : [],
  //   }

  //   addNote(newNote)
  //   setShowCreateNoteModal(false)
  // }

  return (
    // Added max-h-screen and overflow-y-auto to ensure scrolling works properly
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background dark:bg-gray-900 h-full max-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-background dark:bg-gray-900 z-10 py-2">
        <h1 className="text-xl md:text-2xl font-bold dark:text-white">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : currentFolder === "all"
              ? "All Notes"
              : sortedNotes.length > 0
                ? sortedNotes[0].title
                : "Notes"}
        </h1>

        <button
          onClick={() => setShowCreateNoteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Ensure consistent behavior across all rows by using a single grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className="note-card relative dark:bg-gray-800 dark:border-gray-700 dark:text-white h-full"
            >
              {note.isPinned && <Pin size={16} className="absolute top-2 right-2 text-primary dark:text-blue-400" />}

              {editingNoteId === note.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedNoteTitle}
                    onChange={(e) => setEditedNoteTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />
                  {note.type === "text" && (
                    <textarea
                      value={editedNoteContent}
                      onChange={(e) => setEditedNoteContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[100px] dark:bg-gray-700"
                    />
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditedNote}
                      className="px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => startEditingNote(note)} className="h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-2">{note.title}</h3>

                  <div className="flex-grow">
                    {note.type === "text" && (
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{note.content}</p>
                    )}

                    {note.type === "checklist" && note.checklistItems && (
                      <div className="mb-4 space-y-1">
                        {note.checklistItems.map((item) => (
                          <div key={item.id} className="flex items-center group">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleChecklistItem(note.id, item.id)
                              }}
                              className="mr-2 flex-shrink-0"
                            >
                              {item.checked ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <div className="w-4 h-4 border border-gray-400 dark:border-gray-500 rounded" />
                              )}
                            </button>
                            <span
                              className={`flex-1 ${
                                item.checked
                                  ? "line-through text-gray-400 dark:text-gray-500"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {item.text}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChecklistItem(note.id, item.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center mt-2">
                          <input
                            type="text"
                            placeholder="Add item..."
                            value={newChecklistItem}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setNewChecklistItem(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddChecklistItem(note.id)
                              }
                            }}
                            className="flex-1 p-1 text-sm border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 bg-transparent"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddChecklistItem(note.id)
                            }}
                            className="ml-2 text-blue-500"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {note.type === "image" && (
                      <div className="mb-4">
                        {note.images && note.images.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {note.images.map((image) => (
                              <img
                                key={image.id}
                                src={image.url || "/placeholder.svg"}
                                alt="Note image"
                                className="rounded-md object-cover w-full h-24"
                              />
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedNote(note.id)
                              handleImageUpload(note.id)
                            }}
                            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 flex flex-col items-center"
                          >
                            <Upload size={24} className="mb-2" />
                            <span>Upload Image</span>
                          </button>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {formatDate(note.updatedAt)}
                    </p>

                    {/* Moved the menu button here and adjusted position */}
                    <button
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={(e) => toggleNoteMenu(note.id, e)}
                    >
                      <MoreVertical size={16} className="dark:text-gray-300" />
                    </button>
                  </div>

                  {noteMenuOpen === note.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-2 top-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[200px] overflow-y-auto note-menu-scrollbar"
                      style={{ zIndex: 40 }}
                    >
                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => {
                          pinNote(note.id)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Pin size={14} className="mr-2" />
                        {note.isPinned ? "Unpin Note" : "Pin Note"}
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => {
                          duplicateNote(note.id)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Copy size={14} className="mr-2" />
                        Make a Copy
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => {
                          setShowVersionHistoryModal(true)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Clock size={14} className="mr-2" />
                        Version History
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => {
                          setShowPasswordModal(true)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Lock size={14} className="mr-2" />
                        Make Note Private
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => {
                          setShowCollaborationModal(true)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Users size={14} className="mr-2" />
                        Collaboration
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => downloadNoteAsText(note)}
                      >
                        <Download size={14} className="mr-2" />
                        Download as Text
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        onClick={() => downloadNoteAsJSON(note)}
                      >
                        <FileText size={14} className="mr-2" />
                        Download as JSON
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                        onClick={() => {
                          deleteNote(note.id)
                          setNoteMenuOpen(null)
                        }}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete Note
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No notes found</p>
            <p className="text-sm">
              {searchQuery ? "Try a different search term" : "Create a new note to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={showCreateNoteModal}
        onClose={() => setShowCreateNoteModal(false)}
        onCreateNote={handleCreateNote}
      />

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Set Password</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This note will be accessible only with the password you set.
            </p>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                onClick={handleMakePrivate}
              >
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Modal */}
      {showCollaborationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Add Collaborator</h3>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permission Level
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={collaboratorRole}
                onChange={(e) => setCollaboratorRole(e.target.value)}
              >
                <option value="read">Read</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowCollaborationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                onClick={handleAddCollaborator}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Version History</h3>
            {selectedNote && (
              <div className="space-y-4">
                <div className="border-b pb-2 dark:border-gray-700">
                  <p className="text-sm font-medium dark:text-white">Created</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(notes.find((n) => n.id === selectedNote)?.createdAt || "")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">Last Updated</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(notes.find((n) => n.id === selectedNote)?.updatedAt || "")}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowVersionHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

