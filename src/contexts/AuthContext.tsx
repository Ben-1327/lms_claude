'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState } from '@/types'
import { getCurrentUser, setCurrentUser, logout as authLogout } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  const logout = async () => {
    await authLogout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}