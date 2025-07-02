import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage('Un email de réinitialisation a été envoyé.');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Mot de passe oublié</h1>
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
          {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
        </button>
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
        {errorMsg && <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>}
      </form>
    </main>
  );
}
