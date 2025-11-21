import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function createClient() {
  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  )
}

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// For backward compatibility
export const supabase = createClient()

// Types
export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface BodyMeasurement {
  id: string
  user_id: string
  date: string
  weight: number | null
  height: number | null
  chest: number | null
  waist: number | null
  hips: number | null
  arms: number | null
  thighs: number | null
  body_fat_percentage: number | null
  notes: string | null
  created_at: string
}

export interface ProgressPhoto {
  id: string
  user_id: string
  photo_url: string
  photo_type: 'front' | 'side' | 'back'
  date: string
  notes: string | null
  created_at: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  name: string
  description: string | null
  duration_weeks: number | null
  is_active: boolean
  created_at: string
}

export interface DietPlan {
  id: string
  user_id: string
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  is_active: boolean
  created_at: string
}