// components/EmailSignup.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { signupToWaitlist } from '../lib/supabase'

interface EmailSignupProps {
  variant?: 'default' | 'white'
}

export default function EmailSignup({ variant = 'default' }: EmailSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const isWhiteVariant = variant === 'white'

  // Fix hydration by ensuring component only renders animations after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset states
    setError(null)
    setIsSubmitting(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const { error: supabaseError } = await signupToWaitlist(email)
      
      if (supabaseError) {
        if (supabaseError.code === '23505') { // Unique constraint violation
          setError('This email is already on our waitlist!')
        } else {
          setError('Something went wrong. Please try again.')
        }
        console.error('Signup error:', supabaseError)
      } else {
        setIsSuccess(true)
        setEmail('')
        // Optional: Track conversion event
        if (isMounted && typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
          ((window as unknown as { gtag: Function }).gtag)('event', 'sign_up', {
            method: 'email',
            value: 1
          })
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    const SuccessContent = (
      <div className={`
        max-w-md mx-auto p-6 rounded-2xl text-center
        ${isWhiteVariant 
          ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
          : 'bg-white/20 backdrop-blur-sm border border-white/30'
        }
      `}>
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
          ${isWhiteVariant ? 'bg-white/30' : 'bg-white/30'}
        `}>
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">
          You&apos;re on the list! 🎉
        </h3>
        <p className="text-white/90">
          We&apos;ll notify you as soon as Ribit launches at your university.
        </p>
      </div>
    )

    return isMounted ? (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {SuccessContent}
      </motion.div>
    ) : SuccessContent
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`
                w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-white shadow-lg
                ${error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#7FB069] focus:ring-[#7FB069]'
                }
              `}
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            {...(isMounted ? {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 }
            } : {})}
            className={`
              px-6 py-3 rounded-lg font-semibold text-center transition-all
              flex items-center justify-center gap-2 min-w-[140px]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg
              ${isWhiteVariant
                ? 'bg-white text-[#7FB069] hover:bg-gray-100'
                : 'bg-white text-[#7FB069] hover:bg-gray-100'
              }
            `}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Get Early Access
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div 
            {...(isMounted ? {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 }
            } : {})}
            className="flex items-center gap-2 text-red-100 text-sm bg-red-500/20 backdrop-blur-sm rounded-lg p-3"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </form>

      <p className="text-xs mt-3 text-center text-white/80">
        Join thousands of students already signed up. No spam, ever.
      </p>
    </div>
  )
}