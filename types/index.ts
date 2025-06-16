// types/index.ts
export interface WaitlistSignup {
  id: number
  created_at: string
  email: string
}

export interface FormState {
  email: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}