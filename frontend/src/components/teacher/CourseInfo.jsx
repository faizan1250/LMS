import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseView from "./CourseView";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  PlusIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  UsersIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  CogIcon,
  LightBulbIcon,
  StarIcon,
  DocumentChartBarIcon,
  ArrowRightIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
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
const PremiumStatCard = ({ icon: Icon, label, value, color = "primary", trend, loading, onClick }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
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
          <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
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
        className={`p-3 rounded-2xl bg-gradient-to-br from-${premiumColors[color][500]} to-${premiumColors[color][600]} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
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

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, description, color = "primary", onClick, disabled, featured }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-6 rounded-2xl text-left group transition-all duration-300 relative overflow-hidden ${
      featured 
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-2 border-blue-200/60 hover:border-blue-300' 
        : disabled 
          ? 'bg-slate-100/60 text-slate-400 cursor-not-allowed' 
          : `bg-gradient-to-br from-${premiumColors[color][50]} to-white border border-${premiumColors[color][200]}/40 hover:shadow-lg hover:border-${premiumColors[color][300]}/60 cursor-pointer`
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
        disabled 
          ? 'bg-slate-200 text-slate-400' 
          : featured
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
            : `bg-gradient-to-br from-${premiumColors[color][500]} to-${premiumColors[color][600]} text-white shadow-lg`
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold text-lg mb-1 ${
          disabled ? 'text-slate-400' : featured ? 'text-blue-900' : 'text-slate-900'
        }`}>
          {label}
        </h3>
        <p className={`text-sm ${
          disabled ? 'text-slate-400' : featured ? 'text-blue-700' : 'text-slate-600'
        }`}>
          {description}
        </p>
      </div>
      {!disabled && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ArrowRightIcon className={`h-5 w-5 ${featured ? 'text-blue-500' : 'text-slate-400'}`} />
        </motion.div>
      )}
    </div>
  </motion.button>
);

// Creation Method Card
const CreationMethodCard = ({ icon: Icon, title, description, features, ctaText, onClick, variant = "primary" }) => {
  const variants = {
    primary: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    accent: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
    success: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
  };

  const iconVariants = {
    primary: "from-blue-500 to-indigo-600",
    accent: "from-purple-500 to-pink-600",
    success: "from-emerald-500 to-green-600"
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-3xl border-2 p-6 cursor-pointer group transition-all duration-300 ${variants[variant]}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${iconVariants[variant]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>

      {/* Features */}
      {features && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-white/80 rounded-lg text-xs text-slate-700 font-medium">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
          variant === 'primary' 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : variant === 'accent'
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        } shadow-lg hover:shadow-xl`}
      >
        {ctaText}
      </motion.button>
    </motion.div>
  );
};

export default function CourseInfo() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    averageCompletion: 0,
    totalCourses: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const containerRef = useRef(null);

  const fetchCoursesAndStats = useCallback(async () => {
    let cancelled = false;
    try {
      setLoading(true);

      // 1) Load teacher-owned courses
      const teacherCourses = await courseApi.listOwned();
      if (cancelled) return;
      setCourses(Array.isArray(teacherCourses) ? teacherCourses : []);

      if (!teacherCourses?.length) {
        setStats({
          activeCourses: 0,
          draftCourses: 0,
          totalStudents: 0,
          averageCompletion: 0,
          totalCourses: 0,
        });
        return;
      }

      // 2) For each course, get enrolled students and sum progress
      const perCourse = await Promise.all(
        teacherCourses.map(async (c) => {
          try {
            const r = await courseApi.listEnrolledStudents(c._id);
            const students = r?.students || r?.rows || (Array.isArray(r) ? r : []);
            const count = Array.isArray(students) ? students.length : 0;

            const sumPct = (students || []).reduce((s, st) => {
              const pct =
                Number(st?.progressPercent) ??
                Number(st?.progress?.percent) ??
                0;
              return s + (Number.isFinite(pct) ? pct : 0);
            }, 0);

            return { id: c._id, count, sumPct };
          } catch {
            return { id: c._id, count: 0, sumPct: 0 };
          }
        })
      );
      if (cancelled) return;

      const totalStudents = perCourse.reduce((s, x) => s + (x.count || 0), 0);
      const totalPctSum = perCourse.reduce((s, x) => s + (x.sumPct || 0), 0);
      const averageCompletion =
        totalStudents > 0 ? Math.round(totalPctSum / totalStudents) : 0;

      const activeCourses = teacherCourses.filter(
        (c) => c.status === "published" || c.published === true
      ).length;
      const draftCourses = teacherCourses.filter(
        (c) => c.status === "draft" || c.published === false
      ).length;

      setStats({
        activeCourses,
        draftCourses,
        totalStudents,
        averageCompletion,
        totalCourses: teacherCourses.length,
      });
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = fetchCoursesAndStats();
    return () => {
      if (typeof cancel === "function") cancel();
    };
  }, [fetchCoursesAndStats]);

  const handleCourseCreated = () => {
    fetchCoursesAndStats();
  };

  const quickActions = [
    {
      icon: RocketLaunchIcon,
      label: "AI Course Generator",
      description: "Create a complete course with AI in minutes",
      color: "accent",
      onClick: () => navigate("/courses/new?method=ai"),
      featured: true
    },
    {
      icon: BookOpenIcon,
      label: "Blank Course Template",
      description: "Start from scratch with full customization",
      color: "primary",
      onClick: () => navigate("/courses/new?method=blank"),
    },
    {
      icon: ShareIcon,
      label: "Import Existing Content",
      description: "Bring in materials from other platforms",
      color: "success",
      onClick: () => navigate("/courses/new?method=import"),
    },
  ];

  const creationMethods = [
    {
      icon: RocketLaunchIcon,
      title: "AI-Powered Creation",
      description: "Let AI generate a complete course structure with content, quizzes, and assignments in minutes",
      features: ["Auto-generated content", "Smart quiz creation", "Assignment templates", "SEO optimization"],
      ctaText: "Generate with AI",
      variant: "accent",
      onClick: () => navigate("/courses/new?method=ai")
    },
    {
      icon: BookOpenIcon,
      title: "Manual Course Builder",
      description: "Full control over every aspect of your course with our drag-and-drop builder",
      features: ["Drag & drop modules", "Custom assessments", "Multimedia support", "Advanced analytics"],
      ctaText: "Start Building",
      variant: "primary",
      onClick: () => navigate("/courses/new?method=manual")
    },
    {
      icon: PuzzlePieceIcon,
      title: "Template Library",
      description: "Choose from professionally designed templates for different subjects and teaching styles",
      features: ["50+ templates", "Industry-specific", "Mobile-optimized", "Proven formats"],
      ctaText: "Browse Templates",
      variant: "success",
      onClick: () => navigate("/courses/new?method=templates")
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6 relative overflow-hidden"
        ref={containerRef}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-pink-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-8xl mx-auto relative z-10">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 px-5 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeftIcon className="h-5 w-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Back to Dashboard
                </span>
              </motion.button>
            </div>

            <div className="text-right">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 justify-end mb-2"
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Course Studio
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 text-lg"
              >
                {loading ? "Loading your educational empire..." : `Masterpiece management for ${stats.totalCourses} courses`}
              </motion.p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-8"
          >
            {[
              { id: "overview", label: "Overview", icon: ChartBarIcon },
              { id: "create", label: "Create New", icon: PlusIcon },
              { id: "analytics", label: "Analytics", icon: TrophyIcon },
              { id: "settings", label: "Settings", icon: CogIcon },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/80 text-blue-600 shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Stats Dashboard */}
          {loading ? (
            <PremiumSkeletonGrid />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <PremiumStatCard
                icon={AcademicCapIcon}
                label="Total Courses"
                value={stats.totalCourses}
                color="primary"
                trend={+12}
                loading={loading}
                onClick={() => setActiveTab("overview")}
              />
              <PremiumStatCard
                icon={UsersIcon}
                label="Students Enrolled"
                value={stats.totalStudents.toLocaleString()}
                color="accent"
                trend={+18}
                loading={loading}
                onClick={() => {/* Navigate to students */}}
              />
              <PremiumStatCard
                icon={TrophyIcon}
                label="Avg Completion"
                value={`${stats.averageCompletion}%`}
                color="success"
                trend={+5}
                loading={loading}
              />
              <PremiumStatCard
                icon={ChartBarIcon}
                label="Active Courses"
                value={stats.activeCourses}
                color="warning"
                trend={+8}
                loading={loading}
              />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-8"
              >
                {/* Left Column - Quick Actions */}
                <motion.div
                  className="xl:col-span-1 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`${glassStyle} rounded-3xl p-8`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                        <RocketLaunchIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Quick Start</h2>
                        <p className="text-slate-600 mt-1">Launch your next educational masterpiece</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <QuickActionButton {...action} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Performance Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`${glassStyle} rounded-3xl p-8`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Performance Insights</h2>
                        <p className="text-slate-600 mt-1">Your teaching impact analytics</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <BookOpenIcon className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="font-semibold text-slate-900">Course Completion</p>
                            <p className="text-slate-500 text-sm">Average student progress</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{stats.averageCompletion}%</p>
                          <p className="text-emerald-600 text-sm font-medium">+5% this month</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <UsersIcon className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="font-semibold text-slate-900">Student Engagement</p>
                            <p className="text-slate-500 text-sm">Active learners</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{Math.round(stats.totalStudents * 0.75)}</p>
                          <p className="text-blue-600 text-sm font-medium">75% active</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <StarIcon className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="font-semibold text-slate-900">Satisfaction Rate</p>
                            <p className="text-slate-500 text-sm">Student feedback</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">4.8</p>
                          <p className="text-amber-600 text-sm font-medium">/ 5.0 rating</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Column - Courses Management */}
                <motion.div
                  className="xl:col-span-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={`${glassStyle} rounded-3xl p-8 h-full`}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                          <DocumentChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Course Portfolio</h2>
                          <p className="text-slate-600 mt-1">
                            {loading ? "Analyzing your content..." : `Masterpiece management for ${stats.totalCourses} courses`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors duration-200"
                        >
                          <CogIcon className="h-5 w-5 text-slate-600" />
                        </motion.button>
                        <div className="flex items-center gap-2">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-2xl font-semibold text-sm"
                          >
                            Live: {stats.activeCourses}
                          </motion.span>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-2xl font-semibold text-sm"
                          >
                            Draft: {stats.draftCourses}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <CourseView />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Creation Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${glassStyle} rounded-3xl p-8`}
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    >
                      <PlusIcon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                      Create Your Next Masterpiece
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                      Choose your creation method and start building transformative learning experiences
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {creationMethods.map((method, index) => (
                      <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <CreationMethodCard {...method} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Templates */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`${glassStyle} rounded-3xl p-8`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Popular Templates</h3>
                      <p className="text-slate-600">Jumpstart your course with proven formats</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold transition-colors"
                    >
                      View All
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: "Bootcamp Style", students: "2.4k", color: "blue" },
                      { name: "Masterclass", students: "1.8k", color: "purple" },
                      { name: "Workshop", students: "1.2k", color: "emerald" },
                      { name: "Certification", students: "3.1k", color: "amber" },
                    ].map((template, index) => (
                      <motion.div
                        key={template.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer group hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate(`/courses/new?template=${template.name.toLowerCase()}`)}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
                          <VideoCameraIcon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-slate-500 text-sm">{template.students} students</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Support Section */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className={`${glassStyle} rounded-3xl overflow-hidden`}>
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                          <LightBulbIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">Elevate Your Teaching</h3>
                      </div>
                      <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                        {stats.totalCourses === 0
                          ? "Join thousands of educators creating transformative learning experiences. Our comprehensive guides and expert support will help you launch your first course with confidence."
                          : `You're managing ${stats.totalCourses} courses like a pro! Explore advanced features to scale your impact and reach more students worldwide.`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-8">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open("/docs/course-creation", "_blank")}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 border border-white/20"
                      >
                        Expert Guides
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/support")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Premium Support
                      </motion.button>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                      { icon: SparklesIcon, text: "AI-Powered Insights" },
                      { icon: TrophyIcon, text: "Certification Tools" },
                      { icon: ShareIcon, text: "Global Distribution" },
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <feature.icon className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </LazyMotion>
  );
}