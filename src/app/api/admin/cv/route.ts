import { NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const CV_PATH = join(process.cwd(), 'public', 'cv')
const CV_INFO_PATH = join(CV_PATH, 'info.json')

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('cv') as File | null
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!validTypes.includes(file.type)) {
      return new NextResponse('Invalid file type', { status: 400 })
    }

    // Create unique filename
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    
    // Save to CV directory
    await writeFile(join(CV_PATH, filename), buffer)
    
    // Save CV info
    const cvInfo = {
      filename,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
      fileType: file.type
    }
    
    await writeFile(CV_INFO_PATH, JSON.stringify(cvInfo, null, 2))
    
    // Return the public URL
    return NextResponse.json({ 
      url: `/cv/${filename}`
    })
  } catch (error) {
    console.error('CV upload error:', error)
    return new NextResponse('Error uploading CV', { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Read CV info
    const cvInfo = require(CV_INFO_PATH)
    
    // Delete CV file
    await unlink(join(CV_PATH, cvInfo.filename))
    
    // Delete CV info
    await unlink(CV_INFO_PATH)
    
    return new NextResponse('CV deleted successfully')
  } catch (error) {
    console.error('CV deletion error:', error)
    return new NextResponse('Error deleting CV', { status: 500 })
  }
}

export async function GET() {
  try {
    // Read CV info
    const cvInfo = require(CV_INFO_PATH)
    
    return NextResponse.json({
      url: `/cv/${cvInfo.filename}`,
      ...cvInfo
    })
  } catch (error) {
    return new NextResponse('No CV found', { status: 404 })
  }
} 