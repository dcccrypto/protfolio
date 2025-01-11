'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch, FaCode, FaExclamationTriangle, FaSync } from 'react-icons/fa'
import { BiGitCommit } from 'react-icons/bi'
import { fetchGitHubProfile, fetchGitHubRepos, fetchContributionStats } from '@/services/github'

export default function GitHubStats() {
  const [profile, setProfile] = useState<any>(null)
  const [repos, setRepos] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)

  async function fetchData() {
    try {
      setLoading(true)
      setError('')
      
      const [profileData, reposData, statsData] = await Promise.all([
        fetchGitHubProfile(),
        fetchGitHubRepos(),
        fetchContributionStats()
      ])
      
      setProfile(profileData)
      setRepos(reposData)
      setStats(statsData.data.user.contributionsCollection)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GitHub data')
      console.error(err)
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <FaExclamationTriangle className="text-4xl text-yellow-500" />
        <div className="text-red-500 font-medium">{error}</div>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {error.includes('token') ? (
            'Please make sure your GitHub token is properly configured in the environment variables.'
          ) : (
            'There was an error fetching your GitHub data. Please try again later.'
          )}
        </p>
        <button
          onClick={() => {
            setRetrying(true)
            fetchData()
          }}
          disabled={retrying}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          <FaSync className={`${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="GitHub Avatar"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold">{profile?.login}</h3>
            <p className="text-gray-600 dark:text-gray-400">{profile?.bio}</p>
          </div>
        </div>
      </div>

      {/* Contribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <BiGitCommit className="text-2xl text-indigo-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Commits</p>
              <p className="text-2xl font-bold">{stats?.totalCommitContributions}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FaStar className="text-2xl text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Stars</p>
              <p className="text-2xl font-bold">
                {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FaCodeBranch className="text-2xl text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Forks</p>
              <p className="text-2xl font-bold">
                {repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FaCode className="text-2xl text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Repositories</p>
              <p className="text-2xl font-bold">{profile?.public_repos}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Repositories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Repositories</h3>
        <div className="space-y-4">
          {repos.slice(0, 5).map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-indigo-600 dark:text-indigo-400">
                    {repo.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {repo.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm">
                    <FaStar className="text-yellow-500" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <FaCodeBranch className="text-green-500" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 