import { createContext, useContext, useEffect, useState } from 'react';

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

  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);

  };

  const signIn = async (email: string, password: string) => {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data && await bcrypt.compare(password, data.password)) {

    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = async () => {

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
