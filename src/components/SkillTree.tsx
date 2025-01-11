'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    description: 'Backend development with Express and API design',
    requires: [],
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
    description: 'AWS and Vercel deployment, serverless functions',
    requires: ['nodejs', 'database'],
    category: 'cloud'
  }
]

export default function SkillTree() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  const getSkillPosition = (skill: Skill) => {
    const positions: Record<string, { x: number, y: number }> = {
      react: { x: 0, y: 0 },
      typescript: { x: 1, y: -1 },
      nextjs: { x: 2, y: -1 },
      threejs: { x: 1, y: 1 },
      nodejs: { x: 3, y: 0 },
      database: { x: 4, y: -1 },
      cloud: { x: 5, y: 0 }
    }
    return positions[skill.id]
  }

  const drawConnections = () => {
    return skills.map(skill => 
      skill.requires.map(reqId => {
        const reqSkill = skills.find(s => s.id === reqId)
        if (!reqSkill) return null
        
        const start = getSkillPosition(reqSkill)
        const end = getSkillPosition(skill)
        
        return (
          <line
            key={`${reqId}-${skill.id}`}
            x1={start.x * 150 + 75}
            y1={start.y * 150 + 75}
            x2={end.x * 150 + 75}
            y2={end.y * 150 + 75}
            stroke={hoveredSkill?.id === skill.id ? '#6366f1' : '#9ca3af'}
            strokeWidth="2"
          />
        )
      })
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <h3 className="text-2xl font-bold mb-8">Skill Tree</h3>
      
      <div className="relative overflow-x-auto">
        <svg className="absolute inset-0 w-full h-full" style={{ minWidth: '800px' }}>
          {drawConnections()}
        </svg>
        
        <div className="relative grid grid-cols-6 gap-8" style={{ minWidth: '800px' }}>
          {skills.map((skill) => {
            const pos = getSkillPosition(skill)
            return (
              <motion.div
                key={skill.id}
                style={{
                  gridColumn: pos.x + 1,
                  gridRow: pos.y + 2,
                }}
                className={`relative flex flex-col items-center p-4 rounded-lg cursor-pointer
                  ${hoveredSkill?.id === skill.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700'}
                  transition-colors duration-200`}
                onClick={() => setSelectedSkill(skill)}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {skill.icon}
                <h4 className="mt-2 font-semibold">{skill.name}</h4>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: skill.maxLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < skill.level 
                          ? 'bg-indigo-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex items-center gap-4">
            {selectedSkill.icon}
            <div>
              <h4 className="text-xl font-semibold">{selectedSkill.name}</h4>
              <p className="text-gray-600 dark:text-gray-400">{selectedSkill.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 