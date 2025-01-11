'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaEye, FaCode, FaUser, FaClock } from 'react-icons/fa'
import { BiGitRepoForked, BiGitCommit } from 'react-icons/bi'
import { TbGitPullRequest } from 'react-icons/tb'
import { ErrorBoundary } from 'react-error-boundary'

interface GitHubRepo {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  html_url: string
  homepage: string | null
  topics: string[]
  language: string
  watchers_count: number
  open_issues_count: number
  default_branch: string
  pushed_at: string
  created_at: string
  languages_url: string
}

interface GitHubLanguages {
  [key: string]: number
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl: string;
  image: string;
  highlights: string[];
  role: string;
  duration: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Modern Portfolio Website',
    description: 'A sleek and interactive portfolio website built with Next.js and Three.js',
    technologies: ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://portfolio.example.com',
    githubUrl: 'https://github.com/yourusername/portfolio',
    image: '/projects/portfolio.png',
    highlights: [
      'Implemented 3D animations using Three.js',
      'Achieved 95+ Lighthouse performance score',
      'Built responsive layouts using Tailwind CSS'
    ],
    role: 'Full Stack Developer',
    duration: '2 months'
  },
  // Add more projects...
]

export default function Projects() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative aspect-video">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600"
                    >
                      <FaExternalLinkAlt className="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300">{project.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaUser className="w-4 h-4" />
                  <span>{project.role}</span>
                  <span>•</span>
                  <FaClock className="w-4 h-4" />
                  <span>{project.duration}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                  {project.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 