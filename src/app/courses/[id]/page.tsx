'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockCurricula, mockEnrollments, mockProgress, mockAssignments, mockSubmissions } from '@/lib/mockData'
import { ProgressManager } from '@/lib/progressManager'
import { BookOpen, CheckCircle, Circle, Calendar, Users, Play, FileText, Clock, AlertCircle } from 'lucide-react'
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">コースが見つかりません</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">指定されたコースは存在しません。</p>
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

  const getRelatedAssignments = (curriculumId: string) => {
    return mockAssignments.filter(assignment => 
      assignment.curriculumIds.includes(curriculumId)
    )
  }

  const getAssignmentSubmission = (assignmentId: string) => {
    if (!user) return null
    return mockSubmissions.find(s => 
      s.assignmentId === assignmentId && s.userId === user.id
    )
  }

  const getAssignmentStatus = (assignment: any) => {
    const submission = getAssignmentSubmission(assignment.id)
    if (!submission) return 'not_started'
    return submission.status
  }

  const getDaysUntilDue = (dueDate: Date | null) => {
    if (!dueDate) return null
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Header */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{course.description}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollmentCount}名受講
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">進捗</div>
                    <div className="text-2xl font-bold text-blue-600">{enrollment.progress}%</div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
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
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">カリキュラム</h2>
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
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400 mr-3" />
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {curriculum.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
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
                        className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        コンテンツを選択してください
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        左側のカリキュラムから学習したい内容を選んでください
                      </p>
                    </div>
                  )}
                </div>
                {selectedCurriculum && user?.role === 'student' && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
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

              {/* Related Assignments */}
              {selectedCurriculum && (() => {
                const relatedAssignments = getRelatedAssignments(selectedCurriculum.id)
                return relatedAssignments.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        関連課題
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        このカリキュラムに関連する課題です
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {relatedAssignments.map((assignment) => {
                          const status = getAssignmentStatus(assignment)
                          const submission = getAssignmentSubmission(assignment.id)
                          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
                          const isOverdue = daysUntilDue !== null && daysUntilDue < 0
                          
                          return (
                            <div key={assignment.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {assignment.title}
                                      </h4>
                                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {assignment.description}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span>タイプ: {assignment.type === 'essay' ? 'エッセイ' : assignment.type === 'project' ? 'プロジェクト' : assignment.type === 'presentation' ? 'プレゼンテーション' : 'クイズ'}</span>
                                    <span>満点: {assignment.maxScore}点</span>
                                    {assignment.dueDate && (
                                      <span className={isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}>
                                        期限: {new Date(assignment.dueDate).toLocaleDateString('ja-JP')}
                                        {daysUntilDue !== null && (
                                          <>
                                            {' '}({isOverdue ? `${Math.abs(daysUntilDue)}日経過` : `あと${daysUntilDue}日`})
                                          </>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 ml-4">
                                  {/* Assignment Status */}
                                  <div className="flex items-center space-x-2">
                                    {status === 'not_started' && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                                        未開始
                                      </span>
                                    )}
                                    {status === 'draft' && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                                        下書き保存中
                                      </span>
                                    )}
                                    {status === 'submitted' && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                        提出済み
                                      </span>
                                    )}
                                    {status === 'graded' && submission && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                        採点済み ({submission.score}/{assignment.maxScore}点)
                                      </span>
                                    )}
                                    {status === 'returned' && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                                        返却済み
                                      </span>
                                    )}
                                  </div>

                                  {/* Due Date Warning */}
                                  {assignment.dueDate && daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0 && (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  )}
                                  {isOverdue && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}

                                  {/* Action Button */}
                                  {user?.role === 'student' && (
                                    <Link
                                      href={`/assignments/${assignment.id}/submit`}
                                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                      {status === 'not_started' ? '課題に取り組む' : 
                                       status === 'draft' ? '続きを書く' :
                                       status === 'submitted' ? '提出内容を確認' :
                                       status === 'graded' ? '結果を確認' :
                                       status === 'returned' ? '修正する' : '確認'}
                                    </Link>
                                  )}
                                  {(user?.role === 'admin' || user?.role === 'instructor') && submission && (
                                    <Link
                                      href={`/assignments/${assignment.id}/review/${submission.id}`}
                                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                    >
                                      レビュー
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}