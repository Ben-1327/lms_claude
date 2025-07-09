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

  static markAsCompleted(userId: string, chapterId: string): void {
    const currentProgress = this.getProgress(userId)
    const existingIndex = currentProgress.findIndex(p => p.chapterId === chapterId)
    
    if (existingIndex >= 0) {
      currentProgress[existingIndex] = {
        ...currentProgress[existingIndex],
        completed: true,
        completedAt: new Date()
      }
    } else {
      currentProgress.push({
        userId,
        chapterId,
        completed: true,
        completedAt: new Date()
      })
    }
    
    this.setProgress(userId, currentProgress)
  }

  static markAsIncomplete(userId: string, chapterId: string): void {
    const currentProgress = this.getProgress(userId)
    const existingIndex = currentProgress.findIndex(p => p.chapterId === chapterId)
    
    if (existingIndex >= 0) {
      currentProgress[existingIndex] = {
        ...currentProgress[existingIndex],
        completed: false,
        completedAt: undefined
      }
    } else {
      currentProgress.push({
        userId,
        chapterId,
        completed: false
      })
    }
    
    this.setProgress(userId, currentProgress)
  }

  static getChapterProgress(userId: string, chapterId: string): Progress | undefined {
    const progress = this.getProgress(userId)
    return progress.find(p => p.chapterId === chapterId)
  }

  static calculateCourseProgress(userId: string, chapterIds: string[]): number {
    if (chapterIds.length === 0) return 0
    
    const progress = this.getProgress(userId)
    const completedCount = chapterIds.filter(id => {
      const chapterProgress = progress.find(p => p.chapterId === id)
      return chapterProgress?.completed || false
    }).length
    
    return Math.round((completedCount / chapterIds.length) * 100)
  }
}