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
    setStatus('idle')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStatus('success')
      (e.target as HTMLFormElement).reset()
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
      {/* Move all the content from Contact.tsx here */}
      <div className="container max-w-6xl mx-auto px-6">
        {/* ... rest of your existing JSX ... */}
      </div>
    </motion.div>
  )
} 