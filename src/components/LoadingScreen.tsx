'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

function LoadingLogo() {
  return (
    <div className="w-24 h-24 relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-2 bg-white dark:bg-gray-900 rounded-lg"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
      animate={{
        opacity: progress === 100 ? 0 : 1,
        pointerEvents: progress === 100 ? 'none' : 'auto',
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <LoadingLogo />
        <motion.div
          className="w-48 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
        <motion.p
          className="mt-4 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading Experience...
        </motion.p>
      </div>
    </motion.div>
  )
} 