import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse('Invalid file type', { status: 400 })
    }

    // Create unique filename
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    
    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads')
    await writeFile(join(publicDir, filename), buffer)
    
    // Return the public URL
    return NextResponse.json({ 
      url: `/uploads/${filename}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse('Error uploading file', { status: 500 })
  }
} 