import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TeacherPanel from './pages/TeacherPanel';
import Forbidden from './pages/Forbidden';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import CourseInfo from './components/teacher/CourseInfo';
import CourseEditor from './components/teacher/CourseEditor'; // 👈 import editor
import CourseView from './components/teacher/CourseView';

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

      {/* ✅ Protected teacher route for course info */}
      <Route
        path="/course"
        element={
          <RequireRole allowed={['teacher']}>
            <CourseInfo />
          </RequireRole>
        }
      />

      {/* ✅ Protected teacher route for course editor */}
      <Route
        path="/courses/:courseId/edit"
        element={
          <RequireRole allowed={['teacher']}>
            <CourseEditor />
          </RequireRole>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <RequireRole allowed={['teacher']}>
            <CourseView />
          </RequireRole>
        }
      />
    </Routes>
  );
}
export default App;
