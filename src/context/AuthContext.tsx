import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithOtp: (email: string, fullName: string, password: string) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setFullName: (fullName: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  needsNameSetup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsNameSetup, setNeedsNameSetup] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Removed checkNameSetup as Dashboard handles it entirely now

  const signUpWithGoogle = async () => {
    // Store redirected URL to return to dashboard
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      },
    });

    if (error) {
      console.error('Google sign up error:', error);
      throw error;
    }
  };

  const loginWithGoogle = signUpWithGoogle; // Alias for clarity since OAuth handles both

  const setFullName = async (fullName: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    // Update user metadata with full name
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    });

    if (metadataError) {
      console.error('Metadata update error:', metadataError);
      throw metadataError;
    }

    // Reset user to refresh metadata
    const { data: { user: updatedUser } } = await supabase.auth.getUser();
    setUser(updatedUser);
  };

  const loginWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUpWithOtp = async (email: string, fullName: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    })

    if (error) {
      throw error;
    }
  }

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithPassword,
        signUpWithOtp,
        signUpWithGoogle,
        loginWithGoogle,
        setFullName,
        verifyOtp,
        resendOtp,
        logout,
        needsNameSetup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
