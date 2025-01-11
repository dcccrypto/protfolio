'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GitHubStats() {
  const username = 'yourusername' // Replace with your GitHub username

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-2xl shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        GitHub Activity
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Stats Card */}
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&theme=transparent&title_color=6366f1&text_color=6b7280&icon_color=6366f1`}
            alt="GitHub Stats"
            fill
            className="object-contain"
          />
        </div>

        {/* Languages Card */}
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=transparent&title_color=6366f1&text_color=6b7280`}
            alt="Most Used Languages"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Contributions Graph */}
      <div className="mt-6 relative aspect-[4/1] w-full">
        <Image
          src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=transparent&hide_border=true&color=6366f1&line=6366f1&point=6366f1`}
          alt="Contribution Graph"
          fill
          className="object-contain"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <motion.a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Full Profile
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
} 