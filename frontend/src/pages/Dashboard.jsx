// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth';

// Conditional dashboards (assumes these components exist)
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

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
        if (mounted && res?.user) {
          setUser(res.user);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          const message = error?.response?.data?.message || error?.message || 'Failed to load profile';
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
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="text-gray-700">Loading profile…</span>
        </div>
      </div>
    );
  }

  // If no user (not authenticated) redirect to login
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  // Header shared between teacher and student
  const Header = () => (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome{user?.name ? `, ${user.name}` : ''}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {user?.role ?? 'guest'}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 bg-white border rounded-md text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </header>
  );

  // Sidebar quick links (common)
  const Sidebar = () => (
    <aside className="w-80 hidden lg:block">
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Quick Links</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            <a className="hover:text-indigo-600" href="/courses">My Courses</a>
          </li>
          <li>
            <a className="hover:text-indigo-600" href="/progress">Progress</a>
          </li>
          <li>
            <a className="hover:text-indigo-600" href="/profile">Profile</a>
          </li>
          {user?.role === 'teacher' && (
            <li>
              <button
                onClick={() => navigate('/teacher')}
                className="text-sm text-white bg-indigo-600 px-3 py-1 rounded"
              >
                Teacher Panel
              </button>
            </li>
          )}
        </ul>
      </div>

      {err && (
        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded">{err}</div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <main className="space-y-6">
            {/* Conditionally render teacher or student dashboard components */}
            {user?.role === 'teacher' ? (
              <TeacherDashboard user={user} />
            ) : (
              <StudentDashboard user={user} />
            )}
          </main>

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
