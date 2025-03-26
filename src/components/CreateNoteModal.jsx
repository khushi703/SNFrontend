"use client"

import { useState, useRef } from "react"
import { ImageIcon, Trash2, X } from "lucide-react"

export default function CreateNoteModal({ isOpen, onClose, onCreateNote }) {
  const [title, setTitle] = useState("Untitled Note")
  const [content, setContent] = useState("")
  const [checklistItems, setChecklistItems] = useState([])
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateNote({
      title: title || "Untitled Note",
      content,
      checklistItems,
      image: selectedImage,
      type: checklistItems.length > 0 ? "checklist" : "text",
      isPinned: false,
      isPrivate: false,
    })
    handleClose()
  }

  const handleClose = () => {
    setTitle("Untitled Note")
    setContent("")
    setChecklistItems([])
    setNewChecklistItem("")
    setSelectedImage(null)
    onClose()
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([...checklistItems, { id: Date.now().toString(), text: newChecklistItem, checked: false }])
      setNewChecklistItem("")
    }
  }

  const handleToggleChecklistItem = (id) => {
    setChecklistItems(checklistItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const handleRemoveChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Create New Note</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Untitled Note"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Start typing..."
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add checklist item"
                className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddChecklistItem()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleChecklistItem(item.id)}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span className={`flex-1 ${item.checked ? "line-through text-gray-500" : ""}`}>{item.text}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(item.id)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <ImageIcon className="h-5 w-5" />
                <span>Attach Image</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            </div>

            {selectedImage && (
              <div className="mt-4 relative inline-block">
                <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="max-w-xs rounded-md" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

