'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockAssignments, mockSubmissions, mockCurricula } from '@/lib/mockData'
import { 
  ArrowLeft, 
  Save, 
  Send, 
  User, 
  Clock, 
  FileText, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function ReviewSubmissionPage({ 
  params 
}: { 
  params: { id: string; submissionId: string } 
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assignment, setAssignment] = useState<any>(null)
  const [submission, setSubmission] = useState<any>(null)
  const [review, setReview] = useState({
    score: 0,
    feedback: '',
    status: 'graded' as 'graded' | 'returned'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'student') {
      router.push('/assignments')
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    const foundAssignment = mockAssignments.find(a => a.id === params.id)
    const foundSubmission = mockSubmissions.find(s => s.id === params.submissionId)
    
    if (foundAssignment && foundSubmission) {
      setAssignment(foundAssignment)
      setSubmission(foundSubmission)
      
      // 既存のレビューがある場合は初期値として設定
      if (foundSubmission.score !== undefined) {
        setReview({
          score: foundSubmission.score,
          feedback: foundSubmission.feedback || '',
          status: foundSubmission.status === 'returned' ? 'returned' : 'graded'
        })
      }
    }
  }, [params.id, params.submissionId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role === 'student') {
    return null
  }

  if (!assignment || !submission) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">課題または提出物が見つかりません</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                指定された課題または提出物は存在しません
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleSaveReview = async () => {
    setIsSubmitting(true)
    try {
      console.log('Saving review:', review)
      await new Promise(resolve => setTimeout(resolve, 1000))
      // ここで実際のAPIコールを行う
    } catch (error) {
      console.error('Review save failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!review.feedback.trim()) {
      alert('フィードバックを入力してください')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Submitting review:', review)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowConfirmDialog(false)
      router.push('/assignments')
    } catch (error) {
      console.error('Review submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600'
      case 'graded': return 'text-green-600'
      case 'returned': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '提出済み'
      case 'graded': return '採点済み'
      case 'returned': return '返却済み'
      default: return '不明'
    }
  }

  const getRelatedCurricula = () => {
    return mockCurricula.filter(c => assignment.curriculumIds.includes(c.id))
  }

  const relatedCurricula = getRelatedCurricula()

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/assignments"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              課題一覧に戻る
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignment.title} - 提出物レビュー
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  学生の提出物を確認し、採点・フィードバックを行います
                </p>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(submission.status)}`}>
                {submission.status === 'submitted' && <Clock className="h-5 w-5" />}
                {submission.status === 'graded' && <CheckCircle className="h-5 w-5" />}
                {submission.status === 'returned' && <AlertCircle className="h-5 w-5" />}
                <span className="text-sm font-medium">{getStatusText(submission.status)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 提出物内容 */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    提出内容
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>学生ID: {submission.userId}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(submission.submittedAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      課題の説明
                    </h4>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                      {assignment.description}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    学生の回答
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
                    <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                      {submission.content}
                    </div>
                  </div>
                </div>

                {submission.files && submission.files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      添付ファイル
                    </h4>
                    <div className="space-y-2">
                      {submission.files.map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({Math.round(file.size / 1024)} KB)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* レビューフォーム */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  採点とフィードバック
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      点数 (満点: {assignment.maxScore}点)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        max={assignment.maxScore}
                        value={review.score}
                        onChange={(e) => setReview(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round((review.score / assignment.maxScore) * 5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({Math.round((review.score / assignment.maxScore) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      フィードバック
                    </label>
                    <textarea
                      value={review.feedback}
                      onChange={(e) => setReview(prev => ({ ...prev, feedback: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="学生への詳細なフィードバックを入力してください..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      レビュー状態
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="graded"
                          checked={review.status === 'graded'}
                          onChange={(e) => setReview(prev => ({ ...prev, status: e.target.value as 'graded' | 'returned' }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          採点済み（学生に結果を通知）
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="returned"
                          checked={review.status === 'returned'}
                          onChange={(e) => setReview(prev => ({ ...prev, status: e.target.value as 'graded' | 'returned' }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          返却（修正が必要）
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={handleSaveReview}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? '保存中...' : 'ドラフト保存'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isSubmitting || !review.feedback.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    レビュー完了
                  </button>
                </div>
              </div>
            </div>

            {/* サイドバー情報 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  課題情報
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      課題タイプ
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {assignment.type === 'essay' ? 'エッセイ' : 
                       assignment.type === 'project' ? 'プロジェクト' : 
                       assignment.type === 'presentation' ? 'プレゼンテーション' : 'クイズ'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      満点
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{assignment.maxScore}点</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      提出期限
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('ja-JP') : '期限なし'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      関連カリキュラム
                    </label>
                    <div className="space-y-1">
                      {relatedCurricula.map(curriculum => (
                        <p key={curriculum.id} className="text-sm text-gray-900 dark:text-white">
                          {curriculum.title}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  提出履歴
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">提出回数</span>
                    <span className="text-sm text-gray-900 dark:text-white">{submission.attemptNumber}回目</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">提出日時</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(submission.submittedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  {submission.reviewedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">レビュー日時</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(submission.reviewedAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* レビュー完了確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              レビューを完了しますか？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              レビューを完了すると、学生に結果が通知されます。内容を確認してから実行してください。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '処理中...' : 'レビュー完了'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}