import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
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
    const session = supabase.auth.getSession();
    session.then(({ data }) => setUser(data.session?.user as User));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    await supabase.from('users').insert({ email, password: hashed });
    await signIn(email, password);
  };

  const signIn = async (email: string, password: string) => {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data && await bcrypt.compare(password, data.password)) {
      await supabase.auth.signInWithPassword({ email, password });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email);
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
