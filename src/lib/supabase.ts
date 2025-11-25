import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rzudotbbfoklxcebghan.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dWRvdGJiZm9rbHhjZWJnaGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjc5NzUsImV4cCI6MjA3OTY0Mzk3NX0.wC-vKqfLfNf24_5L08NVS0ddN9MXRlsMtHToW1lge5w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ContactFormData = {
  name: string
  email: string
  country_code: string
  phone: string
  interests: string[]
  services: string[]
  modules: string[]
  message: string
  created_at?: string
}
