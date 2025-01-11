'use client'

import { motion } from 'framer-motion'

export default function MotionSection({ children, ...props }) {
  return (
    <motion.section {...props}>
      {children}
    </motion.section>
  )
} 