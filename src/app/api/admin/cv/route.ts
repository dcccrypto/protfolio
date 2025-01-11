import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const cvPath = join(process.cwd(), 'public', 'resume.pdf')
    const file = await readFile(cvPath)
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (error) {
    console.error('Error reading CV file:', error)
    return NextResponse.json(
      { error: 'Failed to download CV' },
      { status: 500 }
    )
  }
} 