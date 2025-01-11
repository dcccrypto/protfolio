import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
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

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    return new NextResponse('Error fetching projects', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const projects = await getProjects()
    
    const newProject: Project = {
      id: Date.now(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      features: (formData.get('features') as string).split('\n').filter(Boolean),
      images: JSON.parse(formData.get('images') as string || '[]'),
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
      githubRepo: formData.get('githubRepo') as string,
      liveDemo: formData.get('liveDemo') as string || undefined,
      inProgress: formData.get('inProgress') === 'true'
    }

    projects.push(newProject)
    await saveProjects(projects)

    return NextResponse.json(newProject)
  } catch (error) {
    console.error('Error creating project:', error)
    return new NextResponse('Error creating project', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const projects = await getProjects()
    const projectId = parseInt(formData.get('id') as string)

    const updatedProject: Project = {
      id: projectId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      features: (formData.get('features') as string).split('\n').filter(Boolean),
      images: JSON.parse(formData.get('images') as string || '[]'),
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
      githubRepo: formData.get('githubRepo') as string,
      liveDemo: formData.get('liveDemo') as string || undefined,
      inProgress: formData.get('inProgress') === 'true'
    }

    const index = projects.findIndex(p => p.id === projectId)
    if (index === -1) {
      return new NextResponse('Project not found', { status: 404 })
    }

    projects[index] = updatedProject
    await saveProjects(projects)

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return new NextResponse('Error updating project', { status: 500 })
  }
} 