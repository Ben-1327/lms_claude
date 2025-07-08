'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockAssignments, mockSubmissions, mockCurricula } from '@/lib/mockData'
import { mockUsers } from '@/lib/auth'
import { FileText, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default function AssignmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user?.role === 'student') {
      // 受講者: 自分の課題のみ表示
      const userSubmissions = mockSubmissions.filter(s => s.userId === user.id)
      setSubmissions(userSubmissions)
      setAssignments(mockAssignments)
    } else if (user?.role === 'instructor' || user?.role === 'admin') {
      // 講師/管理者: 全ての課題とレビュー待ちの提出物を表示
      setAssignments(mockAssignments)
      setSubmissions(mockSubmissions)
    }
  }, [user])

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

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(s => s.assignmentId === assignmentId && s.userId === user?.id)
    return submission
  }

  const getSubmissionStatusBadge = (submission: any) => {
    if (!submission) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="h-3 w-3 mr-1" />
          未提出
        </span>
      )
    }

    switch (submission.status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            レビュー待ち
          </span>
        )
      case 'graded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            採点済み
          </span>
        )
      case 'returned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            再提出要求
          </span>
        )
      default:
        return null
    }
  }

  const getDueDateStatus = (dueDate?: Date) => {
    if (!dueDate) return null
    
    const now = new Date()
    const timeDiff = dueDate.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    if (daysDiff < 0) {
      return <span className="text-red-600">期限切れ</span>
    } else if (daysDiff <= 3) {
      return <span className="text-yellow-600">あと{daysDiff}日</span>
    } else {
      return <span className="text-gray-600">{dueDate.toLocaleDateString('ja-JP')}</span>
    }
  }

  const getCurriculumTitle = (curriculumId: string) => {
    const curriculum = mockCurricula.find(c => c.id === curriculumId)
    return curriculum?.title || 'Unknown'
  }

  const getReviewStats = () => {
    const pendingReviews = submissions.filter(s => s.status === 'submitted').length
    const completedReviews = submissions.filter(s => s.status === 'graded').length
    return { pendingReviews, completedReviews }
  }

  if (user?.role === 'student') {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">課題一覧</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                あなたの課題と提出状況を確認できます
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {assignments.map((assignment) => {
                const submission = getSubmissionStatus(assignment.id)
                return (
                  <div key={assignment.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getCurriculumTitle(assignment.curriculumId)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSubmissionStatusBadge(submission)}
                        {submission?.score && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            {submission.score}点
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="prose max-w-none mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {assignment.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          期限: {getDueDateStatus(assignment.dueDate)}
                        </div>
                        <div>
                          満点: {assignment.maxScore}点
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {submission ? (
                          <Link
                            href={`/assignments/${assignment.id}/submission`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            提出内容を確認
                          </Link>
                        ) : (
                          <Link
                            href={`/assignments/${assignment.id}/submit`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            課題を提出
                          </Link>
                        )}
                      </div>
                    </div>

                    {submission?.feedback && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                          講師からのフィードバック
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // 講師・管理者向けのレビュー画面
  const stats = getReviewStats()

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">課題レビュー</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              受講者の課題提出をレビューできます
            </p>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    レビュー待ち
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.pendingReviews}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    レビュー完了
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.completedReviews}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    総提出数
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {submissions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 提出物一覧 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                提出物一覧
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {submissions.map((submission) => {
                const assignment = assignments.find(a => a.id === submission.assignmentId)
                const submitter = mockUsers.find(u => u.id === submission.userId)
                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {assignment?.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          提出者: {submitter?.name} ({submitter?.email})
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          提出日: {submission.submittedAt.toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSubmissionStatusBadge(submission)}
                        {submission.score && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            {submission.score}点
                          </span>
                        )}
                        <Link
                          href={`/assignments/${assignment?.id}/review/${submission.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          {submission.status === 'submitted' ? 'レビュー' : '確認'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}