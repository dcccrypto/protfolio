'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type AnimationType = 'fadeUp' | 'fadeIn' | 'scaleUp' | 'slideIn'

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
}

const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  slideIn: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
}

export default function ScrollAnimation({ 
  children, 
  animation = 'fadeUp',
  duration = 0.8,
  delay = 0,
  className = '',
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <motion.div
      ref={ref}
      variants={animations[animation]}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 