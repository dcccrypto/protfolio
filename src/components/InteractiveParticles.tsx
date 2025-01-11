'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { random } from 'maath'

interface ParticleFieldProps {
  mousePosition: {
    x: number;
    y: number;
  };
}

function ParticleField({ mousePosition }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null)
  const [positions, originalPositions] = useMemo(() => {
    const positions = new Float32Array(10000 * 3)
    random.inSphere(positions, { radius: 2 })
    return [positions, positions.slice()]
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const { clock } = state
    
    // Rotate based on time
    ref.current.rotation.x = Math.sin(clock.elapsedTime / 10)
    ref.current.rotation.y = Math.sin(clock.elapsedTime / 15)

    // React to mouse position
    for (let i = 0; i < positions.length; i += 3) {
      const distance = Math.sqrt(
        Math.pow(positions[i] - mousePosition.x, 2) +
        Math.pow(positions[i + 1] - mousePosition.y, 2)
      )
      
      const repelForce = Math.max(0, 1 - distance / 0.5)
      positions[i] = originalPositions[i] + (positions[i] - mousePosition.x) * repelForce * 0.1
      positions[i + 1] = originalPositions[i + 1] + (positions[i + 1] - mousePosition.y) * repelForce * 0.1
    }
    if (ref.current.geometry.attributes.position) {
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
      />
    </Points>
  )
}

export default function InteractiveParticles() {
  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent) => {
    mousePosition.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    }
  }

  return (
    <div className="fixed inset-0 -z-10" onMouseMove={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <ParticleField mousePosition={mousePosition.current} />
      </Canvas>
    </div>
  )
} 