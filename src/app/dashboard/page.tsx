'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockEnrollments, mockProgress, mockAssignments, mockSubmissions } from '@/lib/mockData'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Award,
  Target,
  Activity,
  Filter,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('progress')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const userEnrollments = mockEnrollments.filter(e => e.userId === user?.id)
  const userCourses = mockCourses.filter(c => 
    userEnrollments.some(e => e.courseId === c.id)
  )
  const userProgress = mockProgress.filter(p => p.userId === user?.id)
  const userSubmissions = mockSubmissions.filter(s => s.userId === user?.id)

  const stats = {
    totalCourses: user?.role === 'admin' ? mockCourses.length : userCourses.length,
    activeCourses: user?.role === 'admin' 
      ? mockCourses.filter(c => c.published).length 
      : userEnrollments.filter(e => e.status === 'active').length,
    completedCourses: user?.role === 'admin' 
      ? mockEnrollments.filter(e => e.status === 'completed').length
      : userEnrollments.filter(e => e.status === 'completed').length,
    totalUsers: user?.role === 'admin' ? mockEnrollments.length : 0,
    completedLessons: userProgress.filter(p => p.completed).length,
    totalLessons: userProgress.length,
    avgScore: userSubmissions.length > 0 
      ? Math.round(userSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / userSubmissions.length)
      : 0,
    recentActivity: userProgress.filter(p => p.completedAt && 
      new Date(p.completedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length
  }

  const getProgressData = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayProgress = userProgress.filter(p => 
        p.completedAt && new Date(p.completedAt).toDateString() === date.toDateString()
      ).length
      data.push({
        date: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
        value: dayProgress
      })
    }
    return data
  }

  const getUpcomingAssignments = () => {
    const now = new Date()
    return mockAssignments
      .filter(a => a.dueDate && new Date(a.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 3)
  }

  const getCompletionRate = () => {
    if (stats.totalLessons === 0) return 0
    return Math.round((stats.completedLessons / stats.totalLessons) * 100)
  }

  const progressData = getProgressData()
  const upcomingAssignments = getUpcomingAssignments()
  const completionRate = getCompletionRate()

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  おかえりなさい、{user?.name}さん
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  学習の進捗と最新情報をご確認ください
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="7d">過去7日間</option>
                  <option value="30d">過去30日間</option>
                  <option value="90d">過去90日間</option>
                </select>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Filter className="h-4 w-4 mr-2" />
                  フィルター
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {user?.role === 'admin' ? '総コース数' : 'マイコース'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalCourses}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    進行中: {stats.activeCourses}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        完了率
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {completionRate}%
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        平均スコア
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.avgScore}点
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    提出数: {userSubmissions.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        今週の活動
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.recentActivity}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    レッスン完了数
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Progress Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    学習進捗
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMetric('progress')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedMetric === 'progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      進捗
                    </button>
                    <button
                      onClick={() => setSelectedMetric('score')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedMetric === 'score'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      スコア
                    </button>
                  </div>
                </div>
                
                {/* Simple bar chart representation */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32">
                    {progressData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-600 rounded-t-sm w-8 transition-all duration-300"
                          style={{ 
                            height: `${Math.max(item.value * 20, 4)}px`,
                            minHeight: '4px'
                          }}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    今後の課題
                  </h3>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        期限: {new Date(assignment.dueDate!).toLocaleDateString('ja-JP')}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          {Math.ceil((new Date(assignment.dueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}日後
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingAssignments.length === 0 && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        今後の課題はありません
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                最近の活動
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userProgress.filter(p => p.completedAt).slice(0, 5).map((progress) => (
                  <div key={progress.curriculumId} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        カリキュラムを完了しました
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString('ja-JP') : ''}
                      </p>
                    </div>
                  </div>
                ))}
                
                {userProgress.filter(p => p.completedAt).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      最近の活動はありません
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.role === 'admin' ? '最近のコース' : '学習中のコース'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(user?.role === 'admin' ? mockCourses : userCourses).slice(0, 5).map((course) => {
                  const enrollment = userEnrollments.find(e => e.courseId === course.id)
                  return (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {course.description}
                          </p>
                          <div className="flex items-center mt-2">
                            {course.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {enrollment && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <div className="flex items-center space-x-2">
                                <span>進捗: {enrollment.progress}%</span>
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${enrollment.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <Link
                            href={`/courses/${course.id}`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            {user?.role === 'admin' ? '管理' : '続きを学習'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {(user?.role === 'admin' ? mockCourses : userCourses).length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.role === 'admin' ? 'コースがありません' : '受講中のコースがありません'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}