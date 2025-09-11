import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth';

const Dashboard = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  // fetch fresh profile on mount
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await authApi.getMe();
        // res.user expected per backend
        if (mounted && res?.user) {
          setUser(res.user); // update context so whole app sees latest
        }
      } catch (error) {
        // If getting profile fails, clear context user to reflect auth state
        if (mounted) {
          setUser(null);
          const message =
            error?.response?.data?.message || error?.message || 'Failed to load profile';
          setErr(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      // If logout errors for whatever reason, still send user to login
      navigate('/login', { replace: true });
    }
  };

  // simple loading UI
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.roleBadge}>{user?.role ?? 'guest'}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Welcome{user?.name ? `, ${user.name}` : ''}!</h2>

          {err && <div style={styles.error}>{err}</div>}

          <p>
            Email: <strong>{user?.email ?? '—'}</strong>
          </p>
          <p>
            Role: <strong>{user?.role ?? '—'}</strong>
          </p>

          {user?.role === 'teacher' && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => navigate('/teacher')}
                style={styles.primaryBtn}
              >
                Go to Teacher Panel
              </button>
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h3 style={styles.h3}>Quick Links</h3>
          <ul>
            <li>
              <a href="/courses">My Courses</a>
            </li>
            <li>
              <a href="/dashboard">Progress</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    padding: 24
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    margin: 0
  },
  headerRight: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  roleBadge: {
    padding: '6px 10px',
    borderRadius: 6,
    background: '#eef2ff',
    color: '#3730a3',
    fontSize: 13
  },
  logoutBtn: {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer'
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 16
  },
  card: {
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
    background: '#fff'
  },
  h2: { marginTop: 0 },
  h3: { marginTop: 0 },
  primaryBtn: {
    padding: '10px 12px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  error: {
    padding: 8,
    borderRadius: 6,
    background: '#fee2e2',
    color: '#7f1d1d',
    marginBottom: 12
  }
};

export default Dashboard;
