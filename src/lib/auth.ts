import { User } from '@/types'

// モックデータ
export const mockUsers: User[] = [
  {
    id: '1',
    name: '管理者',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '山田太郎',
    email: 'yamada@example.com',
    role: 'instructor',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: '佐藤花子',
    email: 'sato@example.com',
    role: 'student',
    status: 'active',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: '田中次郎',
    email: 'tanaka@example.com',
    role: 'student',
    status: 'active',
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    name: '鈴木三郎',
    email: 'suzuki@example.com',
    role: 'student',
    status: 'active',
    createdAt: new Date('2024-02-15')
  }
]

export const login = async (email: string, password: string): Promise<User | null> => {
  // モック認証（実際のプロジェクトでは適切な認証を実装）
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const user = mockUsers.find(u => u.email === email)
  if (user && password === 'password') {
    return user
  }
  return null
}

export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

export const setCurrentUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}