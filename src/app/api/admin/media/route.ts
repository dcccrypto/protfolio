import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
}

export async function GET() {
  try {
    // Read all files in the uploads directory
    const files = await readdir(UPLOADS_DIR)
    
    // Get file stats for each file
    const mediaItems: MediaItem[] = await Promise.all(
      files.map(async (filename) => {
        const filePath = join(UPLOADS_DIR, filename)
        const stats = await stat(filePath)
        
        return {
          id: filename.split('-')[0], // UUID is the first part of the filename
          url: `/uploads/${filename}`,
          name: filename.split('-').slice(1).join('-'), // Original filename is after the UUID
          size: stats.size,
          uploadedAt: stats.mtime.toISOString()
        }
      })
    )
    
    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Error reading media directory:', error)
    return new NextResponse('Error reading media directory', { status: 500 })
  }
} 