'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconType } from 'react-icons'
import { FaReact, FaNodeJs, FaPython, FaAws } from 'react-icons/fa'
import { SiTypescript, SiGraphql, SiThreedotjs, SiFramer } from 'react-icons/si'
import { MdDesignServices } from 'react-icons/md'
import { VscTerminalCmd } from 'react-icons/vsc'
import { BsKanban } from 'react-icons/bs'
import { GiPuzzle } from 'react-icons/gi'

interface Skill {
  name: string
  level: number
  icon: IconType
}

interface SkillCategory {
  category: string
  items: Skill[]
}

const skills: SkillCategory[] = [
  {
    category: "Frontend Development",
    items: [
      { name: "React/Next.js", level: 95, icon: FaReact },
      { name: "Three.js/WebGL", level: 85, icon: SiThreedotjs },
      { name: "TypeScript", level: 90, icon: SiTypescript },
      { name: "GSAP/Framer Motion", level: 88, icon: SiFramer }
    ]
  },
  {
    category: "Backend Development",
    items: [
      { name: "Node.js", level: 92, icon: FaNodeJs },
      { name: "Python/Django", level: 85, icon: FaPython },
      { name: "GraphQL", level: 80, icon: SiGraphql },
      { name: "AWS/Cloud", level: 85, icon: FaAws }
    ]
  },
  {
    category: "Other Skills",
    items: [
      { name: "UI/UX Design", level: 88, icon: MdDesignServices },
      { name: "DevOps/CI/CD", level: 82, icon: VscTerminalCmd },
      { name: "Agile/Scrum", level: 90, icon: BsKanban },
      { name: "Problem Solving", level: 95, icon: GiPuzzle }
    ]
  }
]

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const progressBars = document.querySelectorAll('.progress-bar')
    
    progressBars.forEach((bar) => {
      const value = bar.getAttribute('data-value')
      gsap.to(bar, {
        width: `${value}%`,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bar,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Skills & Expertise
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {skills.map((category, index) => (
            <motion.div 
              key={index}
              className="space-y-6 p-6 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">{category.category}</h3>
              <div className="space-y-4">
                {category.items.map((skill, skillIndex) => (
                  <motion.div 
                    key={skillIndex} 
                    className="space-y-2 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <skill.icon className="w-5 h-5 text-indigo-500 group-hover:text-purple-500 transition-colors" />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-indigo-500 group-hover:text-purple-500 transition-colors">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="progress-bar h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-0 group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300"
                        data-value={skill.level}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 