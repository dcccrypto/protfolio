'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<(HTMLDivElement | null)[]>([])
  const numTrails = 8

  useEffect(() => {
    const cursor = cursorRef.current
    const trails = trailsRef.current.filter(Boolean) as HTMLDivElement[]

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      
      // Animate main cursor
      if (cursor) {
        gsap.to(cursor, {
          x: clientX,
          y: clientY,
          duration: 0.1
        })
      }

      // Animate trails with staggered delay
      trails.forEach((trail, index) => {
        gsap.to(trail, {
          x: clientX,
          y: clientY,
          duration: 0.5,
          delay: index * 0.08
        })
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const setTrailRef = (el: HTMLDivElement | null, index: number) => {
    trailsRef.current[index] = el
  }

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed w-4 h-4 bg-indigo-500 rounded-full pointer-events-none mix-blend-difference z-50 -translate-x-1/2 -translate-y-1/2"
      />
      {Array.from({ length: numTrails }).map((_, i) => (
        <div
          key={i}
          ref={(el) => setTrailRef(el, i)}
          className="fixed w-2 h-2 bg-indigo-300 rounded-full pointer-events-none mix-blend-difference z-50 opacity-50 -translate-x-1/2 -translate-y-1/2"
          style={{ filter: 'blur(2px)' }}
        />
      ))}
    </>
  )
} 