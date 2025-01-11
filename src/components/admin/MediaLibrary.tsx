'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaImage, FaTrash, FaCopy, FaSearch, FaUpload } from 'react-icons/fa'
import Image from 'next/image'

interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
}

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data)
      }
    } catch (error) {
      console.error('Error fetching media items:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })
        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      fetchMediaItems() // Refresh the list after upload
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (ids: string[]) => {
    if (!confirm('Are you sure you want to delete the selected items?')) return

    try {
      const deletePromises = ids.map(id =>
        fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      )
      await Promise.all(deletePromises)
      fetchMediaItems() // Refresh the list after deletion
      setSelectedItems(new Set())
    } catch (error) {
      console.error('Error deleting items:', error)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err))
  }

  const filteredItems = mediaItems
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedItems(newSelection)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            {view === 'grid' ? 'List View' : 'Grid View'}
          </button>
          {selectedItems.size > 0 && (
            <button
              onClick={() => handleDelete(Array.from(selectedItems))}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FaTrash />
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Search and Upload */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>

          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              <FaUpload />
              Upload
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${
              view === 'grid' ? 'aspect-square' : 'flex items-center gap-4 p-4'
            }`}
          >
            <div className={view === 'grid' ? 'absolute inset-0' : 'relative w-20 h-20'}>
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className={view === 'grid' ? 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity' : 'flex-1'}>
              <div className={`flex items-center justify-between ${view === 'grid' ? 'h-full p-4' : ''}`}>
                <div className="text-white">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm opacity-75">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="p-2 text-white hover:text-indigo-400 transition"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className={`p-2 transition ${
                      selectedItems.has(item.id)
                        ? 'text-indigo-400'
                        : 'text-white hover:text-indigo-400'
                    }`}
                  >
                    <FaImage />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
              <span>Uploading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 