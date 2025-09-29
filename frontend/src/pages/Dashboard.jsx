// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth';

// Conditional dashboards
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg flex items-center gap-4 border border-white/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-slate-700 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  // If no user (not authenticated) redirect to login
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  // Premium Sidebar quick links (common)
  const Sidebar = () => (
    <aside className="space-y-6">
      {/* Quick Links Card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Quick Links
        </h3>
        <ul className="space-y-3">
          {[
            { label: 'My Courses', href: '/courses', icon: '📚' },
            { label: 'Progress Tracking', href: '/progress', icon: '📈' },
            { label: 'Profile Settings', href: '/profile', icon: '👤' },
            { label: 'Notifications', href: '/notifications', icon: '🔔' },
          ].map((link) => (
            <li key={link.label}>
              <a 
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
        
        {user?.role === 'teacher' && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate('/teacher')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Teacher Panel
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <p className="text-red-700 text-sm">{err}</p>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <h4 className="font-semibold mb-4">This Week</h4>
        <div className="space-y-3">
          {[
            { label: 'Active Courses', value: user?.role === 'teacher' ? '12' : '5' },
            { label: 'Assignments', value: user?.role === 'teacher' ? '7' : '3' },
            { label: 'Completed', value: user?.role === 'teacher' ? '24' : '8' },
          ].map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-blue-100 text-sm">{stat.label}</span>
              <span className="font-bold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {user?.role === 'teacher' ? 'Teacher Portal' : 'Learning Dashboard'}
              </h1>
              <div className="hidden md:block h-6 w-px bg-slate-300"></div>
              <p className="hidden md:block text-slate-600">
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {user?.role ?? 'guest'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Dashboard Content */}
          <div className="space-y-8">
            {user?.role === 'teacher' ? (
              <TeacherDashboard user={user} />
            ) : (
              <StudentDashboard user={user} />
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;