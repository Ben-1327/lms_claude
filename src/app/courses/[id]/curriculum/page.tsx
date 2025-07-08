'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockCurricula } from '@/lib/mockData'
import { ArrowLeft, Plus, Edit, Trash2, MoveUp, MoveDown, Save } from 'lucide-react'
import Link from 'next/link'

interface CurriculumManagePageProps {
  params: { id: string }
}

export default function CurriculumManagePage({ params }: CurriculumManagePageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [curricula, setCurricula] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    contentType: 'text' as 'text' | 'pdf' | 'slide',
    content: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'admin' && user?.role !== 'instructor') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    const courseCurricula = mockCurricula.filter(c => c.courseId === params.id)
    setCurricula(courseCurricula.sort((a, b) => a.orderIndex - b.orderIndex))
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'instructor')) {
    return null
  }

  const course = mockCourses.find(c => c.id === params.id)
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

  const handleEdit = (curriculum: any) => {
    setIsEditing(curriculum.id)
    setEditForm({
      title: curriculum.title,
      contentType: curriculum.contentType,
      content: curriculum.content
    })
  }

  const handleSave = async (curriculumId: string) => {
    setIsSaving(true)
    try {
      // TODO: API呼び出し
      console.log('Updating curriculum:', curriculumId, editForm)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // ローカル状態を更新
      setCurricula(prev => prev.map(c => 
        c.id === curriculumId 
          ? { ...c, ...editForm }
          : c
      ))
      
      setIsEditing(null)
    } catch (error) {
      console.error('Curriculum update failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (curriculumId: string) => {
    if (!confirm('このカリキュラムを削除してもよろしいですか？')) {
      return
    }

    try {
      // TODO: API呼び出し
      console.log('Deleting curriculum:', curriculumId)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // ローカル状態を更新
      setCurricula(prev => prev.filter(c => c.id !== curriculumId))
    } catch (error) {
      console.error('Curriculum deletion failed:', error)
    }
  }

  const handleMove = (curriculumId: string, direction: 'up' | 'down') => {
    const currentIndex = curricula.findIndex(c => c.id === curriculumId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === curricula.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newCurricula = [...curricula]
    const [moved] = newCurricula.splice(currentIndex, 1)
    newCurricula.splice(newIndex, 0, moved)

    // 順序を更新
    const updatedCurricula = newCurricula.map((c, index) => ({
      ...c,
      orderIndex: index + 1
    }))

    setCurricula(updatedCurricula)
    
    // TODO: API呼び出しで順序を保存
    console.log('Reordering curricula:', updatedCurricula.map(c => ({ id: c.id, orderIndex: c.orderIndex })))
  }

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      // TODO: API呼び出し
      const newCurriculum = {
        id: Date.now().toString(),
        courseId: params.id,
        title: editForm.title,
        contentType: editForm.contentType,
        content: editForm.content,
        orderIndex: curricula.length + 1
      }
      
      console.log('Creating curriculum:', newCurriculum)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // ローカル状態を更新
      setCurricula(prev => [...prev, newCurriculum])
      setIsCreating(false)
      setEditForm({ title: '', contentType: 'text', content: '' })
    } catch (error) {
      console.error('Curriculum creation failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href={`/courses/${params.id}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              コース詳細に戻る
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  カリキュラム編集: {course.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  カリキュラムの内容を編集・管理します
                </p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規カリキュラム
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* 新規作成フォーム */}
            {isCreating && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  新規カリキュラム作成
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="カリキュラムのタイトルを入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      コンテンツタイプ
                    </label>
                    <select
                      value={editForm.contentType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contentType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="text">テキスト/Markdown</option>
                      <option value="pdf">PDF</option>
                      <option value="slide">スライド</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      内容
                    </label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="カリキュラムの内容を入力（Markdown形式）"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={isSaving || !editForm.title}
                      className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? '作成中...' : '作成'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* カリキュラム一覧 */}
            {curricula.map((curriculum, index) => (
              <div key={curriculum.id} className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {index + 1}.
                      </span>
                      {isEditing === curriculum.id ? (
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {curriculum.title}
                        </h3>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {curriculum.contentType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMove(curriculum.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(curriculum.id, 'down')}
                        disabled={index === curricula.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      {isEditing === curriculum.id ? (
                        <button
                          onClick={() => handleSave(curriculum.id)}
                          disabled={isSaving}
                          className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(curriculum)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(curriculum.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {isEditing === curriculum.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          コンテンツタイプ
                        </label>
                        <select
                          value={editForm.contentType}
                          onChange={(e) => setEditForm(prev => ({ ...prev, contentType: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="text">テキスト/Markdown</option>
                          <option value="pdf">PDF</option>
                          <option value="slide">スライド</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          内容
                        </label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(null)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleSave(curriculum.id)}
                          disabled={isSaving}
                          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? '保存中...' : '保存'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                        {curriculum.content}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {curricula.length === 0 && (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  カリキュラムがありません
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  新しいカリキュラムを作成してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}