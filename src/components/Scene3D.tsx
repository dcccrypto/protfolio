'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { random } from 'maath'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const positions = new Float32Array(5000 * 3)
    random.inSphere(positions, { radius: 1.5 })
    return positions
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const { clock } = state
    ref.current.rotation.x = Math.sin(clock.elapsedTime / 10)
    ref.current.rotation.y = Math.sin(clock.elapsedTime / 15)
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  )
} 