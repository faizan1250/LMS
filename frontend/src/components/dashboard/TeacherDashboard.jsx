import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  PlusIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  SparklesIcon,
  LightBulbIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  CogIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  // Add missing icon for assessments
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import courseApi from "../../api/course";

const cardStyle = "bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200";

// Modern Stat Card Component
const ModernStatCard = ({ icon, label, value, color = "primary", trend, loading, onClick, subtitle }) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${cardStyle} rounded-xl p-6 cursor-pointer group ${
      onClick ? 'hover:border-slate-300' : ''
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
        {loading ? (
          <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>
        )}
        {subtitle && !loading && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
        {trend !== undefined && !loading && (
          <div className={`flex items-center mt-2 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-slate-500'
          }`}
          >
            <ArrowTrendingUpIcon className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
            <span className="text-slate-400 text-xs ml-1">this month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${
        color === 'primary' ? 'bg-blue-50 text-blue-600' :
        color === 'accent' ? 'bg-purple-50 text-purple-600' :
        color === 'success' ? 'bg-green-50 text-green-600' :
        'bg-orange-50 text-orange-600'
      }`}
      >
        {icon && typeof icon === 'function' && icon({ className: "h-5 w-5" })}
      </div>
    </div>
  </motion.div>
);

// Modern Quick Action Component
const ModernQuickAction = ({ icon, label, description, color = "primary", onClick, featured }) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-4 rounded-lg text-left group transition-all duration-200 ${
      featured 
        ? 'bg-blue-50 border border-blue-200 hover:border-blue-300' 
        : `${cardStyle} hover:border-slate-300`
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        featured
          ? 'bg-blue-500 text-white'
          : `${
              color === 'primary' ? 'bg-blue-50 text-blue-600' :
              color === 'accent' ? 'bg-purple-50 text-purple-600' :
              color === 'success' ? 'bg-green-50 text-green-600' :
              'bg-orange-50 text-orange-600'
            }`
      }`}>
        {icon && typeof icon === 'function' && icon({ className: "h-5 w-5" })}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 mb-1">
          {label}
        </h3>
        <p className="text-sm text-slate-600">
          {description}
        </p>
      </div>
      {featured && (
        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
          Popular
        </span>
      )}
    </div>
  </motion.button>
);

// Modern Activity Item Component
const ModernActivityItem = ({ activity, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group cursor-pointer"
    onClick={onClick}
  >
    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-medium text-sm">
      {activity.courseTitle?.[0]?.toUpperCase() || "C"}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-900 truncate">
        {activity.courseTitle}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-slate-500">
          {activity.progressPercent}% Complete
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-400">
          {activity.time ? activity.time.toLocaleDateString() : "Recently"}
        </span>
      </div>
    </div>
  </motion.div>
);

// Modern Loading Skeleton
const ModernSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
          <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default function TeacherDashboard({ user }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [perCourseEnroll, setPerCourseEnroll] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get my courses
        const resp = await courseApi.getCourses({ mine: true });
        const myCourses = resp?.courses || resp?.rows || (Array.isArray(resp) ? resp : []);
        if (!mounted) {
          return;
        }
        setCourses(myCourses);

        if (!myCourses.length) {
          setPerCourseEnroll([]);
          return;
        }

        // 2) For each course, fetch enrolled students + progress
        const rows = await Promise.all(
          myCourses.map(async (c) => {
            try {
              const r = await courseApi.listEnrolledStudents(c._id);
              const students = r?.students || r?.rows || (Array.isArray(r) ? r : []);
              const count = Array.isArray(students) ? students.length : 0;
              const sumPct = students.reduce(
                (s, st) => s + (Number(st?.progressPercent) || 0),
                0
              );
              return { courseId: c._id, count, sumPct, students, title: c.title, status: c.status };
            } catch {
              return { courseId: c._id, count: 0, sumPct: 0, students: [], title: c.title, status: c.status };
            }
          })
        );

        if (!mounted) {
          return;
        }
        setPerCourseEnroll(rows);
      } catch (err) {
        if (!mounted) {
          return;
        }
        setError(err?.response?.data?.error || err?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- Derived stats ----
  const stats = useMemo(() => {
    const activeCourses = courses.filter((c) => c.status === "published").length;
    const totalCourses = courses.length;

    const totalStudents = perCourseEnroll.reduce((s, r) => s + (r.count || 0), 0);

    const totalPctSum = perCourseEnroll.reduce((s, r) => s + (r.sumPct || 0), 0);
    const avgCompletion =
      totalStudents > 0 ? Math.round(totalPctSum / totalStudents) : 0;

    // Total assignments = total lessons across my courses
    const totalAssignments = courses.reduce((s, c) => {
      const inCourse = (c.modules || []).reduce(
        (acc, m) => acc + (m.lessons?.length || 0),
        0
      );
      return s + inCourse;
    }, 0);

    // Calculate engagement metrics
    const highEngagement = perCourseEnroll.reduce((count, course) => {
      const engaged = course.students?.filter(s => (s.progressPercent || 0) >= 80).length || 0;
      return count + engaged;
    }, 0);

    return {
      activeCourses,
      totalStudents,
      totalAssignments,
      avgCompletion,
      totalCourses,
      highEngagement,
    };
  }, [courses, perCourseEnroll]);

  // Recent activity: latest enrollments across courses
  const recentActivity = useMemo(() => {
    const items = [];
    perCourseEnroll.forEach((row) => {
      (row.students || []).forEach((st) => {
        items.push({
          courseTitle: row.title,
          courseId: row.courseId,
          time: st.enrolledAt ? new Date(st.enrolledAt) : null,
          progressPercent: st.progressPercent ?? 0,
          completedCount: st.completedCount ?? 0,
          type: "enrollment",
          studentId: st.userId,
        });
      });
    });
    // sort by enrolledAt desc
    items.sort((a, b) => (b.time?.getTime?.() || 0) - (a.time?.getTime?.() || 0));
    return items.slice(0, 6);
  }, [perCourseEnroll]);

  // Top performing courses
  const topCourses = useMemo(() => {
    return perCourseEnroll
      .filter(course => course.count > 0)
      .sort((a, b) => (b.sumPct / b.count) - (a.sumPct / a.count))
      .slice(0, 3);
  }, [perCourseEnroll]);

  const quickActions = [
    {
      label: "Create New Course",
      description: "Design and publish a new course with AI assistance",
      icon: RocketLaunchIcon,
      action: () => navigate("/courses/new"),
      color: "primary",
      featured: true
    },
    {
      label: "Grade Assignments",
      description: "Review and evaluate student submissions",
      icon: BookOpenIcon,
      action: () => navigate("/assignments"),
      color: "success"
    },
    {
      label: "View Analytics",
      description: "Deep dive into student performance metrics",
      icon: ChartBarIcon,
      action: () => navigate("/analytics"),
      color: "accent"
    },
    {
      label: "Manage Assessments",
      description: "Create and schedule tests & quizzes",
      icon: DocumentCheckIcon, // Fixed: Using DocumentCheckIcon instead of ClipboardDocumentListIcon
      action: () => navigate("/tests"),
      color: "warning"
    },
  ];

  // Debug function to check if navigation works
  const handleNavigation = (path, actionName) => {
    console.log(`Navigating to: ${path} from ${actionName}`);
    navigate(path);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div 
        className="min-h-screen bg-slate-50 p-6"
        ref={containerRef}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Modern Welcome Section */}
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${cardStyle} rounded-xl p-8`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">EDUCATOR DASHBOARD</span>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome back, {user?.name || "Professor"}!
                </h1>
                <p className="text-slate-600 max-w-2xl">
                  You're managing <span className="font-semibold text-slate-900">{stats.totalCourses} courses</span> with <span className="font-semibold text-slate-900">{stats.totalStudents} active learners</span>. 
                  Your educational impact is growing every day!
                </p>

                {/* Quick stats inline */}
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <TrophyIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{stats.avgCompletion}% Avg Completion</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <StarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{stats.highEngagement} Highly Engaged</span>
                  </div>
                </div>
              </div>

              <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </motion.section>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50/80 backdrop-blur-lg border border-red-200 rounded-3xl p-6 flex items-center gap-4"
            >
              <div className="p-3 bg-red-100 rounded-2xl">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Unable to load dashboard data</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Modern Stats Grid */}
          {loading ? (
            <ModernSkeletonGrid />
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModernStatCard
                  icon={AcademicCapIcon}
                  label="Active Courses"
                  value={stats.activeCourses}
                  subtitle={`of ${stats.totalCourses} total`}
                  color="primary"
                  trend={+12}
                  loading={loading}
                  onClick={() => handleNavigation("/courses", "Active Courses")}
                />
                <ModernStatCard
                  icon={UserGroupIcon}
                  label="Students Enrolled"
                  value={stats.totalStudents.toLocaleString()}
                  subtitle="across all courses"
                  color="accent"
                  trend={+18}
                  loading={loading}
                  onClick={() => handleNavigation("/students", "Students")}
                />
                <ModernStatCard
                  icon={BookOpenIcon}
                  label="Total Assignments"
                  value={stats.totalAssignments}
                  subtitle="available for grading"
                  color="success"
                  trend={+8}
                  loading={loading}
                  onClick={() => handleNavigation("/assignments", "Assignments")}
                />
                <ModernStatCard
                  icon={ChartBarIcon}
                  label="Avg. Completion"
                  value={`${stats.avgCompletion}%`}
                  subtitle="student progress"
                  color="warning"
                  trend={+5}
                  loading={loading}
                />
              </div>
            </motion.section>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Quick Actions & Top Courses */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Quick Actions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardStyle} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <RocketLaunchIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                      <p className="text-sm text-slate-600">Jumpstart your teaching workflow</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {quickActions.map((action, i) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <ModernQuickAction 
                        {...action} 
                        onClick={() => handleNavigation(
                          action.label === "Manage Assessments" ? "/tests" : 
                          action.label === "Create New Course" ? "/courses/new" :
                          action.label === "Grade Assignments" ? "/assignments" :
                          action.label === "View Analytics" ? "/analytics" :
                          "/courses"
                        , action.label)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Top Performing Courses */}
              {topCourses.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${cardStyle} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <TrophyIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Top Performing Courses</h3>
                      <p className="text-sm text-slate-600">Your most successful educational content</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {topCourses.map((course, index) => {
                      const avgProgress = course.count > 0 ? Math.round(course.sumPct / course.count) : 0;
                      return (
                        <motion.div
                          key={course.courseId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 group cursor-pointer"
                          onClick={() => handleNavigation(`/courses/${course.courseId}`, course.title)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 group-hover:text-green-600 transition-colors">
                                {course.title}
                              </h4>
                              <p className="text-xs text-slate-500">{course.count} students</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">{avgProgress}%</div>
                            <p className="text-xs text-slate-500">Avg. Progress</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </motion.div>

            {/* Recent Activity & Insights */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Recent Activity */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardStyle} rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                    <p className="text-sm text-slate-600">Latest student engagements</p>
                  </div>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No recent activity yet</p>
                    <p className="text-xs mt-1">Student enrollments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentActivity.map((activity, idx) => (
                      <ModernActivityItem
                        key={`${activity.courseId}-${activity.studentId}-${idx}`}
                        activity={activity}
                        index={idx}
                        onClick={() => handleNavigation(`/courses/${activity.courseId}`, activity.courseTitle)}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleNavigation("/courses", "View All Courses")}
                  className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors duration-200 text-sm"
                >
                  View All Courses
                </button>
              </motion.section>

              {/* Quick Insights */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${cardStyle} rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <LightBulbIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Quick Insights</h3>
                    <p className="text-sm text-slate-600">Your teaching performance</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ChartBarIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Engagement Rate</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">78%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <StarIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Satisfaction Score</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">4.8/5</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Avg. Time Spent</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">42min</span>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </div>

          {/* Productivity Tips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${cardStyle} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Pro Tip of the Day</h3>
                </div>
                <p className="text-slate-600 max-w-2xl text-sm">
                  Use AI-assisted course creation to save 3+ hours per week. Our AI analyzes successful course patterns 
                  and automatically generates optimized lesson structures and assessments.
                </p>
              </div>
              <button
                onClick={() => handleNavigation("/courses/new?method=ai", "AI Assistant")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Try AI Assistant
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </LazyMotion>
  );
}
