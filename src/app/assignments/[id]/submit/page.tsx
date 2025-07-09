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
  Upload, 
  FileText, 
  Clock, 
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function SubmitAssignmentPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assignment, setAssignment] = useState<any>(null)
  const [submission, setSubmission] = useState<any>(null)
  const [formData, setFormData] = useState({
    content: '',
    files: [] as File[]
  })
  const [isDraft, setIsDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      router.push('/assignments')
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    const foundAssignment = mockAssignments.find(a => a.id === params.id)
    if (foundAssignment) {
      setAssignment(foundAssignment)
      
      // 既存の提出物を確認
      const existingSubmission = mockSubmissions.find(
        s => s.assignmentId === params.id && s.userId === user?.id
      )
      if (existingSubmission) {
        setSubmission(existingSubmission)
        setFormData({
          content: existingSubmission.content,
          files: []
        })
      }
    }
  }, [params.id, user?.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role === 'admin') {
    return null
  }

  if (!assignment) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">課題が見つかりません</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                指定された課題は存在しません
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      console.log('Saving draft:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsDraft(true)
      setTimeout(() => setIsDraft(false), 3000)
    } catch (error) {
      console.error('Draft save failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      alert('提出内容を入力してください')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Submitting assignment:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowConfirmDialog(false)
      router.push('/assignments')
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDaysUntilDue = () => {
    if (!assignment.dueDate) return null
    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue()
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const isSubmitted = submission && submission.status !== 'draft'

  const getRelatedCurricula = () => {
    return mockCurricula.filter(c => assignment.curriculumIds.includes(c.id))
  }

  const relatedCurricula = getRelatedCurricula()

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {assignment.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  課題を提出してください
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {assignment.dueDate && (
                  <div className={`flex items-center space-x-2 ${
                    isOverdue ? 'text-red-600' : daysUntilDue !== null && daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {isOverdue ? '期限切れ' : daysUntilDue !== null ? `あと${daysUntilDue}日` : '期限なし'}
                    </span>
                  </div>
                )}
                {isSubmitted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">提出済み</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 課題情報 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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

              {assignment.settings && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    提出設定
                  </h3>
                  <div className="space-y-2">
                    {assignment.settings.allowLateSubmission && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">遅延提出可能</span>
                      </div>
                    )}
                    {assignment.settings.maxAttempts && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          最大{assignment.settings.maxAttempts}回まで提出可能
                        </span>
                      </div>
                    )}
                    {assignment.settings.timeLimit && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          制限時間: {assignment.settings.timeLimit}分
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 提出フォーム */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    課題の説明
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none mb-6">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {assignment.description}
                  </div>
                </div>

                {assignment.instructions && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      詳細な指示
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
                      <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                        {assignment.instructions}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    提出内容
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        回答・レポート
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="回答やレポートの内容を入力してください..."
                        disabled={isSubmitted}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        添付ファイル
                      </label>
                      <div className="space-y-4">
                        {!isSubmitted && (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4">
                                <label className="cursor-pointer">
                                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    ファイルを選択またはドラッグ&ドロップ
                                  </span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    multiple
                                    onChange={handleFileUpload}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {formData.files.length > 0 && (
                          <div className="space-y-2">
                            {formData.files.map((file, index) => (
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
                                {!isSubmitted && (
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isSubmitted && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? '保存中...' : 'ドラフト保存'}
                      </button>
                      {isDraft && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">ドラフトを保存しました</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowConfirmDialog(true)}
                      disabled={isSubmitting || !formData.content.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      提出する
                    </button>
                  </div>
                )}

                {isSubmitted && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-800 dark:text-green-200">
                          {submission.submittedAt ? 
                            `${new Date(submission.submittedAt).toLocaleDateString('ja-JP')} に提出済み` : 
                            '提出済み'}
                        </span>
                      </div>
                      {submission.feedback && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            講師からのフィードバック
                          </h5>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提出確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              課題を提出しますか？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              一度提出すると内容を変更できません。本当に提出しますか？
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '提出中...' : '提出する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}