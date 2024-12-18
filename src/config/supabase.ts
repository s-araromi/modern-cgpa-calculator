import { createClient, Session, AuthChangeEvent, SupabaseClientOptions, SupabaseClient } from '@supabase/supabase-js';

// Strict environment variable loading
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced error handling for environment variables
if (!supabaseUrl) {
  console.error('❌ Missing Supabase URL');
  throw new Error('VITE_SUPABASE_URL must be provided in .env file');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing Supabase Anon Key');
  throw new Error('VITE_SUPABASE_ANON_KEY must be provided in .env file');
}

// Enhanced logging for authentication
function logAuthEvent(event: AuthChangeEvent, session: Session | null) {
  console.group('🔐 Supabase Auth Debug');
  console.log(`Event: ${event}`);
  if (session) {
    console.log('Session Details:', {
      user: session.user?.email,
      expiresAt: session.expires_at
    });
  }
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

// Define Supabase client options with robust configuration
const supabaseOptions: SupabaseClientOptions<'public'> = {
  auth: {
    persistSession: true,
    debug: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'Modern CGPA Calculator',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

// Supabase client initialization with comprehensive error handling
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Global error handler (corrected method)
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔔 Auth State Changed:', event);
  
  switch (event) {
    case 'SIGNED_IN':
      console.log('✅ User signed in successfully');
      break;
    case 'SIGNED_OUT':
      console.log('🚪 User signed out');
      break;
    case 'TOKEN_REFRESHED':
      console.log('🔄 Authentication token refreshed');
      break;
    default:
      console.log(`📡 Unhandled auth event: ${event}`);
  }
});
