'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaGithub, FaProjectDiagram, FaFileAlt, FaUserCircle, FaImage } from 'react-icons/fa'
import ProjectsManager from '@/components/admin/ProjectsManager'
import CVUploader from '@/components/admin/CVUploader'
import GitHubStats from '@/components/admin/GitHubStats'
import MediaLibrary from '@/components/admin/MediaLibrary'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const router = useRouter()

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'media', label: 'Media Library', icon: FaImage },
    { id: 'cv', label: 'CV Upload', icon: FaFileAlt },
    { id: 'github', label: 'GitHub Stats', icon: FaGithub },
    { id: 'profile', label: 'Profile', icon: FaUserCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="text-xl" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'cv' && <CVUploader />}
          {activeTab === 'github' && <GitHubStats />}
          {activeTab === 'profile' && <ProfileEditor />}
        </div>
      </main>
    </div>
  )
}

const ProfileEditor = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Edit Profile</h2>
      {/* Profile editing form will go here */}
    </div>
  )
}

export default AdminDashboard 