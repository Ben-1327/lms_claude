'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockCurricula, mockEnrollments, mockProgress } from '@/lib/mockData'
import { ProgressManager } from '@/lib/progressManager'
import { BookOpen, CheckCircle, Circle, Calendar, Users, Play } from 'lucide-react'
import Link from 'next/link'

interface CourseDetailPageProps {
  params: { id: string }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null)

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

  const course = mockCourses.find(c => c.id === params.id)
  const curricula = mockCurricula.filter(c => c.courseId === params.id)
  const enrollment = mockEnrollments.find(e => e.courseId === params.id && e.userId === user?.id)
  const userProgress = user ? ProgressManager.getProgress(user.id) : []

  if (!course) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">コースが見つかりません</h1>
              <p className="mt-2 text-gray-600">指定されたコースは存在しません。</p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                コース一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const selectedCurriculum = selectedCurriculumId 
    ? curricula.find(c => c.id === selectedCurriculumId)
    : curricula[0]

  const getCurriculumProgress = (curriculumId: string) => {
    return userProgress.find(p => p.curriculumId === curriculumId)
  }

  const handleMarkComplete = (curriculumId: string) => {
    if (!user) return
    
    const progress = getCurriculumProgress(curriculumId)
    if (progress?.completed) {
      ProgressManager.markAsIncomplete(user.id, curriculumId)
    } else {
      ProgressManager.markAsCompleted(user.id, curriculumId)
    }
    
    // 強制的にコンポーネントを再レンダリング
    window.location.reload()
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                  <p className="mt-2 text-gray-600">{course.description}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollmentCount}名受講
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {course.createdAt.toLocaleDateString('ja-JP')}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.published ? '公開中' : '下書き'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {enrollment && (
                  <div className="ml-6 text-right">
                    <div className="text-sm text-gray-500 mb-1">進捗</div>
                    <div className="text-2xl font-bold text-blue-600">{enrollment.progress}%</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Curriculum List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">カリキュラム</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {curricula.map((curriculum, index) => {
                      const progress = getCurriculumProgress(curriculum.id)
                      const isCompleted = progress?.completed || false
                      const isSelected = selectedCurriculumId === curriculum.id || 
                                       (!selectedCurriculumId && index === 0)

                      return (
                        <button
                          key={curriculum.id}
                          onClick={() => setSelectedCurriculumId(curriculum.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400 mr-3" />
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {curriculum.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {curriculum.contentType}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCurriculum?.title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {(user?.role === 'admin' || user?.role === 'instructor') && (
                        <div className="flex space-x-2">
                          <Link
                            href={`/courses/${params.id}/curriculum`}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            カリキュラム編集
                          </Link>
                          <Link
                            href={`/courses/${params.id}/enroll`}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            受講者管理
                          </Link>
                        </div>
                      )}
                      {selectedCurriculum && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedCurriculum.contentType}
                          </span>
                          {getCurriculumProgress(selectedCurriculum.id)?.completed && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {selectedCurriculum ? (
                    <div className="prose max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedCurriculum.content
                            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$2</code></pre>')
                            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">$1</h2>')
                            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-3">$1</h3>')
                            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
                            .replace(/\n\n/g, '</p><p class="mb-4">')
                            .replace(/^(?!<[h|p|u|o])/gm, '<p class="mb-4">')
                            .replace(/<p class="mb-4"><\/p>/g, '')
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        コンテンツを選択してください
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        左側のカリキュラムから学習したい内容を選んでください
                      </p>
                    </div>
                  )}
                </div>
                {selectedCurriculum && user?.role === 'student' && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        学習が完了したらマークしてください
                      </div>
                      <button
                        onClick={() => handleMarkComplete(selectedCurriculum.id)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                          getCurriculumProgress(selectedCurriculum.id)?.completed
                            ? 'text-green-800 bg-green-100 hover:bg-green-200'
                            : 'text-white bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {getCurriculumProgress(selectedCurriculum.id)?.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            完了済み
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            完了マーク
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}