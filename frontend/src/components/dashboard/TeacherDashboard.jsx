import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
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

// Premium design system
const premiumColors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    900: "#0c4a6e",
  },
  accent: {
    50: "#fdf4ff",
    500: "#d946ef",
    600: "#c026d3",
  },
  success: {
    500: "#10b981",
    600: "#059669",
  },
  warning: {
    500: "#f59e0b",
    600: "#d97706",
  },
  luxury: {
    gold: "#ffd700",
    platinum: "#e5e4e2",
  }
};

const glassStyle = "bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10";
const premiumGradient = "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20";

// Premium Stat Card Component
const PremiumStatCard = ({ icon: Icon, label, value, color = "primary", trend, loading, onClick, subtitle }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${glassStyle} rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 ${
      onClick ? 'hover:shadow-2xl hover:shadow-black/20' : ''
    }`}
  >
    {/* Animated background elements */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full" />
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full" />
    
    <div className="relative flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-600 mb-2">{label}</p>
        {loading ? (
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-3/4 animate-pulse" />
        ) : (
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
        )}
        {subtitle && !loading && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
        {trend !== undefined && !loading && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center mt-2 text-sm font-medium ${
              trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'
            }`}
          >
            <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
            <span className="text-slate-400 text-xs ml-1">this month</span>
          </motion.div>
        )}
      </div>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`p-3 rounded-2xl ${
          color === 'primary' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
          color === 'accent' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
          color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
          'bg-gradient-to-br from-yellow-500 to-yellow-600'
        } shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.div>
    </div>

    {/* Hover effect overlay */}
    {onClick && (
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"
      />
    )}
  </motion.div>
);

// Enhanced Quick Action Component
const PremiumQuickAction = ({ icon: Icon, label, description, color = "primary", onClick, featured }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-6 rounded-2xl text-left group transition-all duration-300 relative overflow-hidden ${
      featured 
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-2 border-blue-200/60 hover:border-blue-300' 
        : `${
            color === 'primary' ? 'bg-gradient-to-br from-blue-50 to-white border border-blue-200/40 hover:border-blue-300/60' :
            color === 'accent' ? 'bg-gradient-to-br from-purple-50 to-white border border-purple-200/40 hover:border-purple-300/60' :
            color === 'success' ? 'bg-gradient-to-br from-green-50 to-white border border-green-200/40 hover:border-green-300/60' :
            'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200/40 hover:border-yellow-300/60'
          } hover:shadow-lg`
    }`}
  >
    {/* Featured badge */}
    {featured && (
      <div className="absolute top-3 right-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-xs text-white font-bold"
        >
          POPULAR
        </motion.div>
      </div>
    )}

    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-2xl ${
        featured
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
          : `${
              color === 'primary' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
              color === 'accent' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
              color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
              'bg-gradient-to-br from-yellow-500 to-yellow-600'
            } text-white shadow-lg`
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold text-lg mb-1 ${
          featured ? 'text-blue-900' : 'text-slate-900'
        }`}>
          {label}
        </h3>
        <p className={`text-sm ${
          featured ? 'text-blue-700' : 'text-slate-600'
        }`}>
          {description}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ArrowRightIcon className={`h-5 w-5 ${featured ? 'text-blue-500' : 'text-slate-400'}`} />
      </motion.div>
    </div>
  </motion.button>
);

// Enhanced Activity Item Component
const PremiumActivityItem = ({ activity, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
    onClick={onClick}
  >
    {/* Avatar with progress ring */}
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
        {activity.courseTitle?.[0]?.toUpperCase() || "C"}
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
        <StarIcon className="h-3 w-3 text-white" />
      </div>
      
      {/* Progress ring */}
      <svg className="absolute -top-1 -left-1 w-14 h-14 transform -rotate-90">
        <circle
          cx="28"
          cy="28"
          r="12"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-slate-200"
        />
        <circle
          cx="28"
          cy="28"
          r="12"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={75}
          strokeDashoffset={75 - (activity.progressPercent / 100) * 75}
          className="text-emerald-500 transition-all duration-1000 ease-out"
        />
      </svg>
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-semibold text-slate-900 truncate">
          New Enrollment
        </p>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {activity.progressPercent}% Complete
        </span>
      </div>
      <p className="text-sm text-slate-600 truncate">
        {activity.courseTitle}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <ClockIcon className="h-3 w-3 text-slate-400" />
        <p className="text-xs text-slate-400">
          {activity.time ? activity.time.toLocaleString() : "Recently"}
        </p>
      </div>
    </div>

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <EyeIcon className="h-4 w-4 text-slate-600" />
    </motion.button>
  </motion.div>
);

// Enhanced Loading Skeleton
const PremiumSkeletonGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 p-6"
      >
        <div className="space-y-4">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-1/2 animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-3/4 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-1/3 animate-pulse" />
        </div>
      </motion.div>
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
        if (!mounted) return;
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
            } catch (e) {
              return { courseId: c._id, count: 0, sumPct: 0, students: [], title: c.title, status: c.status };
            }
          })
        );

        if (!mounted) return;
        setPerCourseEnroll(rows);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.error || e?.message || "Failed to load dashboard data");
      } finally {
        if (!mounted) return;
        setLoading(false);
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
      action: () => navigate("/courses/create"),
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
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6 relative overflow-hidden"
        ref={containerRef}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-pink-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-8xl mx-auto relative z-10 space-y-8">
          {/* Premium Welcome Section */}
          <motion.section 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className={`${glassStyle} rounded-3xl overflow-hidden relative`}
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-24 translate-y-24" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <SparklesIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-blue-100 font-semibold">EDUCATOR DASHBOARD</span>
                    </motion.div>
                    
                    <h2 className="text-5xl font-black mb-4">
                      Welcome back, <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">{user?.name || "Professor"}!</span>
                    </h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl text-blue-100 max-w-3xl leading-relaxed"
                    >
                      You're managing <span className="font-bold text-white">{stats.totalCourses} courses</span> with <span className="font-bold text-white">{stats.totalStudents} active learners</span>. 
                      Your educational impact is growing every day!
                    </motion.p>

                    {/* Quick stats inline */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-6 mt-6"
                    >
                      <div className="flex items-center gap-2 text-blue-100">
                        <TrophyIcon className="h-5 w-5" />
                        <span className="font-semibold">{stats.avgCompletion}% Avg Completion</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <StarIcon className="h-5 w-5" />
                        <span className="font-semibold">{stats.highEngagement} Highly Engaged</span>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="ml-8"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <AcademicCapIcon className="h-16 w-16 text-white" />
                    </div>
                  </motion.div>
                </div>
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

          {/* Enhanced Stats Grid */}
          {loading ? (
            <PremiumSkeletonGrid />
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PremiumStatCard
                  icon={AcademicCapIcon}
                  label="Active Courses"
                  value={stats.activeCourses}
                  subtitle={`of ${stats.totalCourses} total`}
                  color="primary"
                  trend={+12}
                  loading={loading}
                  onClick={() => handleNavigation("/courses", "Active Courses")}
                />
                <PremiumStatCard
                  icon={UserGroupIcon}
                  label="Students Enrolled"
                  value={stats.totalStudents.toLocaleString()}
                  subtitle="across all courses"
                  color="accent"
                  trend={+18}
                  loading={loading}
                  onClick={() => handleNavigation("/students", "Students")}
                />
                <PremiumStatCard
                  icon={BookOpenIcon}
                  label="Total Assignments"
                  value={stats.totalAssignments}
                  subtitle="available for grading"
                  color="success"
                  trend={+8}
                  loading={loading}
                  onClick={() => handleNavigation("/assignments", "Assignments")}
                />
                <PremiumStatCard
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Quick Actions & Top Courses */}
            <motion.div
              className="xl:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Quick Actions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${glassStyle} rounded-3xl p-8`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                      <RocketLaunchIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Quick Actions</h3>
                      <p className="text-slate-600">Jumpstart your teaching workflow</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation("/courses", "View All Courses")}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, i) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <PremiumQuickAction 
                        {...action} 
                        onClick={() => handleNavigation(
                          action.label === "Manage Assessments" ? "/tests" : 
                          action.label === "Create New Course" ? "/courses/create" :
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
                  transition={{ delay: 0.5 }}
                  className={`${glassStyle} rounded-3xl p-8`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                        <TrophyIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Top Performing Courses</h3>
                        <p className="text-slate-600">Your most successful educational content</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {topCourses.map((course, index) => {
                      const avgProgress = course.count > 0 ? Math.round(course.sumPct / course.count) : 0;
                      return (
                        <motion.div
                          key={course.courseId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                          onClick={() => handleNavigation(`/courses/${course.courseId}`, course.title)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                {course.title}
                              </h4>
                              <p className="text-sm text-slate-600">{course.count} students</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">{avgProgress}%</div>
                            <p className="text-sm text-slate-500">Avg. Progress</p>
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
              className="xl:col-span-1 space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Recent Activity */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${glassStyle} rounded-3xl p-8 h-full`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Recent Activity</h3>
                      <p className="text-slate-600">Latest student engagements</p>
                    </div>
                  </div>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No recent activity yet</p>
                    <p className="text-sm mt-1">Student enrollments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <PremiumActivityItem
                        key={`${activity.courseId}-${activity.studentId}-${idx}`}
                        activity={activity}
                        index={idx}
                        onClick={() => handleNavigation(`/courses/${activity.courseId}`, activity.courseTitle)}
                      />
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation("/courses", "View All Courses")}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-2xl font-semibold text-slate-700 transition-all duration-300 border border-slate-200/60"
                >
                  View All Courses
                </motion.button>
              </motion.section>

              {/* Quick Insights */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`${glassStyle} rounded-3xl p-8`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                    <LightBulbIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Quick Insights</h3>
                    <p className="text-slate-600">Your teaching performance</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <ChartBarIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Engagement Rate</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">78%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <StarIcon className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700">Satisfaction Score</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">4.8/5</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Avg. Time Spent</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">42min</span>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </div>

          {/* Productivity Tips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${glassStyle} rounded-3xl p-8`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Pro Tip of the Day</h3>
                </div>
                <p className="text-slate-600 max-w-2xl">
                  Use AI-assisted course creation to save 3+ hours per week. Our AI analyzes successful course patterns 
                  and automatically generates optimized lesson structures and assessments.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/courses/create?method=ai", "AI Assistant")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try AI Assistant
              </motion.button>
            </div>
          </motion.section>
        </div>
      </div>
    </LazyMotion>
  );
}