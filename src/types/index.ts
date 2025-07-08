export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  tags: string[]
  createdBy: string
  createdAt: Date
  published: boolean
  enrollmentCount: number
}

export interface Curriculum {
  id: string
  courseId: string
  parentId?: string
  title: string
  contentType: 'text' | 'pdf' | 'slide'
  content: string
  orderIndex: number
  children?: Curriculum[]
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: 'active' | 'completed' | 'dropped'
  startDate: Date
  endDate?: Date
  progress: number
}

export interface Progress {
  userId: string
  curriculumId: string
  completed: boolean
  completedAt?: Date
}

export interface Assignment {
  id: string
  curriculumId: string
  title: string
  description: string
  dueDate?: Date
  maxScore: number
  createdAt: Date
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  content: string
  status: 'submitted' | 'graded' | 'returned'
  score?: number
  feedback?: string
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}