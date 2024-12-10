import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to local Supabase development settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wznucutrzwxjeqqnwirj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnVjdXRyend4amVxcW53aXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MzM3MTgsImV4cCI6MjA0OTQwOTcxOH0.c6vhyQjyZ2p-0oFCpi-kA66FTeUzZywtynDxno1TZu0';

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
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  }
});

// Add a check to ensure Supabase is properly initialized
if (!supabase) {
  console.error('Failed to initialize Supabase client');
}
