import { Progress } from '@/types'

// 既読マーク管理のためのユーティリティ関数
export class ProgressManager {
  private static getStorageKey(userId: string): string {
    return `progress_${userId}`
  }

  static getProgress(userId: string): Progress[] {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey(userId))
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.map((p: any) => ({
          ...p,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined
        }))
      } catch (error) {
        console.error('Progress parsing error:', error)
        return []
      }
    }
    return []
  }

  static setProgress(userId: string, progress: Progress[]): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(progress))
  }

  static markAsCompleted(userId: string, curriculumId: string): void {
    const currentProgress = this.getProgress(userId)
    const existingIndex = currentProgress.findIndex(p => p.curriculumId === curriculumId)
    
    if (existingIndex >= 0) {
      currentProgress[existingIndex] = {
        ...currentProgress[existingIndex],
        completed: true,
        completedAt: new Date()
      }
    } else {
      currentProgress.push({
        userId,
        curriculumId,
        completed: true,
        completedAt: new Date()
      })
    }
    
    this.setProgress(userId, currentProgress)
  }

  static markAsIncomplete(userId: string, curriculumId: string): void {
    const currentProgress = this.getProgress(userId)
    const existingIndex = currentProgress.findIndex(p => p.curriculumId === curriculumId)
    
    if (existingIndex >= 0) {
      currentProgress[existingIndex] = {
        ...currentProgress[existingIndex],
        completed: false,
        completedAt: undefined
      }
    } else {
      currentProgress.push({
        userId,
        curriculumId,
        completed: false
      })
    }
    
    this.setProgress(userId, currentProgress)
  }

  static getCurriculumProgress(userId: string, curriculumId: string): Progress | undefined {
    const progress = this.getProgress(userId)
    return progress.find(p => p.curriculumId === curriculumId)
  }

  static calculateCourseProgress(userId: string, curriculumIds: string[]): number {
    if (curriculumIds.length === 0) return 0
    
    const progress = this.getProgress(userId)
    const completedCount = curriculumIds.filter(id => {
      const curricProgress = progress.find(p => p.curriculumId === id)
      return curricProgress?.completed || false
    }).length
    
    return Math.round((completedCount / curriculumIds.length) * 100)
  }
}