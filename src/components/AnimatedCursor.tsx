'use client'

import { useEffect, useState } from 'react'

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div 
      className="fixed w-8 h-8 pointer-events-none mix-blend-difference z-50"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        background: 'white',
        borderRadius: '50%',
        transition: 'all 0.1s ease'
      }}
    />
  )
} 