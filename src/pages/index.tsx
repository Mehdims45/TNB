import React from 'react';

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Bienvenue sur TracknBuy
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
        Surveillez. Alertez. Achetez.
      </p>
      <a
        href="/signup"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#D4AF37',
          color: '#1E2A47',
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}
      >
        Commencer
      </a>
    </main>
  );
}
