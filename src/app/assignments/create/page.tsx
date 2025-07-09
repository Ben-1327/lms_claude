'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockCurricula } from '@/lib/mockData'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  FileText, 
  Clock, 
  Clipboard, 
  Link as LinkIcon,
  Upload
} from 'lucide-react'
import Link from 'next/link'

export default function CreateAssignmentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    type: 'essay' as 'quiz' | 'essay' | 'project' | 'presentation',
    curriculumId: '',
    dueDate: '',
    maxScore: 100,
    allowLateSubmission: false,
    maxAttempts: 1,
    timeLimit: 0,
    showResultsImmediately: false,
    rubric: [] as any[],
    resources: [] as any[]
  })
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

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

  const templates = [
    {
      id: 'essay',
      name: 'エッセイ課題',
      description: '文章作成の課題テンプレート',
      data: {
        title: 'エッセイ課題',
        description: '指定されたテーマについて、あなたの考えを論理的に述べてください。',
        instructions: '以下の点を考慮して執筆してください：\n- 論理的な構成\n- 具体的な例の提示\n- 結論の明確化\n\n文字数: 1000文字以上',
        type: 'essay',
        maxScore: 100,
        timeLimit: 0,
        allowLateSubmission: false,
        rubric: [
          { criteria: '論理的構成', weight: 30 },
          { criteria: '内容の充実度', weight: 40 },
          { criteria: '表現力', weight: 30 }
        ]
      }
    },
    {
      id: 'project',
      name: 'プロジェクト課題',
      description: '実践的なプロジェクト課題テンプレート',
      data: {
        title: 'プロジェクト課題',
        description: '学習内容を活用して、実践的なプロジェクトを作成してください。',
        instructions: 'プロジェクトの要件：\n- 仕様書の作成\n- 実装またはプロトタイプの作成\n- 成果物の発表資料\n\n提出形式: ZIPファイル',
        type: 'project',
        maxScore: 100,
        timeLimit: 0,
        allowLateSubmission: true,
        rubric: [
          { criteria: '企画力', weight: 20 },
          { criteria: '実装品質', weight: 50 },
          { criteria: '発表力', weight: 30 }
        ]
      }
    },
    {
      id: 'presentation',
      name: 'プレゼンテーション課題',
      description: '発表形式の課題テンプレート',
      data: {
        title: 'プレゼンテーション課題',
        description: '学習内容について、効果的なプレゼンテーションを行ってください。',
        instructions: 'プレゼンテーションの要件：\n- 時間: 10分以内\n- スライド: 10枚以内\n- 質疑応答: 5分\n\n提出形式: PowerPointまたはPDF',
        type: 'presentation',
        maxScore: 100,
        timeLimit: 15,
        allowLateSubmission: false,
        rubric: [
          { criteria: '内容の理解度', weight: 40 },
          { criteria: 'スライドの完成度', weight: 30 },
          { criteria: '発表技術', weight: 30 }
        ]
      }
    }
  ]

  const handleTemplateSelect = (template: any) => {
    setFormData(prev => ({
      ...prev,
      ...template.data
    }))
    setSelectedTemplate(template.id)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('Creating assignment:', formData)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/assignments')
    } catch (error) {
      console.error('Assignment creation failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const addRubricCriteria = () => {
    setFormData(prev => ({
      ...prev,
      rubric: [...prev.rubric, { criteria: '', weight: 0 }]
    }))
  }

  const removeRubricCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rubric: prev.rubric.filter((_, i) => i !== index)
    }))
  }

  const updateRubricCriteria = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rubric: prev.rubric.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { name: '', type: 'link', url: '', description: '' }]
    }))
  }

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const updateResource = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Clock className="h-4 w-4" />
      case 'essay': return <FileText className="h-4 w-4" />
      case 'project': return <Clipboard className="h-4 w-4" />
      case 'presentation': return <Upload className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'クイズ'
      case 'essay': return 'エッセイ'
      case 'project': return 'プロジェクト'
      case 'presentation': return 'プレゼンテーション'
      default: return type
    }
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/assignments"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              課題一覧に戻る
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  新規課題作成
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  課題の詳細を設定して作成します
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? '作成中...' : '作成'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* テンプレート選択 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  テンプレート
                </h3>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(template.data.type)}
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* メインフォーム */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    基本情報
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        課題タイトル
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="課題のタイトルを入力"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          課題タイプ
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="essay">エッセイ</option>
                          <option value="project">プロジェクト</option>
                          <option value="presentation">プレゼンテーション</option>
                          <option value="quiz">クイズ</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          関連カリキュラム
                        </label>
                        <select
                          value={formData.curriculumId}
                          onChange={(e) => setFormData(prev => ({ ...prev, curriculumId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">選択してください</option>
                          {mockCurricula.map(curriculum => (
                            <option key={curriculum.id} value={curriculum.id}>
                              {curriculum.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        課題の説明
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="課題の概要を入力してください"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        詳細な指示
                      </label>
                      <textarea
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="詳細な指示や要件を入力してください"
                      />
                    </div>
                  </div>
                </div>

                {/* 設定 */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    課題設定
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          満点
                        </label>
                        <input
                          type="number"
                          value={formData.maxScore}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          提出期限
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          制限時間（分）
                        </label>
                        <input
                          type="number"
                          value={formData.timeLimit}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="0 = 無制限"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.allowLateSubmission}
                          onChange={(e) => setFormData(prev => ({ ...prev, allowLateSubmission: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          遅延提出を許可
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.showResultsImmediately}
                          onChange={(e) => setFormData(prev => ({ ...prev, showResultsImmediately: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          結果を即座に表示
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 評価基準 */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      評価基準（ルーブリック）
                    </h3>
                    <button
                      onClick={addRubricCriteria}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      追加
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.rubric.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.criteria}
                            onChange={(e) => updateRubricCriteria(index, 'criteria', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="評価項目"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateRubricCriteria(index, 'weight', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="配点"
                          />
                        </div>
                        <button
                          onClick={() => removeRubricCriteria(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 参考資料 */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      参考資料
                    </h3>
                    <button
                      onClick={addResource}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      追加
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <select
                            value={resource.type}
                            onChange={(e) => updateResource(index, 'type', e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="link">リンク</option>
                            <option value="file">ファイル</option>
                            <option value="document">ドキュメント</option>
                          </select>
                          <button
                            onClick={() => removeResource(index)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={resource.name}
                            onChange={(e) => updateResource(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="資料名"
                          />
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => updateResource(index, 'url', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="URL"
                          />
                        </div>
                        
                        <textarea
                          value={resource.description}
                          onChange={(e) => updateResource(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="説明"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}