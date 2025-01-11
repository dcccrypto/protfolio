import dynamic from 'next/dynamic'

// Import static components
import Hero3D from '@/components/Hero3D'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import MobileNav from '@/components/MobileNav'

// Dynamically import components with heavy dependencies
const GitHubActivity = dynamic(() => import('@/components/GitHubActivity'), { ssr: false })
const SkillTree = dynamic(() => import('@/components/SkillTree'), { ssr: false })
const LiveCodeEditor = dynamic(() => import('@/components/LiveCodeEditor'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 sm:space-y-16 lg:space-y-20">
        <section id="hero">
          <Hero3D />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="skills" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <Skills />
          <GitHubActivity />
        </section>
        <SkillTree />
        <LiveCodeEditor />
        <section id="contact">
          <Contact />
        </section>
      </div>
      <MobileNav />
    </main>
  )
}
