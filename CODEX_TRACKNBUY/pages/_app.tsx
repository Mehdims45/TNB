import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
