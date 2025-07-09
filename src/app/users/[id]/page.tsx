'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockUsers } from '@/lib/auth'
import { mockEnrollments, mockProgress, mockCurricula, mockCurriculumEnrollments, mockCourses } from '@/lib/mockData'
import { User } from '@/types'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  BookmarkPlus
} from 'lucide-react'

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCurriculumModal, setShowCurriculumModal] = useState(false)
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    bio: '',
    skills: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'pending'
  })

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

  useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === params.id)
    if (foundUser) {
      setTargetUser(foundUser)
      setFormData({
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.profile?.phone || '',
        department: foundUser.profile?.department || '',
        position: foundUser.profile?.position || '',
        bio: foundUser.profile?.bio || '',
        skills: foundUser.profile?.skills || [],
        status: foundUser.status
      })
    }
  }, [params.id])

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

  if (!targetUser) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">ユーザーが見つかりません</h2>
              <p className="mt-1 text-sm text-gray-500">
                指定されたユーザーは存在しません
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const userEnrollments = mockEnrollments.filter(e => e.userId === targetUser.id)
  const userProgress = mockProgress.filter(p => p.userId === targetUser.id)
  const completedCount = userProgress.filter(p => p.completed).length
  const totalCount = userProgress.length
  
  // カリキュラム割り当て関連
  const userCurriculumEnrollments = mockCurriculumEnrollments.filter(ce => ce.userId === targetUser.id)
  const assignedCurriculumIds = userCurriculumEnrollments.map(ce => ce.curriculumId)
  const availableCurricula = mockCurricula.filter(c => !assignedCurriculumIds.includes(c.id))

  const handleSave = () => {
    // Here you would typically save to an API
    console.log('Saving user data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.profile?.phone || '',
      department: targetUser.profile?.department || '',
      position: targetUser.profile?.position || '',
      bio: targetUser.profile?.bio || '',
      skills: targetUser.profile?.skills || [],
      status: targetUser.status
    })
    setIsEditing(false)
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return '管理者'
      case 'instructor': return '講師'
      case 'student': return '受講者'
      default: return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'instructor': return 'bg-blue-100 text-blue-800'
      case 'student': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAssignCurricula = async () => {
    if (selectedCurricula.length === 0) {
      alert('割り当てるカリキュラムを選択してください')
      return
    }

    console.log('Assigning curricula:', selectedCurricula, 'to user:', targetUser.id)
    // ここで実際のAPIコールを行う
    setShowCurriculumModal(false)
    setSelectedCurricula([])
  }

  const handleRemoveCurriculum = async (curriculumId: string) => {
    if (confirm('このカリキュラムの割り当てを解除しますか？')) {
      console.log('Removing curriculum:', curriculumId, 'from user:', targetUser.id)
      // ここで実際のAPIコールを行う
    }
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  戻る
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ユーザー詳細</h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    ユーザー情報と学習状況を管理します
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      キャンセル
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">プロフィール</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex-shrink-0 h-20 w-20">
                      <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-gray-600 dark:text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">{targetUser.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{targetUser.email}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(targetUser.role)}`}>
                          {getRoleDisplay(targetUser.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        名前
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{targetUser.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        メールアドレス
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{targetUser.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        電話番号
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{formData.phone || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        部署
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{formData.department || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        役職
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{formData.position || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ステータス
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'pending'})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="active">アクティブ</option>
                          <option value="inactive">非アクティブ</option>
                          <option value="pending">保留中</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          targetUser.status === 'active' ? 'bg-green-100 text-green-800' : 
                          targetUser.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {targetUser.status === 'active' ? 'アクティブ' : 
                           targetUser.status === 'inactive' ? '非アクティブ' : '保留中'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      自己紹介
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="自己紹介を入力してください"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">{formData.bio || '-'}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      登録日
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{targetUser.createdAt.toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
              </div>

              {/* Curriculum Assignments */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">カリキュラム割り当て</h2>
                    <button
                      onClick={() => setShowCurriculumModal(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      カリキュラム追加
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {userCurriculumEnrollments.length === 0 ? (
                    <div className="text-center py-8">
                      <BookmarkPlus className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">カリキュラムが割り当てられていません</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">このユーザーにカリキュラムを割り当ててください</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userCurriculumEnrollments.map((enrollment) => {
                        const curriculum = mockCurricula.find(c => c.id === enrollment.curriculumId)
                        if (!curriculum) return null
                        
                        return (
                          <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{curriculum.title}</h4>
                              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>進捗: {enrollment.progress}%</span>
                                <span>状態: {enrollment.status === 'active' ? 'アクティブ' : enrollment.status === 'completed' ? '完了' : '中断'}</span>
                                <span>開始日: {new Date(enrollment.startDate).toLocaleDateString('ja-JP')}</span>
                                {enrollment.endDate && (
                                  <span>完了日: {new Date(enrollment.endDate).toLocaleDateString('ja-JP')}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                              <button
                                onClick={() => handleRemoveCurriculum(curriculum.id)}
                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Activity */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">学習統計</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">受講コース数</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{userEnrollments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">完了済み</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">完了率</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近の活動</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">最後のログイン: 2時間前</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">カリキュラム「React基礎」完了</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">新しいコース「JavaScript入門」に登録</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Assignment Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              カリキュラムを割り当て
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {targetUser.name}さんに割り当てるカリキュラムを選択してください
            </p>
            
            {availableCurricula.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  割り当て可能なカリキュラムがありません
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {availableCurricula.map((curriculum) => (
                  <label key={curriculum.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCurricula.includes(curriculum.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCurricula(prev => [...prev, curriculum.id])
                        } else {
                          setSelectedCurricula(prev => prev.filter(id => id !== curriculum.id))
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{curriculum.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        コース: {mockCourses.find(c => c.id === curriculum.courseId)?.title || 'Unknown'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCurriculumModal(false)
                  setSelectedCurricula([])
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleAssignCurricula}
                disabled={selectedCurricula.length === 0}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                割り当て ({selectedCurricula.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}