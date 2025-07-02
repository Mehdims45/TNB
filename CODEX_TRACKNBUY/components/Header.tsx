import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="bg-navy text-white p-4 flex justify-between items-center">
      <Link href="/">
        <span className="font-bold text-lg">TracknBuy</span>
      </Link>
      <nav className="space-x-4">
        {user && <Link href="/dashboard">Dashboard</Link>}
        {user ? (
          <button onClick={signOut}>Logout</button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
