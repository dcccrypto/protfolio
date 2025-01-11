'use client'
import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, OrbitControls, useTexture, Points, PointMaterial } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mesh, Vector3, BufferGeometry, Float32BufferAttribute } from 'three'
import { FaGithub, FaLinkedin, FaCode, FaReact, FaNodeJs, FaDatabase, FaDownload } from 'react-icons/fa'
import { HiDocumentDownload, HiChevronDown } from 'react-icons/hi'
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiPython, SiDocker } from 'react-icons/si'

function Stars({ count = 5000 }) {
  const points = useRef<any>()
  
  // Create positions array once
  const [positions] = useState(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  })

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x += 0.0001
      points.current.rotation.y += 0.0001
    }
  })

  return (
    <Points ref={points} positions={positions}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2

      if (hovered) {
        meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 2.2
      } else {
        meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 2
      }
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 100, 100]}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color={clicked ? "#9333ea" : "#8b5cf6"}
        attach="material"
        distort={hovered ? 0.7 : 0.5}
        speed={hovered ? 5 : 2}
        roughness={0.5}
        metalness={0.2}
      />
    </Sphere>
  )
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      <Stars />
      <AnimatedSphere />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  )
}

const TechBadge = ({ icon: Icon, label, delay = 0 }: { icon: any; label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ y: -2, scale: 1.05 }}
    className="flex items-center gap-1.5 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/10 dark:border-gray-700/30"
  >
    <Icon className="text-indigo-500" />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </motion.div>
)

export default function Hero3D() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y = useTransform(scrollY, [0, 300], [0, 100])
  
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge('2006-10-12')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/5">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
          </div>
        }>
          <Scene3D />
        </Suspense>
      </div>
      
      <motion.div style={{ opacity, y }} className="relative z-10 h-screen flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium text-indigo-500 mb-2"
            >
              Hello, I'm
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              Khubair Nasir
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6"
            >
              {age} years old • Greater Manchester, UK
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-200/10 dark:border-gray-700/30"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg font-semibold mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
              >
                T-Level Digital Production, Design & Development
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-600 dark:text-gray-300 mb-4"
              >
                Currently studying a comprehensive program that combines:
              </motion.p>
              <motion.ul 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="list-none space-y-2 text-gray-600 dark:text-gray-300 mb-6"
              >
                {[
                  'Advanced Web Development',
                  'Software Design & Testing',
                  'Digital Business Processes',
                  'Industry Work Placements'
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <div className="flex flex-wrap gap-2">
                <TechBadge icon={SiNextdotjs} label="Next.js" delay={1.2} />
                <TechBadge icon={FaReact} label="React" delay={1.3} />
                <TechBadge icon={SiTypescript} label="TypeScript" delay={1.4} />
                <TechBadge icon={SiTailwindcss} label="Tailwind" delay={1.5} />
                <TechBadge icon={FaNodeJs} label="Node.js" delay={1.6} />
                <TechBadge icon={SiPython} label="Python" delay={1.7} />
                <TechBadge icon={FaDatabase} label="SQL" delay={1.8} />
                <TechBadge icon={SiDocker} label="Docker" delay={1.9} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <FaCode className="text-xl" />
                View Projects
              </motion.a>
              
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-indigo-500/50 text-indigo-500 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                <HiDocumentDownload className="text-xl" />
                Download CV
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              className="mt-12 flex items-center gap-6"
            >
              <span className="text-gray-500">Follow me on</span>
              <div className="flex gap-4">
                <motion.a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-2xl text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-all duration-300"
                >
                  <FaGithub />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-2xl text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-all duration-300"
                >
                  <FaLinkedin />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <HiChevronDown className="text-2xl text-indigo-500" />
        </motion.div>
      </motion.div>
    </section>
  )
} 