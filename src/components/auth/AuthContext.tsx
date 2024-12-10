import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';
import { Profile } from '../../config/supabase';

interface AuthContextType {
  user: (User & { role?: string }) | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      // Profile will be created automatically via database trigger
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    }
  };

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    signUp,
    signIn,
    signOut,
    error
  }), [user, loading, error]);

  useEffect(() => {
    // Ensure Supabase is initialized before setting up listeners
    if (!supabase) {
      console.error('Supabase client not initialized');
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      setUser({ ...authUser, role: profile?.role || 'user' });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser({ ...authUser, role: 'user' });
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
