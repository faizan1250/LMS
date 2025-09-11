import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>403</h1>
        <h2 style={styles.title}>Access denied</h2>
        <p style={styles.desc}>You do not have permission to view this page.</p>
        <div style={styles.actions}>
          <button onClick={() => navigate(-1)} style={styles.btn}>
            Go back
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.primary}>
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: 520,
    textAlign: 'center',
    padding: 30,
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    background: '#fff'
  },
  code: { fontSize: 48, margin: 0 },
  title: { margin: '8px 0' },
  desc: { color: '#6b7280' },
  actions: { marginTop: 18, display: 'flex', justifyContent: 'center', gap: 12 },
  btn: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer'
  },
  primary: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#111827',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default Forbidden;
