import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 flex justify-center items-center">
        <form onSubmit={submit} className="space-y-4 w-80">
          <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-navy text-white px-4 py-2 rounded w-full">Login</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
