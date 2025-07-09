export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  profile?: UserProfile
}

export interface UserProfile {
  bio?: string
  avatar?: string
  phone?: string
  department?: string
  position?: string
  skills?: string[]
  preferences?: {
    language: string
    timezone: string
    emailNotifications: boolean
    darkMode: boolean
  }
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
  }
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
  contentType: 'text' | 'pdf' | 'slide' | 'video' | 'quiz' | 'assignment'
  content: string
  orderIndex: number
  children?: Curriculum[]
  assignments?: Assignment[]
  prerequisites?: string[]
  estimatedDuration?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  objectives?: string[]
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
  type: 'quiz' | 'essay' | 'project' | 'presentation'
  instructions?: string
  resources?: AssignmentResource[]
  rubric?: AssignmentRubric[]
  settings?: AssignmentSettings
}

export interface AssignmentResource {
  id: string
  name: string
  type: 'file' | 'link' | 'document'
  url: string
  description?: string
}

export interface AssignmentRubric {
  id: string
  criteria: string
  levels: RubricLevel[]
  weight: number
}

export interface RubricLevel {
  name: string
  description: string
  points: number
}

export interface AssignmentSettings {
  allowLateSubmission: boolean
  maxAttempts?: number
  timeLimit?: number
  randomizeQuestions?: boolean
  showResultsImmediately?: boolean
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  content: string
  status: 'draft' | 'submitted' | 'graded' | 'returned'
  score?: number
  feedback?: string
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  attemptNumber: number
  files?: SubmissionFile[]
  rubricScores?: RubricScore[]
}

export interface SubmissionFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export interface RubricScore {
  rubricId: string
  levelId: string
  score: number
  comment?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}