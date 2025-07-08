'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Moon,
  Sun,
  FileText
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navigationItems = [
    { name: 'ダッシュボード', href: '/dashboard', icon: Home },
    { name: 'コース', href: '/courses', icon: BookOpen },
    { name: '課題', href: '/assignments', icon: FileText },
    ...(user?.role === 'admin' ? [
      { name: 'ユーザー管理', href: '/users', icon: Users },
      { name: 'レポート', href: '/reports', icon: BarChart3 },
    ] : []),
    { name: '設定', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigationItems={navigationItems} user={user} onLogout={handleLogout} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white dark:bg-gray-800 lg:border-r lg:border-gray-200 dark:lg:border-gray-600">
        <SidebarContent navigationItems={navigationItems} user={user} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white self-center">LMS Claude</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}

interface SidebarContentProps {
  navigationItems: Array<{ name: string; href: string; icon: any }>
  user: any
  onLogout: () => void
}

function SidebarContent({ navigationItems, user, onLogout }: SidebarContentProps) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-white">LMS Claude</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-800">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={onLogout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}