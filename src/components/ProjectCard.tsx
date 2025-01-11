'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  index: number
}

export default function ProjectCard({ title, description, image, tags, link, index }: ProjectCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true })

  useEffect(() => {
    if (isInView) {
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.2
      })
    }
  }, [isInView, index])

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileHover={{ y: -10 }}
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span 
              key={i}
              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <motion.a 
          href={link}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 group"
          whileHover={{ x: 10 }}
        >
          View Project
          <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
} 