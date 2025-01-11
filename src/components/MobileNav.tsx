'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaHome, FaProjectDiagram, FaCode, FaEnvelope } from 'react-icons/fa'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollProgress, setScrollProgress] = useState(0)

  const menuItems = [
    { icon: <FaHome className="w-6 h-6" />, label: 'Home', href: '#hero' },
    { icon: <FaProjectDiagram className="w-6 h-6" />, label: 'Projects', href: '#projects' },
    { icon: <FaCode className="w-6 h-6" />, label: 'Skills', href: '#skills' },
    { icon: <FaEnvelope className="w-6 h-6" />, label: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const winScroll = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)

      // Determine active section
      const sections = menuItems.map(item => item.href.slice(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 lg:hidden">
      {/* Progress Circle */}
      <div className="absolute inset-0 -m-1">
        <svg className="w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r="22"
            cx="30"
            cy="30"
          />
          <circle
            className="text-indigo-500"
            strokeWidth="2"
            strokeDasharray={140}
            strokeDashoffset={140 - (140 * scrollProgress) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="22"
            cx="30"
            cy="30"
          />
        </svg>
      </div>

      {/* Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative z-10"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </motion.button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden min-w-[200px]"
          >
            <nav className="p-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.href.slice(1)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-auto"
                    />
                  )}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 