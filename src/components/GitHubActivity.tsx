'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaStar } from 'react-icons/fa'
import { BiGitCommit } from 'react-icons/bi'
import { TbGitPullRequest } from 'react-icons/tb'

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ContributionWeek {
  days: ContributionDay[]
}

interface ContributionData {
  totalContributions: number
  weeks: ContributionWeek[]
}

interface ActivityStats {
  commits: number
  pullRequests: number
  issues: number
  stars: number
}

export default function GitHubActivity() {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/github/contributions')
        if (!response.ok) throw new Error('Failed to fetch GitHub data')
        const data = await response.json()
        setContributionData(data.contributions)
        setActivityStats(data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getContributionColor = (level: number) => {
    const colors = {
      0: 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      1: 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800',
      2: 'bg-green-200 dark:bg-green-800/40 border border-green-300 dark:border-green-700',
      3: 'bg-green-300 dark:bg-green-700/50 border border-green-400 dark:border-green-600',
      4: 'bg-green-400 dark:bg-green-600/60 border border-green-500 dark:border-green-500'
    }
    return colors[level as keyof typeof colors]
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaGithub className="text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">GitHub Activity</h3>
              {contributionData && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contributionData.totalContributions.toLocaleString()} contributions in the last year
                </p>
              )}
            </div>
          </div>
          {activityStats && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BiGitCommit className="text-green-500" />
                <span>{activityStats.commits.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TbGitPullRequest className="text-purple-500" />
                <span>{activityStats.pullRequests.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaStar className="text-yellow-500" />
                <span>{activityStats.stars.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {contributionData && (
          <div className="space-y-4">
            <div className="overflow-x-auto -mx-6 px-6 pb-2">
              <div className="grid grid-cols-[repeat(52,1fr)] gap-1 min-w-[750px]">
                {contributionData.weeks.flatMap((week, weekIndex) =>
                  week.days.map((day, dayIndex) => (
                    <motion.button
                      key={`${weekIndex}-${dayIndex}`}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square w-full ${getContributionColor(
                        day.level
                      )} transition-all rounded-sm hover:ring-2 hover:ring-indigo-500/20`}
                    />
                  ))
                )}
              </div>
            </div>

            <AnimatePresence>
              {selectedDay && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(selectedDay.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedDay.count} contribution{selectedDay.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 ${getContributionColor(level)} rounded-sm`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 