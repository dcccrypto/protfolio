'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    content: "One of the most talented developers I've worked with. Their ability to solve complex problems and create elegant solutions is remarkable.",
    author: "Sarah Johnson",
    role: "Tech Lead at TechCorp",
    image: "/testimonials/sarah.jpg"
  },
  {
    id: 2,
    content: "Exceptional work ethic and technical skills. They consistently delivered high-quality code and were a pleasure to work with.",
    author: "Michael Chen",
    role: "Senior Developer at InnovateTech",
    image: "/testimonials/michael.jpg"
  },
  {
    id: 3,
    content: "Their attention to detail and commitment to writing clean, maintainable code sets them apart. A true professional.",
    author: "Emily Rodriguez",
    role: "Project Manager at DevStudio",
    image: "/testimonials/emily.jpg"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
        >
          What People Say
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg p-8 md:p-12 rounded-2xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].author}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                    "{testimonials[currentIndex].content}"
                  </p>
                  <h3 className="font-semibold text-lg">
                    {testimonials[currentIndex].author}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-indigo-600 text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-indigo-600 text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
} 