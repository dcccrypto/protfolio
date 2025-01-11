'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiArrowRight } from 'react-icons/hi'

export default function ContactForm() {
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Update status after the promise resolves
      setStatus('success')
      // Reset form
      e.currentTarget.reset()
    } catch (error) {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {sending ? (
              <>
                <HiMail className="mr-2" />
                Sending...
              </>
            ) : (
              <>
                <HiArrowRight className="mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  )
} 