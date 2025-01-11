import { env } from '@/app/env'

const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = env.GITHUB_USERNAME

interface GitHubRepo {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  language: string
  created_at: string
  pushed_at: string
  html_url: string
  topics: string[]
  languages_url: string
}

interface GitHubUser {
  login: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  bio: string
}

interface GitHubError {
  message: string
  documentation_url?: string
}

function getAuthHeaders(isGraphQL = false) {
  const token = env.GITHUB_TOKEN
  console.log('GitHub Token:', token ? 'Token exists' : 'No token found')
  
  if (!token) {
    console.warn('GitHub token is not configured. Some features may be rate-limited.')
    return {
      'Accept': 'application/vnd.github.v3+json'
    }
  }

  const headers = {
    'Accept': isGraphQL ? 'application/vnd.github.v4+json' : 'application/vnd.github.v3+json',
    'Authorization': isGraphQL ? `bearer ${token}` : `Bearer ${token}`,
    'Content-Type': isGraphQL ? 'application/json' : 'application/vnd.github.v3+json'
  }
  
  console.log('Using headers:', {
    ...headers,
    'Authorization': headers.Authorization.replace(token, '[REDACTED]')
  })
  
  return headers
}

async function handleGitHubResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  
  if (!response.ok) {
    let errorMessage: string
    
    try {
      if (isJson) {
        const error: GitHubError = await response.json()
        errorMessage = error.message || `HTTP ${response.status}: ${response.statusText}`
        console.error('GitHub API Error:', {
          status: response.status,
          message: error.message,
          documentation: error.documentation_url
        })
      } else {
        errorMessage = await response.text()
        console.error('Non-JSON Error Response:', errorMessage)
      }
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`
      console.error('Error parsing error response:', e)
    }

    if (response.status === 401) {
      throw new Error('GitHub token is invalid or expired. Please check your configuration.')
    } else if (response.status === 403) {
      throw new Error('Rate limit exceeded. Please wait or configure a GitHub token.')
    } else {
      throw new Error(errorMessage || 'Failed to fetch data from GitHub')
    }
  }

  try {
    const data = await response.json()
    return data as T
  } catch (e) {
    console.error('Error parsing successful response:', e)
    throw new Error('Invalid response format from GitHub')
  }
}

export async function fetchGitHubProfile(): Promise<GitHubUser> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
      { headers: getAuthHeaders() }
    )
    return handleGitHubResponse<GitHubUser>(response)
  } catch (error) {
    console.error('Error fetching GitHub profile:', error)
    throw error
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers: getAuthHeaders() }
    )
    return handleGitHubResponse<GitHubRepo[]>(response)
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    throw error
  }
}

export async function fetchRepoLanguages(repo: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo}/languages`,
      { headers: getAuthHeaders() }
    )
    return handleGitHubResponse<Record<string, number>>(response)
  } catch (error) {
    console.error('Error fetching repository languages:', error)
    throw error
  }
}

export async function fetchContributionStats(): Promise<any> {
  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoryContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `

  try {
    const token = env.GITHUB_TOKEN
    if (!token) {
      throw new Error('GitHub token is required for GraphQL API access')
    }

    console.log('Making GraphQL request with query:', query)
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ query })
    })

    console.log('GraphQL Response Status:', response.status)
    console.log('GraphQL Response Headers:', Object.fromEntries(response.headers.entries()))

    const result = await handleGitHubResponse<any>(response)
    console.log('GraphQL Response Data:', result)

    if (!result.data?.user) {
      throw new Error('No user data found')
    }

    return result
  } catch (error) {
    console.error('Error fetching contribution stats:', error)
    throw error
  }
} 