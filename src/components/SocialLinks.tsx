'use client'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: FaGithub,
    color: 'hover:text-gray-800 dark:hover:text-white'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: FaLinkedin,
    color: 'hover:text-blue-600'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/yourusername',
    icon: FaTwitter,
    color: 'hover:text-blue-400'
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: HiMail,
    color: 'hover:text-red-500'
  }
]

export default function SocialLinks() {
  return (
    <div className="fixed left-8 bottom-0 hidden xl:flex flex-col items-center gap-4 after:content-[''] after:w-[1px] after:h-32 after:bg-gray-300 dark:after:bg-gray-700">
      {socialLinks.map((link) => {
        const Icon = link.icon
        return (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-2xl text-gray-600 dark:text-gray-400 transition-colors ${link.color}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={link.name}
          >
            <Icon />
          </motion.a>
        )
      })}
    </div>
  )
} 