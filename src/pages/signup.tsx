import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Vérifie ton email !</h2>
        <p>Un lien de confirmation vient de t’être envoyé.</p>
        <p>Tu seras redirigé vers la page de connexion sous peu…</p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Inscription</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: '#D4AF37',
            border: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'En cours…' : 'S’inscrire'}
        </button>

        {errorMsg && (
          <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>
        )}
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Déjà inscrit ? <a href="/login">Connecte-toi</a>
      </p>
    </main>
  );
}
