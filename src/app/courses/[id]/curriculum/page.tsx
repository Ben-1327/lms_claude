'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockCurricula } from '@/lib/mockData'
import { ArrowLeft, Plus, Edit, Trash2, Save, GripVertical, Eye, Copy, FileText, Film, Presentation } from 'lucide-react'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

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
    contentType: 'text' as 'text' | 'pdf' | 'slide' | 'video' | 'quiz' | 'assignment',
    content: '',
    estimatedDuration: 0,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    objectives: [] as string[]
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
    const courseCurriculum = mockCurricula.find(c => c.courseId === params.id)
    if (courseCurriculum) {
      setCurricula(courseCurriculum.chapters.sort((a, b) => a.orderIndex - b.orderIndex))
    } else {
      setCurricula([])
    }
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

  const handleEdit = (chapter: any) => {
    setIsEditing(chapter.id)
    setEditForm({
      title: chapter.title,
      contentType: chapter.contentType,
      content: chapter.content,
      estimatedDuration: chapter.estimatedDuration || 0,
      difficulty: chapter.difficulty || 'beginner',
      objectives: chapter.objectives || []
    })
  }

  const handleSave = async (curriculumId: string) => {
    setIsSaving(true)
    try {
      console.log('Updating curriculum:', curriculumId, editForm)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
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
      console.log('Deleting curriculum:', curriculumId)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCurricula(prev => prev.filter(c => c.id !== curriculumId))
    } catch (error) {
      console.error('Curriculum deletion failed:', error)
    }
  }

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    if (startIndex === endIndex) return

    const newCurricula = [...curricula]
    const [moved] = newCurricula.splice(startIndex, 1)
    newCurricula.splice(endIndex, 0, moved)

    const updatedCurricula = newCurricula.map((c, index) => ({
      ...c,
      orderIndex: index + 1
    }))

    setCurricula(updatedCurricula)
    
    console.log('Reordering curricula by drag:', updatedCurricula.map(c => ({ id: c.id, orderIndex: c.orderIndex })))
  }

  const handleDuplicate = (chapter: any) => {
    const newChapter = {
      ...chapter,
      id: Date.now().toString(),
      title: `${chapter.title} (コピー)`,
      orderIndex: curricula.length + 1
    }
    setCurricula(prev => [...prev, newChapter])
    console.log('Duplicating chapter:', newChapter)
  }

  const handlePreview = (chapter: any) => {
    console.log('Previewing chapter:', chapter)
  }

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      const newCurriculum = {
        id: Date.now().toString(),
        courseId: params.id,
        title: editForm.title,
        contentType: editForm.contentType,
        content: editForm.content,
        estimatedDuration: editForm.estimatedDuration,
        difficulty: editForm.difficulty,
        objectives: editForm.objectives,
        orderIndex: curricula.length + 1
      }
      
      console.log('Creating curriculum:', newCurriculum)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCurricula(prev => [...prev, newCurriculum])
      setIsCreating(false)
      setEditForm({ 
        title: '', 
        contentType: 'text', 
        content: '', 
        estimatedDuration: 0, 
        difficulty: 'beginner', 
        objectives: [] 
      })
    } catch (error) {
      console.error('Curriculum creation failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'text': return <FileText className="h-4 w-4" />
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'slide': return <Presentation className="h-4 w-4" />
      case 'video': return <Film className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case 'text': return 'テキスト'
      case 'pdf': return 'PDF'
      case 'slide': return 'スライド'
      case 'video': return 'ビデオ'
      case 'quiz': return 'クイズ'
      case 'assignment': return '課題'
      default: return contentType
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
                  ドラッグ&ドロップでカリキュラムの順序を変更できます
                </p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規章を追加
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
                  <div className="grid grid-cols-2 gap-4">
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
                        <option value="video">ビデオ</option>
                        <option value="quiz">クイズ</option>
                        <option value="assignment">課題</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        難易度
                      </label>
                      <select
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="beginner">初級</option>
                        <option value="intermediate">中級</option>
                        <option value="advanced">上級</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      推定所要時間（分）
                    </label>
                    <input
                      type="number"
                      value={editForm.estimatedDuration}
                      onChange={(e) => setEditForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="30"
                    />
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
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="curricula">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {curricula.map((chapter, index) => (
                      <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white dark:bg-gray-800 shadow rounded-lg transition-transform ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            }`}
                          >
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {index + 1}.
                                  </span>
                                  {isEditing === chapter.id ? (
                                    <input
                                      type="text"
                                      value={editForm.title}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                  ) : (
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {chapter.title}
                                    </h3>
                                  )}
                                  <div className="flex space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                      <span className="mr-1">{getContentTypeIcon(chapter.contentType)}</span>
                                      {getContentTypeLabel(chapter.contentType)}
                                    </span>
                                    {chapter.difficulty && (
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                                        {chapter.difficulty === 'beginner' ? '初級' : 
                                         chapter.difficulty === 'intermediate' ? '中級' : '上級'}
                                      </span>
                                    )}
                                    {chapter.estimatedDuration && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {chapter.estimatedDuration}分
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handlePreview(chapter)}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    title="プレビュー"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(chapter)}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    title="複製"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                  {isEditing === chapter.id ? (
                                    <button
                                      onClick={() => handleSave(chapter.id)}
                                      disabled={isSaving}
                                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="保存"
                                    >
                                      <Save className="h-4 w-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleEdit(chapter)}
                                      className="p-1 text-blue-600 hover:text-blue-700"
                                      title="編集"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(chapter.id)}
                                    className="p-1 text-red-600 hover:text-red-700"
                                    title="削除"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="px-6 py-4">
                              {isEditing === chapter.id ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
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
                                        <option value="video">ビデオ</option>
                                        <option value="quiz">クイズ</option>
                                        <option value="assignment">課題</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        難易度
                                      </label>
                                      <select
                                        value={editForm.difficulty}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      >
                                        <option value="beginner">初級</option>
                                        <option value="intermediate">中級</option>
                                        <option value="advanced">上級</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      推定所要時間（分）
                                    </label>
                                    <input
                                      type="number"
                                      value={editForm.estimatedDuration}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
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
                                      onClick={() => handleSave(chapter.id)}
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
                                    {chapter.content}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

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