import { createClient, Session, AuthChangeEvent, SupabaseClientOptions, SupabaseClient } from '@supabase/supabase-js';

// Use environment variables with fallback to local Supabase development settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Enhanced logging for authentication
function logAuthEvent(event: AuthChangeEvent, session: Session | null) {
  console.group('Supabase Auth Debug');
  console.log(`Event: ${event}`);
  if (session) console.log('Session:', session);
  console.groupEnd();
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

// Define Supabase client options explicitly
const supabaseOptions: SupabaseClientOptions<'public'> = {
  auth: {
    persistSession: true,
    debug: true
  }
};

// Supabase client initialization with error handling and logging
export const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, supabaseOptions);

// Attach additional logging to Supabase methods
supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  if (event === 'SIGNED_IN') {
    logAuthEvent('SIGNED_IN', session);
  } else if (event === 'SIGNED_OUT') {
    logAuthEvent('SIGNED_OUT', null);
  }
});

// Add a check to ensure Supabase is properly initialized
if (!supabase) {
  console.error('Failed to initialize Supabase client');
}
