'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { mockCourses, mockEnrollments } from '@/lib/mockData'
import { mockUsers } from '@/lib/auth'
import { ArrowLeft, Plus, UserPlus, UserMinus, Upload, Search } from 'lucide-react'
import Link from 'next/link'

interface EnrollmentManagePageProps {
  params: { id: string }
}

export default function EnrollmentManagePage({ params }: EnrollmentManagePageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    // 現在のコースの受講者を取得
    const courseEnrollments = mockEnrollments.filter(e => e.courseId === params.id)
    setEnrollments(courseEnrollments)

    // 未受講のユーザーを取得
    const enrolledUserIds = courseEnrollments.map(e => e.userId)
    const available = mockUsers.filter(u => 
      u.role === 'student' && !enrolledUserIds.includes(u.id)
    )
    setAvailableUsers(available)
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
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleEnrollUsers = async () => {
    if (selectedUsers.length === 0) return

    setIsSubmitting(true)
    try {
      // TODO: API呼び出し
      const newEnrollments = selectedUsers.map(userId => ({
        id: Date.now().toString() + userId,
        userId,
        courseId: params.id,
        status: 'active',
        startDate: new Date(),
        progress: 0
      }))

      console.log('Enrolling users:', newEnrollments)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // ローカル状態を更新
      setEnrollments(prev => [...prev, ...newEnrollments])
      setAvailableUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)))
      setSelectedUsers([])
      setShowAddForm(false)
    } catch (error) {
      console.error('Enrollment failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnenrollUser = async (enrollmentId: string) => {
    if (!confirm('この受講者を登録解除してもよろしいですか？')) {
      return
    }

    try {
      // TODO: API呼び出し
      console.log('Unenrolling user:', enrollmentId)
      
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // ローカル状態を更新
      const removedEnrollment = enrollments.find(e => e.id === enrollmentId)
      if (removedEnrollment) {
        const user = mockUsers.find(u => u.id === removedEnrollment.userId)
        if (user && user.role === 'student') {
          setAvailableUsers(prev => [...prev, user])
        }
      }
      
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId))
    } catch (error) {
      console.error('Unenrollment failed:', error)
    }
  }

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUser = (userId: string) => mockUsers.find(u => u.id === userId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'dropped':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '受講中'
      case 'completed':
        return '完了'
      case 'dropped':
        return '中断'
      default:
        return status
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
                  受講者管理: {course.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  コースの受講者を管理します
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  受講者を追加
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  CSV一括登録
                </button>
              </div>
            </div>
          </div>

          {/* 受講者追加フォーム */}
          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                受講者を追加
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ユーザー検索
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="名前またはメールアドレスで検索..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <label key={user.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(prev => [...prev, user.id])
                            } else {
                              setSelectedUsers(prev => prev.filter(id => id !== user.id))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setSelectedUsers([])
                      setSearchTerm('')
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleEnrollUsers}
                    disabled={selectedUsers.length === 0 || isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '追加中...' : `${selectedUsers.length}名を追加`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 受講者一覧 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                受講者一覧 ({enrollments.length}名)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      受講者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      進捗率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      開始日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {enrollments.map((enrollment) => {
                    const enrolledUser = getUser(enrollment.userId)
                    return (
                      <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {enrolledUser?.name?.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {enrolledUser?.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {enrolledUser?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                            {getStatusText(enrollment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-grow mr-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {enrollment.startDate.toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUnenrollUser(enrollment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                受講者がいません
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                受講者を追加してください
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}