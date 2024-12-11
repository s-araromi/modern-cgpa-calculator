import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to local Supabase development settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Types for our application
export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface CGPARecord {
  id?: number;
  user_id: string;
  semester: number;
  gpa: number;
  total_credits: number;
  created_at?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
}

// Supabase client initialization with error handling
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true
  }
});

// Add a check to ensure Supabase is properly initialized
if (!supabase) {
  console.error('Failed to initialize Supabase client');
}
