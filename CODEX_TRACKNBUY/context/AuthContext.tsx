import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  phone?: string | null;
  status: string;
  valid_until: string | null;
}

interface AuthContextProps {
  user: User | null;
  supabase: SupabaseClient;
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('uid');
    if (id) {
      supabase.from('users').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setUser(data as User);
      });
    }
  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    const { data } = await supabase.from('users').insert({ email, password: hashed }).select().single();
    if (data) {
      localStorage.setItem('uid', data.id);
      setUser(data as User);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data && await bcrypt.compare(password, data.password)) {
      localStorage.setItem('uid', data.id);
      setUser(data as User);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('uid');
  };

  const forgotPassword = async (email: string) => {
    console.warn('forgotPassword not implemented', email);
  };

  return (
    <AuthContext.Provider value={{ user, supabase, signUp, signIn, signOut, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
