// frontend/src/components/teacher/GradeAssignmentsPage.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  TrophyIcon,
  LightBulbIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import courseApi from "../../api/course";

// Premium 3D color system with glass morphism
const premiumColors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  accent: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },
  success: {
    50: "#ecfdf5",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
  },
  error: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },
  luxury: {
    gold: "#ffd700",
    platinum: "#e5e4e2",
    diamond: "#b9f2ff",
  }
};

// Enhanced glass morphism styles
const glassStyle = "bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10";
const premiumGradient = "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20";

// 3D Card component with parallax effect
const ParallaxCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-3xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) scale3d(1, 1, 1)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-50 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, ${premiumColors.primary[200]}20, transparent 50%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

// Enhanced Skeleton Loader with shimmer effect
const PremiumSkeletonRow = () => (
  <motion.tr
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    className="border-t border-slate-200/40"
  >
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="relative overflow-hidden h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full w-3/4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </td>
    ))}
  </motion.tr>
);

// Animated Grade Badge with progress ring
const GradeBadge = ({ grade, size = "md" }) => {
  if (grade == null) {
    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-300/30 backdrop-blur-sm ${size === "lg" ? "text-sm px-4 py-2" : ""}`}
      >
        <ClockIcon className="h-3 w-3 mr-1.5" />
        Ungraded
      </motion.span>
    );
  }

  const getGradeColor = (g) => {
    if (g >= 90) return "from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/25";
    if (g >= 80) return "from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/25";
    if (g >= 70) return "from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25";
    return "from-rose-400 to-red-500 text-white shadow-lg shadow-rose-500/25";
  };

  const circumference = 2 * Math.PI * 12;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (grade / 100) * circumference;

  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 2 }}
      className={`relative inline-flex items-center justify-center bg-gradient-to-br ${getGradeColor(grade)} rounded-2xl px-3 py-1.5 font-bold ${size === "lg" ? "px-4 py-2 text-sm" : "text-xs"}`}
    >
      <span className="relative z-10 flex items-center">
        {grade}%
        {grade >= 90 && <StarIcon className="h-3 w-3 ml-1" />}
      </span>
      
      {/* Progress ring */}
      <svg className="absolute left-1 top-1 w-6 h-6 transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-white/30"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </motion.div>
  );
};

// Enhanced Stats Cards with micro-interactions
const StatsCard = ({ icon: Icon, label, value, trend, color = "primary", onClick }) => (
  <ParallaxCard className="cursor-pointer" onClick={onClick}>
    <motion.div
      whileHover={{ y: -4 }}
      className={`${glassStyle} rounded-3xl p-6 relative overflow-hidden group`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          {trend !== undefined && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center mt-2 text-sm font-medium ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'}`}
            >
              <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
              <span className="text-xs text-slate-400 ml-1">from last week</span>
            </motion.div>
          )}
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 rounded-2xl bg-gradient-to-br from-${premiumColors[color][500]} to-${premiumColors[color][700]} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {/* Interactive pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </ParallaxCard>
);

// Enhanced Search with advanced filters
const AdvancedSearch = ({ searchTerm, setSearchTerm, onAdvancedFilter }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, lessons, or feedback..."
          className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg shadow-black/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl shadow-black/20 p-4 z-50"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Grade Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                  <option>All</option>
                  <option>Graded</option>
                  <option>Ungraded</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GradeAssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [filterLessonId, setFilterLessonId] = useState("");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // grading modal
  const [grading, setGrading] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  // preview modal
  const [previewJson, setPreviewJson] = useState(null);

  // Advanced states
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });

  // Enhanced stats with analytics
  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.grade != null).length;
    const averageGrade = graded > 0 
      ? Math.round(submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / graded)
      : 0;
    const pending = total - graded;
    const excellent = submissions.filter(s => s.grade >= 90).length;
    const needsImprovement = submissions.filter(s => s.grade != null && s.grade < 70).length;

    return { total, graded, averageGrade, pending, excellent, needsImprovement };
  }, [submissions]);

  // Enhanced search and filter with multiple criteria
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions.filter((s) => {
      const matchesLesson = filterLessonId ? s.lessonId === filterLessonId : true;
      const matchesSearch = searchTerm ? 
        (s.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.lessonTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.feedback?.toLowerCase().includes(searchTerm.toLowerCase())) : true;
      
      const matchesFilter = activeFilter === "all" ? true :
        activeFilter === "graded" ? s.grade != null :
        activeFilter === "ungraded" ? s.grade == null :
        activeFilter === "excellent" ? s.grade >= 90 :
        activeFilter === "needs_improvement" ? s.grade != null && s.grade < 70 : true;
      
      return matchesLesson && matchesSearch && matchesFilter;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [submissions, filterLessonId, searchTerm, activeFilter, sortConfig]);

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  // Enhanced data loading with refresh
  const loadData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      if (!selectedCourseId) {
        const resp = await courseApi.getCourses({ mine: true });
        const list = resp?.courses || resp?.rows || (Array.isArray(resp) ? resp : []);
        setCourses(list);
        if (list.length && !selectedCourseId) setSelectedCourseId(list[0]._id);
      }

      if (selectedCourseId) {
        const data = await courseApi.listAssignmentSubmissions(selectedCourseId);
        const rows = data?.submissions || data?.rows || (Array.isArray(data) ? data : []);
        setSubmissions(rows);
      }
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCourseId]);

  const lessonsForCourse = useMemo(() => {
    const c = courses.find((x) => x._id === selectedCourseId);
    return c ? flattenLessons(c) : [];
  }, [courses, selectedCourseId]);

  function openGrade(row) {
    setGrading(row);
    setGradeValue(row.grade ?? "");
    setFeedback(row.feedback ?? "");
  }

  function openPreview(obj) {
    try {
      setPreviewJson(JSON.stringify(obj ?? {}, null, 2));
    } catch {
      setPreviewJson("{}");
    }
  }

  async function submitGrade() {
    if (!grading) return;
    try {
      setSaving(true);
      const n = Number(gradeValue);
      const grade = Number.isFinite(n)
        ? Math.max(0, Math.min(100, Math.round(n)))
        : null;

      await courseApi.gradeAssignment(grading.courseId, grading.lessonId, {
        userId: grading.userId,
        grade,
        feedback: feedback.trim() || undefined,
      });

      // Optimistic update
      setSubmissions(prev => prev.map(s => 
        s.courseId === grading.courseId && 
        s.lessonId === grading.lessonId && 
        s.userId === grading.userId 
          ? { ...s, grade, feedback }
          : s
      ));

      setGrading(null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to grade");
    } finally {
      setSaving(false);
    }
  }

  // Quick grade actions
  const quickGrade = (grade) => {
    if (!grading) return;
    setGradeValue(grade.toString());
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-pink-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-8xl mx-auto space-y-8 relative z-10">
          {/* Premium Header with enhanced design */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl shadow-blue-500/30">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1 w-4 h-4 border-2 border-amber-400 rounded-full"
                />
              </motion.div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Grade Master
                </h1>
                <p className="text-slate-600 text-lg mt-2 max-w-2xl">
                  Intelligent grading platform with AI-powered insights and premium evaluation tools
                </p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden xl:flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200/60 shadow-lg"
            >
              <div className="relative">
                <SparklesIcon className="h-6 w-6 text-amber-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-amber-400/20 rounded-full"
                />
              </div>
              <div>
                <p className="font-bold text-amber-800">Pro Grading Suite</p>
                <p className="text-sm text-amber-600">AI Insights • Bulk Actions • Analytics</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/40 shadow-lg text-slate-700 hover:bg-white transition-all duration-200 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh</span>
              </motion.button>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                {[
                  { key: "all", label: "All", count: submissions.length },
                  { key: "graded", label: "Graded", count: stats.graded },
                  { key: "ungraded", label: "Ungraded", count: stats.pending },
                  { key: "excellent", label: "Excellent", count: stats.excellent, color: "emerald" },
                  { key: "needs_improvement", label: "Needs Help", count: stats.needsImprovement, color: "rose" },
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 relative overflow-hidden ${
                      activeFilter === filter.key
                        ? `bg-${filter.color || 'blue'}-500 text-white shadow-lg shadow-${filter.color || 'blue'}-500/25`
                        : "bg-white/60 text-slate-700 hover:bg-white/80"
                    }`}
                  >
                    {filter.label}
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilter === filter.key ? "bg-white/20" : "bg-slate-100"
                    }`}>
                      {filter.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Productivity Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.graded / Math.max(stats.total, 1)) * 100}%` }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {Math.round((stats.graded / Math.max(stats.total, 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            <div className="lg:col-span-2">
              <StatsCard
                icon={UserGroupIcon}
                label="Total Submissions"
                value={stats.total}
                trend={+12}
                color="primary"
              />
            </div>
            <StatsCard
              icon={CheckCircleIcon}
              label="Graded"
              value={stats.graded}
              trend={stats.total > 0 ? Math.round((stats.graded / stats.total) * 100) : 0}
              color="success"
            />
            <StatsCard
              icon={ChartBarIcon}
              label="Average Grade"
              value={`${stats.averageGrade}%`}
              trend={+3}
              color="accent"
            />
            <StatsCard
              icon={ClockIcon}
              label="Pending Review"
              value={stats.pending}
              trend={-8}
              color="warning"
            />
            <StatsCard
              icon={TrophyIcon}
              label="Excellent Work"
              value={stats.excellent}
              trend={+5}
              color="success"
            />
          </motion.div>

          {/* Enhanced Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${glassStyle} rounded-3xl p-8`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course & Lesson Selection */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                      <DocumentChartBarIcon className="h-4 w-4" />
                      Select Course
                    </label>
                    <select
                      className="w-full px-4 py-4 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg shadow-black/5"
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setFilterLessonId("");
                      }}
                    >
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title} {c.status === "draft" && "• Draft"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                      <LightBulbIcon className="h-4 w-4" />
                      Filter by Lesson
                    </label>
                    <select
                      className="w-full px-4 py-4 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg shadow-black/5"
                      value={filterLessonId}
                      onChange={(e) => setFilterLessonId(e.target.value)}
                    >
                      <option value="">All Lessons</option>
                      {lessonsForCourse.map((l) => (
                        <option key={l.lessonId} value={l.lessonId}>
                          {l.moduleTitle} — {l.lessonTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Enhanced Search */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  Advanced Search
                </label>
                <AdvancedSearch 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${glassStyle} rounded-3xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 backdrop-blur-lg">
                  <tr className="text-left text-slate-600 font-semibold">
                    <th className="px-8 py-6 font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors duration-200 rounded-l-3xl">
                      Student
                    </th>
                    <th className="px-8 py-6 font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors duration-200">
                      Lesson & Module
                    </th>
                    <th 
                      className="px-8 py-6 font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors duration-200"
                      onClick={() => requestSort('submittedAt')}
                    >
                      <div className="flex items-center gap-2">
                        Submitted
                        <motion.span
                          animate={{ rotate: sortConfig.direction === 'asc' ? 0 : 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                        </motion.span>
                      </div>
                    </th>
                    <th className="px-8 py-6 font-bold text-slate-700">Preview</th>
                    <th className="px-8 py-6 font-bold text-slate-700">Grade Status</th>
                    <th className="px-8 py-6 font-bold text-slate-700">Feedback</th>
                    <th className="px-8 py-6 font-bold text-slate-700 text-right rounded-r-3xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40">
                  {loading ? (
                    [...Array(6)].map((_, i) => <PremiumSkeletonRow key={i} />)
                  ) : filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-16 text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center text-slate-400"
                        >
                          <div className="p-4 bg-slate-100/50 rounded-2xl mb-4">
                            <AcademicCapIcon className="h-12 w-12 opacity-40" />
                          </div>
                          <p className="text-xl font-semibold text-slate-500 mb-2">No submissions found</p>
                          <p className="text-slate-400 max-w-md">
                            {searchTerm || filterLessonId || activeFilter !== "all" 
                              ? "Try adjusting your search criteria or filters" 
                              : "No assignments have been submitted for this course yet"}
                          </p>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filteredSubmissions.map((s, index) => (
                        <motion.tr
                          key={`${s.courseId}-${s.lessonId}-${s.userId}`}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.03, type: "spring", stiffness: 100 }}
                          whileHover={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            scale: 1.002,
                          }}
                          className="group transition-all duration-300"
                        >
                          <td className="px-8 py-6 rounded-l-3xl">
                            <div className="flex items-center space-x-4">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative"
                              >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {s.student?.name?.[0]?.toUpperCase() || s.student?.email?.[0]?.toUpperCase() || "U"}
                                </div>
                                {s.grade >= 90 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                                  >
                                    <StarIcon className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                              </motion.div>
                              <div>
                                <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {s.student?.name || "Unknown Student"}
                                </p>
                                <p className="text-slate-500 text-sm">
                                  {s.student?.email || s.userId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {s.lessonTitle || s.lessonId}
                              </p>
                              <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-slate-300 rounded-full" />
                                {s.moduleTitle}
                              </p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-medium">
                                {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "—"}
                              </span>
                              <span className="text-slate-500 text-xs">
                                {s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString() : ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openPreview(s.payload)}
                              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100/60 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 group border border-slate-200/30"
                            >
                              <EyeIcon className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
                              <span className="text-sm font-medium">View Work</span>
                            </motion.button>
                          </td>
                          <td className="px-8 py-6">
                            <GradeBadge grade={s.grade} />
                          </td>
                          <td className="px-8 py-6">
                            <div className="max-w-[240px]">
                              {s.feedback ? (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="truncate text-slate-600 cursor-help group relative"
                                  title={s.feedback}
                                >
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-2 text-slate-400" />
                                  {s.feedback}
                                </motion.div>
                              ) : (
                                <span className="text-slate-400 italic flex items-center gap-2">
                                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                  No feedback yet
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right rounded-r-3xl">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openGrade(s)}
                              className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                                s.grade == null 
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700" 
                                  : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-green-700"
                              }`}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              <span>{s.grade == null ? "Grade Now" : "Update Grade"}</span>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Ultra Premium Grading Modal */}
          <AnimatePresence>
            {grading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-4xl bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-white/60"
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-3xl font-bold">Evaluate Submission</h3>
                          <p className="text-blue-100 mt-2 text-lg">
                            {grading.lessonTitle || grading.lessonId}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setGrading(null)}
                          className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-colors duration-200"
                        >
                          <XCircleIcon className="h-6 w-6" />
                        </motion.button>
                      </div>
                      
                      {/* Student Info */}
                      <div className="flex items-center gap-4 mt-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-lg">
                          {grading.student?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold">{grading.student?.name || "Unknown Student"}</p>
                          <p className="text-blue-200 text-sm">{grading.student?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 space-y-8">
                    {/* Quick Grade Actions */}
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-4 block">Quick Grade</label>
                      <div className="flex gap-3">
                        {[100, 90, 80, 70, 60].map((score) => (
                          <motion.button
                            key={score}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => quickGrade(score)}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg"
                          >
                            {score}%
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Grade Input */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-3 block">
                          Grade (0–100)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full px-4 py-4 border border-slate-200 rounded-2xl bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg font-semibold shadow-lg"
                            value={gradeValue}
                            onChange={(e) => setGradeValue(e.target.value)}
                            placeholder="Enter grade..."
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-slate-400 font-medium">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Live Grade Preview */}
                      <div className="flex items-center justify-center">
                        <GradeBadge grade={Number(gradeValue)} size="lg" />
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        Personalized Feedback
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-4 border border-slate-200 rounded-2xl bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none shadow-lg"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide constructive feedback to help the student improve..."
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-slate-500 text-sm">
                          {feedback.length}/500 characters
                        </p>
                        <div className="flex gap-2">
                          {["Great work!", "Needs improvement", "Excellent understanding"].map((text) => (
                            <motion.button
                              key={text}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFeedback(text)}
                              className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                            >
                              {text}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                      <motion.button
                        whileHover={{ scale: 1.02, x: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGrading(null)}
                        className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold shadow-lg"
                        disabled={saving}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={submitGrade}
                        disabled={saving}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-200 font-semibold inline-flex items-center gap-3 disabled:opacity-60"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Saving Evaluation...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-5 w-5" />
                            <span>Save Evaluation</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Preview Modal */}
          <AnimatePresence>
            {previewJson != null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-6xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50"
                >
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Submission Details</h3>
                        <p className="text-slate-300 text-lg mt-2">
                          Raw submission data and comprehensive metadata analysis
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPreviewJson(null)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors duration-200"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-1 bg-gradient-to-br from-slate-800 to-slate-900">
                    <pre className="bg-slate-900 text-slate-100 text-sm rounded-2xl p-8 overflow-auto max-h-[70vh] font-mono border border-slate-700/50 shadow-2xl">
                      {previewJson}
                    </pre>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Styles for Gradients */}
      <style jsx>{`
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </LazyMotion>
  );
}

// Helper function remains the same
function flattenLessons(course) {
  const out = [];
  (course.modules || []).forEach((m, mi) => {
    (m.lessons || []).forEach((l) => {
      out.push({
        courseId: course._id,
        courseTitle: course.title,
        moduleTitle: m.title,
        moduleOrder: m.order ?? mi,
        lessonId: l._id,
        lessonTitle: l.title,
      });
    });
  });
  return out;
}