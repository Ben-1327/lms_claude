'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockUsers } from '@/lib/auth'
import { mockEnrollments, mockProgress } from '@/lib/mockData'
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
  CheckCircle
} from 'lucide-react'

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
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
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  戻る
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">ユーザー詳細</h1>
                  <p className="mt-1 text-sm text-gray-600">
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
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">プロフィール</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex-shrink-0 h-20 w-20">
                      <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">{targetUser.name}</h3>
                      <p className="text-sm text-gray-500">{targetUser.email}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(targetUser.role)}`}>
                          {getRoleDisplay(targetUser.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        名前
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{targetUser.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メールアドレス
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{targetUser.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{formData.phone || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        部署
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{formData.department || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        役職
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{formData.position || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ステータス
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'pending'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      自己紹介
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="自己紹介を入力してください"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{formData.bio || '-'}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      登録日
                    </label>
                    <p className="text-sm text-gray-900">{targetUser.createdAt.toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats and Activity */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">学習統計</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700">受講コース数</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userEnrollments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">完了済み</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-700">完了率</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">最近の活動</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">最後のログイン: 2時間前</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600">カリキュラム「React基礎」完了</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-600">新しいコース「JavaScript入門」に登録</span>
                    </div>
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