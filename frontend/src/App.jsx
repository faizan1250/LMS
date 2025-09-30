import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TeacherPanel from "./pages/TeacherPanel";
import Forbidden from "./pages/Forbidden";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import CourseInfo from "./components/teacher/CourseInfo";
import CourseEditor from "./components/teacher/CourseEditor"; // 👈 import editor
import CourseView from "./components/teacher/CourseView";
// import { useAuth } from "./context/AuthContext";
import StudentCoursesPage from "./pages/StudentCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import GradeAssignmentsPage from "./components/teacher/GradeAssignmentsPage";
import TestCreator from "./components/tests/TestCreator";
import TeacherTestsPage from "./components/tests/TeacherTestsPage";
import TestDetail from "./components/tests/TestDetail";
import StudentTestListPage from "./pages/StudentTestListPage";
import StudentTestAttemptPage from "./pages/StudentTestAttemptPage";
import StudentTestResultsPage from "./pages/StudentTestResultsPage";

function App() {
  // const { user } = useAuth(); // must return user with .role

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
          <RequireRole allowed={["teacher"]}>
            <TeacherPanel />
          </RequireRole>
        }
      />
      {/* ✅ Protected teacher route for course info */}
      <Route
        path="/courses"
        element={
          <RequireRole allowed={["teacher", "student"]}>
            {(u) =>
              u.role === "student" ? <StudentCoursesPage /> : <CourseInfo />
            }
          </RequireRole>
        }
      />
      {/* ✅ Protected teacher route for course editor */}
      <Route
        path="/courses/:courseId/edit"
        element={
          <RequireRole allowed={["teacher"]}>
            <CourseEditor />
          </RequireRole>
        }
      />
      <Route
        path="/assignments"
        element={
          <RequireRole allowed={["teacher", "admin"]}>
            <GradeAssignmentsPage />
          </RequireRole>
        }
      />
      {/* Student Test Routes */}
      <Route
        path="/student-tests"
        element={
          <RequireRole allowed={["student"]}>
            <StudentTestListPage />
          </RequireRole>
        }
      />
      <Route
        path="/student-tests/:testId"
        element={
          <RequireRole allowed={["student"]}>
            <StudentTestAttemptPage />
          </RequireRole>
        }
      />
      <Route
        path="/student-tests/:testId/results"
        element={
          <RequireRole allowed={["student"]}>
            <StudentTestResultsPage />
          </RequireRole>
        }
      />
      {/* Teacher Test Routes */}
      <Route
        path="/tests"
        element={
          <RequireRole allowed={["teacher", "admin"]}>
            <TeacherTestsPage />
          </RequireRole>
        }
      />
          <Route
        path="/tests/new"
        element={
          <RequireRole allowed={["teacher", "admin"]}>
            <TestCreator />
          </RequireRole>
        }
      />
          <Route
        path="/tests/:id"
        element={
          <RequireRole allowed={["teacher", "admin"]}>
            <TestDetail />
          </RequireRole>
        }
      />
      <Route
        path="/tests/:id/preview"
        element={
          <RequireRole allowed={["teacher", "admin"]}>
            <StudentTestAttemptPage />
          </RequireRole>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <RequireRole allowed={["teacher", "student"]}>
            {(u) =>
              u.role === "student" ? <CourseDetailPage /> : <CourseView />
            }
          </RequireRole>
        }
      />
    </Routes>
  );
}
export default App;
