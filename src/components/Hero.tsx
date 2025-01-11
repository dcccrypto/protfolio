'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Creative Developer
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Building digital experiences that make a difference
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View Projects
              </button>
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">
                Contact Me
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="aspect-square rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1">
              <div className="rounded-full overflow-hidden">
                <Image 
                  src="/your-photo.jpg"
                  alt="Developer portrait"
                  width={400}
                  height={400}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 