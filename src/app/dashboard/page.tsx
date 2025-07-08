'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockEnrollments } from '@/lib/mockData'
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

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

  const stats = {
    totalCourses: user?.role === 'admin' ? mockCourses.length : userCourses.length,
    activeCourses: user?.role === 'admin' 
      ? mockCourses.filter(c => c.published).length 
      : userEnrollments.filter(e => e.status === 'active').length,
    completedCourses: user?.role === 'admin' 
      ? mockEnrollments.filter(e => e.status === 'completed').length
      : userEnrollments.filter(e => e.status === 'completed').length,
    totalUsers: user?.role === 'admin' ? mockEnrollments.length : 0
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              おかえりなさい、{user?.name}さん
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              学習の進捗と最新情報をご確認ください
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user?.role === 'admin' ? '総コース数' : 'マイコース'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalCourses}
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
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user?.role === 'admin' ? '公開中コース' : '学習中'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.activeCourses}
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
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        完了済み
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completedCourses}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          受講者数
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Courses */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {user?.role === 'admin' ? '最近のコース' : '学習中のコース'}
              </h3>
              <div className="space-y-4">
                {(user?.role === 'admin' ? mockCourses : userCourses).slice(0, 5).map((course) => {
                  const enrollment = userEnrollments.find(e => e.courseId === course.id)
                  return (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                        <div className="flex items-center mt-2">
                          {course.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {enrollment && (
                          <div className="text-sm text-gray-500">
                            進捗: {enrollment.progress}%
                          </div>
                        )}
                        <Link
                          href={`/courses/${course.id}`}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          {user?.role === 'admin' ? '管理' : '続きを学習'}
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
              {(user?.role === 'admin' ? mockCourses : userCourses).length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {user?.role === 'admin' ? 'コースがありません' : '受講中のコースがありません'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}