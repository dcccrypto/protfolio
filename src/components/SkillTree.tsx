'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaReact, FaNodeJs, FaDatabase, FaCloud } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiThreedotjs } from 'react-icons/si'

interface Skill {
  id: string
  name: string
  icon: JSX.Element
  level: number
  maxLevel: number
  description: string
  requires: string[]
  category: 'frontend' | 'backend' | 'database' | 'cloud'
}

const skills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    icon: <FaReact className="w-8 h-8" />,
    level: 5,
    maxLevel: 5,
    description: 'Advanced React development including hooks, context, and performance optimization',
    requires: [],
    category: 'frontend'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: <SiTypescript className="w-8 h-8" />,
    level: 4,
    maxLevel: 5,
    description: 'Strong typing, interfaces, and advanced TypeScript patterns',
    requires: ['react'],
    category: 'frontend'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: <SiNextdotjs className="w-8 h-8" />,
    level: 4,
    maxLevel: 5,
    description: 'Server-side rendering, API routes, and full-stack development',
    requires: ['react', 'typescript'],
    category: 'frontend'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    icon: <SiThreedotjs className="w-8 h-8" />,
    level: 3,
    maxLevel: 5,
    description: '3D graphics and animations for web applications',
    requires: ['react'],
    category: 'frontend'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: <FaNodeJs className="w-8 h-8" />,
    level: 4,
    maxLevel: 5,
    description: 'Server-side JavaScript runtime and API development',
    requires: ['typescript'],
    category: 'backend'
  },
  {
    id: 'database',
    name: 'Databases',
    icon: <FaDatabase className="w-8 h-8" />,
    level: 4,
    maxLevel: 5,
    description: 'SQL and NoSQL database design and optimization',
    requires: ['nodejs'],
    category: 'database'
  },
  {
    id: 'cloud',
    name: 'Cloud Services',
    icon: <FaCloud className="w-8 h-8" />,
    level: 3,
    maxLevel: 5,
    description: 'AWS and cloud infrastructure management',
    requires: ['database'],
    category: 'cloud'
  }
]

export default function SkillTree() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const renderSkillLevel = (level: number, maxLevel: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(maxLevel)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < level
                ? 'bg-indigo-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-8">Skill Tree</h2>
      <div className="relative">
        {/* Skill connections */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {skills.map(skill =>
            skill.requires.map(reqId => {
              const requiredSkill = skills.find(s => s.id === reqId)
              if (!requiredSkill) return null
              return (
                <line
                  key={`${skill.id}-${reqId}`}
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2"
                />
              )
            })
          )}
        </svg>

        {/* Skill nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {skills.map(skill => (
            <motion.div
              key={skill.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer"
              onClick={() => setSelectedSkill(skill)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  {skill.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{skill.name}</h3>
                  {renderSkillLevel(skill.level, skill.maxLevel)}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill detail modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 