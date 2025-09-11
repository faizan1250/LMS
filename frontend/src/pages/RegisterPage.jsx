import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [err, setErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Registration failed';
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        {err && <div style={styles.error}>{err}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              autoComplete="name"
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              autoComplete="email"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              autoComplete="new-password"
            />
          </label>

          <label style={styles.label}>
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: 360,
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    background: '#fff'
  },
  title: {
    margin: 0,
    marginBottom: 12,
    fontSize: 20
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13
  },
  input: {
    marginTop: 6,
    padding: '8px 10px',
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ddd'
  },
  button: {
    marginTop: 4,
    padding: '10px 12px',
    fontSize: 15,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    background: '#111827',
    color: '#fff'
  },
  error: {
    padding: 8,
    borderRadius: 6,
    background: '#fee2e2',
    color: '#7f1d1d'
  }
};

export default RegisterPage;
