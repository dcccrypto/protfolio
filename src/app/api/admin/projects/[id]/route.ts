import { NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'

const PROJECTS_PATH = join(process.cwd(), 'public', 'data', 'projects.json')

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  features: string[]
  images: string[]
  technologies: string[]
  githubRepo: string
  liveDemo?: string
  inProgress?: boolean
}

// Helper function to read projects
async function getProjects(): Promise<Project[]> {
  try {
    const content = await readFile(PROJECTS_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return []
  }
}

// Helper function to write projects
async function saveProjects(projects: Project[]) {
  await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2))
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projects = await getProjects()
    const projectId = parseInt(params.id)

    const projectIndex = projects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      return new NextResponse('Project not found', { status: 404 })
    }

    // Get the project to delete its images
    const project = projects[projectIndex]

    // Delete project images
    for (const imagePath of project.images) {
      try {
        const fullPath = join(process.cwd(), 'public', imagePath)
        await unlink(fullPath)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Remove project from array
    projects.splice(projectIndex, 1)
    await saveProjects(projects)

    return new NextResponse('Project deleted successfully')
  } catch (error) {
    console.error('Error deleting project:', error)
    return new NextResponse('Error deleting project', { status: 500 })
  }
} 