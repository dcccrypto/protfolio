'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaFileAlt, FaUpload, FaTrash } from 'react-icons/fa'

export default function CVUploader() {
  const [currentCV, setCurrentCV] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type)) {
      setError('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('cv', file)

      const response = await fetch('/api/admin/cv', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload CV')
      }

      const { url } = await response.json()
      setCurrentCV(url)
    } catch (err) {
      setError('Failed to upload CV. Please try again.')
      console.error('CV upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentCV || !confirm('Are you sure you want to delete the current CV?')) return

    try {
      const response = await fetch('/api/admin/cv', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete CV')
      }

      setCurrentCV(null)
    } catch (err) {
      setError('Failed to delete CV. Please try again.')
      console.error('CV deletion error:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">CV Management</h2>

        {/* Current CV Display */}
        {currentCV && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-2xl text-indigo-500" />
                <div>
                  <p className="font-medium">Current CV</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.a
                  href={currentCV}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                >
                  <FaUpload className="text-xl" />
                </motion.a>
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <FaTrash className="text-xl" />
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full"
            >
              <FaFileAlt className="text-2xl" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? 'Uploading...' : 'Drop your CV here or click to upload'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Upload History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Upload History</h3>
        <div className="space-y-4">
          {/* We can add upload history here if needed */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No previous uploads found.
          </p>
        </div>
      </div>
    </div>
  )
} 