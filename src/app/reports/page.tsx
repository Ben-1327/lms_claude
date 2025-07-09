'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockEnrollments, mockProgress, mockCurricula } from '@/lib/mockData'
import { mockUsers } from '@/lib/auth'
import { BarChart3, Users, BookOpen, TrendingUp, Award, Clock } from 'lucide-react'

export default function ReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  // レポートデータの計算
  const totalUsers = mockUsers.length
  const totalCourses = mockCourses.length
  const totalEnrollments = mockEnrollments.length
  const completedEnrollments = mockEnrollments.filter(e => e.status === 'completed').length
  const activeEnrollments = mockEnrollments.filter(e => e.status === 'active').length
  const averageProgress = mockEnrollments.reduce((sum, e) => sum + e.progress, 0) / mockEnrollments.length
  const completionRate = (completedEnrollments / totalEnrollments) * 100

  // コース別統計
  const courseStats = mockCourses.map(course => {
    const courseEnrollments = mockEnrollments.filter(e => e.courseId === course.id)
    const completed = courseEnrollments.filter(e => e.status === 'completed').length
    const avgProgress = courseEnrollments.length > 0 
      ? courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length 
      : 0
    
    return {
      ...course,
      enrollments: courseEnrollments.length,
      completed,
      completionRate: courseEnrollments.length > 0 ? (completed / courseEnrollments.length) * 100 : 0,
      averageProgress: avgProgress
    }
  })

  // 最近のアクティビティ
  const recentProgress = mockProgress
    .filter(p => p.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 10)

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
            <p className="mt-1 text-sm text-gray-600">
              システム全体の学習状況と進捗を確認できます
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総ユーザー数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalUsers}名
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総コース数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalCourses}コース
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総受講数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalEnrollments}件
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        完了率
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {completionRate.toFixed(1)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Course Statistics */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">コース別統計</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {courseStats.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                        <span className="text-sm text-gray-500">{course.enrollments}名受講</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">完了率: </span>
                          <span className="font-medium">{course.completionRate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">平均進捗: </span>
                          <span className="font-medium">{course.averageProgress.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.averageProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">最近の学習活動</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentProgress.map((progress, index) => {
                    const user = mockUsers.find(u => u.id === progress.userId)
                    // 章からコースを取得
                    const curriculum = mockCurricula.find(c => 
                      c.chapters.some(ch => ch.id === progress.chapterId)
                    )
                    const course = curriculum ? mockCourses.find(c => c.id === curriculum.courseId) : null
                    const chapter = curriculum?.chapters.find(ch => ch.id === progress.chapterId)
                    
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Award className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {course?.title} - {chapter?.title} を完了しました
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {progress.completedAt && new Date(progress.completedAt).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">詳細統計</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{activeEnrollments}</div>
                  <div className="text-sm text-gray-500">学習中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedEnrollments}</div>
                  <div className="text-sm text-gray-500">完了済み</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{averageProgress.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">平均進捗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}