import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TeacherPanel from './pages/TeacherPanel';
import Forbidden from './pages/Forbidden';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/403" element={<Forbidden />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher"
        element={
          <RequireRole allowed={['teacher']}>
            <TeacherPanel />
          </RequireRole>
        }
      />
    </Routes>
  );
}
export default App;
