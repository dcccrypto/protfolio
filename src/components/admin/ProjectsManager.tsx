'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  features: string[]
  images: string[]
  technologies: string[]
  githubRepo: string
  liveDemo?: string
  inProgress?: boolean
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newImages, setNewImages] = useState<File[]>([])

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = async (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/admin/projects/${projectId}`, {
          method: 'DELETE'
        })
        setProjects(projects.filter(p => p.id !== projectId))
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Handle image uploads first
    if (newImages.length > 0) {
      const imageUploadPromises = newImages.map(async (image) => {
        const imageFormData = new FormData()
        imageFormData.append('image', image)
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: imageFormData
        })
        const { url } = await response.json()
        return url
      })

      const uploadedImageUrls = await Promise.all(imageUploadPromises)
      formData.append('images', JSON.stringify(uploadedImageUrls))
    }

    try {
      const response = await fetch('/api/admin/projects', {
        method: editingProject ? 'PUT' : 'POST',
        body: formData
      })

      if (response.ok) {
        const savedProject = await response.json()
        if (editingProject) {
          setProjects(projects.map(p => p.id === editingProject.id ? savedProject : p))
        } else {
          setProjects([...projects, savedProject])
        }
        setIsModalOpen(false)
        setEditingProject(null)
        setNewImages([])
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Projects</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddProject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlus />
          Add New Project
        </motion.button>
      </div>

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditProject(project)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                >
                  <FaEdit className="text-xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <FaTrash className="text-xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-6">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingProject?.title}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Short Description</label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingProject?.description}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Long Description</label>
                  <textarea
                    name="longDescription"
                    defaultValue={editingProject?.longDescription}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea
                    name="features"
                    defaultValue={editingProject?.features.join('\n')}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                  <input
                    type="text"
                    name="technologies"
                    defaultValue={editingProject?.technologies.join(', ')}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                  <input
                    type="text"
                    name="githubRepo"
                    defaultValue={editingProject?.githubRepo}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    name="liveDemo"
                    defaultValue={editingProject?.liveDemo}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Images</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="project-images"
                    />
                    <label
                      htmlFor="project-images"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FaImage className="text-4xl text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload images
                      </span>
                    </label>
                  </div>
                  {newImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {Array.from(newImages).map((file, index) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    {editingProject ? 'Save Changes' : 'Add Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 