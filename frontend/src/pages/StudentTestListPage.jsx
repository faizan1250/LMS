import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  DocumentCheckIcon,
  PlayCircleIcon,
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { getCourseTests } from "../api/test";
import { getCourses } from "../api/course";

function StudentTestListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [testsByCourse, setTestsByCourse] = useState({});
  const [myAttempts, setMyAttempts] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load enrolled courses
      const coursesData = await getCourses({ enrolled: true });
      setCourses(coursesData.courses || []);

      // Load tests for each course
      const courseIds = coursesData.courses?.map(c => c._id).filter(Boolean) || [];
      const testResults = await Promise.allSettled(
        courseIds.map(cid => getCourseTests(cid, { publishedOnly: true }))
      );

      const nextTestsByCourse = {};
      courseIds.forEach((cid, idx) => {
        if (testResults[idx].status === 'fulfilled') {
          const result = testResults[idx].value;
          nextTestsByCourse[cid] = result?.tests || [];
        } else {
          nextTestsByCourse[cid] = [];
        }
      });

      setTestsByCourse(nextTestsByCourse);
    } catch (err) {
      setError(err.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const getTestStatus = (test) => {
    const attempt = myAttempts[test._id];
    if (attempt && attempt.submittedAt) {
      return {
        status: 'completed',
        score: attempt.percent,
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
    
    const now = new Date();
    const startAt = test.startAt ? new Date(test.startAt) : null;
    const dueAt = test.dueAt ? new Date(test.dueAt) : null;

    if (startAt && now < startAt) {
      return {
        status: 'upcoming',
        icon: CalendarIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }

    if (dueAt && now > dueAt) {
      return {
        status: 'expired',
        icon: XCircleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    return {
      status: 'available',
      icon: PlayCircleIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    };
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const allTests = [];
  courses.forEach(course => {
    const tests = testsByCourse[course._id] || [];
    tests.forEach(test => {
      allTests.push({
        ...test,
        courseTitle: course.title,
        courseId: course._id
      });
    });
  });

  // Sort tests by due date, then by start date
  allTests.sort((a, b) => {
    const aDate = a.dueAt || a.startAt || a.createdAt;
    const bDate = b.dueAt || b.startAt || b.createdAt;
    return new Date(aDate) - new Date(bDate);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                My Tests
              </h1>
              <p className="text-slate-600 mt-2">
                Take tests and track your progress
              </p>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tests List */}
        {allTests.length > 0 ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {allTests.map((test, index) => {
              const testStatus = getTestStatus(test);
              const StatusIcon = testStatus.icon;

              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 bg-white rounded-xl border-2 ${testStatus.borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => {
                    if (testStatus.status === 'available') {
                      navigate(`/tests/${test._id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${testStatus.bgColor}`}>
                          <StatusIcon className={`h-5 w-5 ${testStatus.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {test.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {test.courseTitle}
                          </p>
                        </div>
                      </div>

                      {test.description && (
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {test.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {formatDuration(test.durationMins)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DocumentCheckIcon className="h-4 w-4" />
                          {test.numQuestions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <TrophyIcon className="h-4 w-4" />
                          {test.difficulty}
                        </div>
                        {test.type && (
                          <div className="flex items-center gap-1">
                            <AcademicCapIcon className="h-4 w-4" />
                            {test.type}
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        {test.startAt && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <CalendarIcon className="h-4 w-4" />
                            Starts: {formatDate(test.startAt)}
                          </div>
                        )}
                        {test.dueAt && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <CalendarIcon className="h-4 w-4" />
                            Due: {formatDate(test.dueAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${testStatus.bgColor} ${testStatus.color}`}>
                        {testStatus.status === 'completed' && testStatus.score !== null && (
                          <span className="mr-1">Score: {testStatus.score}%</span>
                        )}
                        {testStatus.status === 'completed' && testStatus.score === null && 'Completed'}
                        {testStatus.status === 'available' && 'Available'}
                        {testStatus.status === 'upcoming' && 'Upcoming'}
                        {testStatus.status === 'expired' && 'Expired'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-16"
          >
            <AcademicCapIcon className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No tests available</h3>
            <p className="text-slate-500 mb-6">
              You don't have any tests assigned yet. Check back later or contact your instructor.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default StudentTestListPage;


