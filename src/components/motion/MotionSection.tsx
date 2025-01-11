'use client'

import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode
}

export default function MotionSection({ children, ...props }: MotionSectionProps) {
  return (
    <motion.section {...props}>
      {children}
    </motion.section>
  )
} 