import { NextResponse } from 'next/server'
import { unlink, readdir } from 'fs/promises'
import { join } from 'path'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find the file with matching UUID prefix
    const files = await readdir(UPLOADS_DIR)
    const targetFile = files.find(filename => filename.startsWith(id))

    if (!targetFile) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Delete the file
    await unlink(join(UPLOADS_DIR, targetFile))

    return new NextResponse('File deleted successfully')
  } catch (error) {
    console.error('Error deleting file:', error)
    return new NextResponse('Error deleting file', { status: 500 })
  }
} 