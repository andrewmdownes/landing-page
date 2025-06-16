// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Waitlist signup function
export async function signupToWaitlist(email: string) {
  const { data, error } = await supabase
    .from('waitlist_signup')
    .insert([{ email }])
    .select()

  return { data, error }
}