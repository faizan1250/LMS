// frontend/src/components/courses/CourseView.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  TrophyIcon,
  LightBulbIcon,
  BookOpenIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PuzzlePieceIcon,
  CogIcon,
  ChartPieIcon,
  UsersIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import courseApi from '../../api/course';
import PublishCourseButton from './PublishCourseButton';
import DeleteCourseButton from './DeleteCourseButton';

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

// Premium Skeleton Loader
const PremiumSkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 p-8"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-4 flex-1">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-3/4 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-1/2 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-2/3 animate-pulse" />
      </div>
      <div className="h-12 bg-slate-200 rounded-2xl w-32 ml-6 animate-pulse" />
    </div>
    <div className="grid grid-cols-3 gap-4 mt-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  </motion.div>
);

// Enhanced Stats Component
const PremiumStatCard = ({ icon: Icon, label, value, color = "primary", trend }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className={`${glassStyle} rounded-3xl p-6 relative overflow-hidden group cursor-pointer`}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full" />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-600 mb-2">{label}</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {value}
        </p>
        {trend && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center mt-2 text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </motion.div>
        )}
      </div>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`p-3 rounded-2xl bg-gradient-to-br from-${premiumColors[color][500]} to-${premiumColors[color][600]} shadow-lg`}
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

// Enhanced Module Card with 3D effects
const PremiumModuleCard = ({ module, index, isOpen, onToggle, courseStatus }) => {
  const lessonCount = module.lessons?.length || 0;
  const quizCount = module.quiz?.questions?.length || 0;
  const passPercent = module.quiz?.passPercent ?? 75;
  const isComplete = lessonCount >= 5 && quizCount >= 10;
  const hasAssignment = module.lessons?.some(lesson => lesson.assignment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-3xl border-2 ${
        isComplete 
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-green-50/40' 
          : 'border-amber-200 bg-gradient-to-br from-amber-50/40 to-orange-50/30'
      } overflow-hidden group hover:shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <motion.button
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={onToggle}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Module Number with Status */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                isComplete 
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                  : 'bg-gradient-to-br from-amber-500 to-orange-500'
              }`}
            >
              {index + 1}
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                {!isComplete && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    Incomplete
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{lessonCount} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  <span>{quizCount} quiz questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  <span>Pass: {passPercent}%</span>
                </div>
                {hasAssignment && (
                  <div className="flex items-center gap-2">
                    <PuzzlePieceIcon className="h-4 w-4" />
                    <span>Includes assignment</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Module completion</span>
                  <span>{Math.min(100, (lessonCount / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (lessonCount / 5) * 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-2 rounded-full ${
                      isComplete ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-xl bg-white/60 group-hover:bg-white/80 transition-colors"
          >
            <ChevronDownIcon className="h-5 w-5 text-slate-600" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200/60"
          >
            <div className="p-6 space-y-6">
              {/* Lessons Section */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-slate-900">Lessons</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {lessonCount} lessons
                  </span>
                </div>

                {lessonCount === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <BookOpenIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No lessons created yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <PremiumLessonCard 
                        key={lesson._id || `${lesson.title}-${lessonIndex}`} 
                        lesson={lesson} 
                        index={lessonIndex}
                        courseStatus={courseStatus}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Quiz Section */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-slate-900">Module Quiz</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {quizCount} questions • Pass {passPercent}%
                  </span>
                </div>

                {quizCount === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No quiz configured</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(module.quiz.questions || []).slice(0, 5).map((question, qIndex) => (
                      <PremiumQuestionCard key={qIndex} question={question} index={qIndex} />
                    ))}
                    {quizCount > 5 && (
                      <div className="text-center pt-4">
                        <span className="text-sm text-slate-500">
                          + {quizCount - 5} more questions
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Premium Lesson Card
const PremiumLessonCard = ({ lesson, index, courseStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasResources = Array.isArray(lesson.resources) && lesson.resources.length > 0;
  const hasAssignment = lesson.assignment;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Lesson Number */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-slate-900 mb-2">{lesson.title}</h5>
            
            {lesson.description && (
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                {lesson.description}
              </p>
            )}

            {/* Content Preview */}
            {!lesson.description && lesson.content && (
              <div className="text-slate-500 text-sm italic">
                {typeof lesson.content === 'string' 
                  ? (lesson.content.length > 150 ? lesson.content.substring(0, 150) + '...' : lesson.content)
                  : 'Content available'
                }
              </div>
            )}

            {/* Tags */}
            <div className="flex items-center gap-2 mt-3">
              {hasResources && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  <LinkIcon className="h-3 w-3" />
                  Resources
                </span>
              )}
              {hasAssignment && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                  <PuzzlePieceIcon className="h-3 w-3" />
                  Assignment
                </span>
              )}
              {lesson.videoUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                  <VideoCameraIcon className="h-3 w-3" />
                  Video
                </span>
              )}
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  {/* Full Description */}
                  {lesson.description && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">
                        {lesson.description}
                      </p>
                    </div>
                  )}

                  {/* Resources */}
                  {hasResources && (
                    <div>
                      <h6 className="font-medium text-slate-700 mb-2 text-sm">Resources</h6>
                      <div className="flex flex-wrap gap-2">
                        {lesson.resources.map((resource, resIndex) => {
                          const label = resource?.title || resource?.label || resource?.url || 'Resource';
                          const url = resource?.url || resource;
                          return (
                            <motion.a
                              key={resIndex}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              whileHover={{ scale: 1.05 }}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-sm"
                            >
                              <LinkIcon className="h-4 w-4" />
                              <span className="max-w-[200px] truncate">{label}</span>
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Assignment */}
                  {hasAssignment && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-3">
                        <PuzzlePieceIcon className="h-5 w-5 text-indigo-600" />
                        <h6 className="font-semibold text-indigo-900">Assignment</h6>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h6 className="font-medium text-indigo-800 mb-1">
                            {lesson.assignment.title || 'Untitled Assignment'}
                          </h6>
                          {lesson.assignment.description && (
                            <p className="text-indigo-700 text-sm whitespace-pre-wrap">
                              {lesson.assignment.description}
                            </p>
                          )}
                        </div>
                        {Array.isArray(lesson.assignment.criteria) && lesson.assignment.criteria.length > 0 && (
                          <div>
                            <h6 className="font-medium text-indigo-800 mb-2 text-sm">Grading Criteria</h6>
                            <ul className="space-y-1">
                              {lesson.assignment.criteria.map((criterion, critIndex) => (
                                <li key={critIndex} className="flex items-center gap-2 text-indigo-700 text-sm">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                  {criterion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </motion.button>
          {courseStatus === 'published' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <PlayCircleIcon className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Premium Question Card
const PremiumQuestionCard = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-white rounded-2xl border border-slate-200/60 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </span>
            <h6 className="font-semibold text-slate-900 text-sm">
              {question.prompt || question.question || 'Untitled Question'}
            </h6>
          </div>

          {/* Options */}
          <div className="grid gap-2 ml-9">
            {(question.options || []).map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                  showAnswer && Number.isInteger(question.answerIndex) && optIndex === question.answerIndex
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                  showAnswer && Number.isInteger(question.answerIndex) && optIndex === question.answerIndex
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300'
                }`}>
                  {String.fromCharCode(65 + optIndex)}
                </div>
                <span>{typeof option === 'string' ? option : JSON.stringify(option)}</span>
                {showAnswer && Number.isInteger(question.answerIndex) && optIndex === question.answerIndex && (
                  <CheckCircleIcon className="h-4 w-4 text-emerald-500 ml-auto" />
                )}
              </div>
            ))}
          </div>

          {/* Answer Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnswer(!showAnswer)}
            className="ml-9 mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs font-medium transition-colors"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CourseView({ courseId: propCourseId }) {
  const params = useParams();
  const courseId = propCourseId || params.courseId || params.id || null;
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [coursesList, setCoursesList] = useState(null);
  const [error, setError] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const toggleModule = (idx) => setOpenModules((s) => ({ ...s, [idx]: !s[idx] }));

  const loadSingle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getCourse(id);
      setCourseData(res);
      setCoursesList(null);
      // Expand first module by default
      setOpenModules({ 0: true });
    } catch (err) {
      setCourseData(null);
      setError(err?.response?.data?.error || err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getCourses({ mine: true });
      setCoursesList(res.courses || []);
      setCourseData(null);
    } catch (err) {
      setCoursesList(null);
      setError(err?.response?.data?.error || err.message || 'Failed to load courses list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadSingle(courseId);
    else loadList();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <PremiumSkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Unable to Load Course</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (courseId ? loadSingle(courseId) : loadList())}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Single Course View
  if (courseData?.course) {
    const { course, generated } = courseData;
    const totalLessons = (course.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const totalQuizQs = (course.modules || []).reduce((s, m) => s + (m.quiz?.questions?.length || 0), 0);
    const completedModules = (course.modules || []).filter(m => 
      (m.lessons?.length || 0) >= 5 && (m.quiz?.questions?.length || 0) >= 10
    ).length;

    const StatusBadge = () => {
      const statusConfig = {
        published: {
          class: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25',
          icon: <ShieldCheckIcon className="h-5 w-5" />,
          label: 'Published'
        },
        draft: {
          class: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
          icon: <PencilIcon className="h-5 w-5" />,
          label: 'Draft'
        }
      };
      const config = statusConfig[course.status] || statusConfig.draft;

      return (
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold ${config.class}`}
        >
          {config.icon}
          <span>{config.label}</span>
        </motion.span>
      );
    };

    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6" ref={containerRef}>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Premium Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className={`${glassStyle} rounded-3xl p-8 relative overflow-hidden`}
            >
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full translate-y-24 -translate-x-24" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <StatusBadge />
                      <div className="flex items-center gap-6 text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          <span className="font-medium">Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                        {course.students && (
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5" />
                            <span className="font-medium">{course.students.length} students enrolled</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                      {course.title}
                    </h1>
                    
                    <p className="text-xl text-slate-600 leading-relaxed max-w-4xl">
                      {course.description || (course.aiGenerated 
                        ? 'AI-drafted course ready for your review and customization. Edit or publish when ready.' 
                        : 'No description provided. Add a compelling description to attract students.'
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 ml-8">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/courses/${course._id}/edit`)}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>Edit Course</span>
                    </motion.button>

                    <PublishCourseButton 
                      courseId={course._id} 
                      onSuccess={() => loadSingle(course._id)} 
                      className="w-full"
                    />
                    <DeleteCourseButton 
                      courseId={course._id} 
                      onDeleted={() => navigate('/dashboard')} 
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <PremiumStatCard
                    icon={BookOpenIcon}
                    label="Total Modules"
                    value={course.modules?.length || 0}
                    color="primary"
                  />
                  <PremiumStatCard
                    icon={AcademicCapIcon}
                    label="Lessons"
                    value={totalLessons}
                    color="accent"
                  />
                  <PremiumStatCard
                    icon={QuestionMarkCircleIcon}
                    label="Quiz Questions"
                    value={totalQuizQs}
                    color="success"
                  />
                  <PremiumStatCard
                    icon={TrophyIcon}
                    label="Completed Modules"
                    value={completedModules}
                    trend={course.modules?.length ? Math.round((completedModules / course.modules.length) * 100) : 0}
                    color="warning"
                  />
                </div>
              </div>
            </motion.div>

            {/* Modules Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${glassStyle} rounded-3xl p-8`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Course Curriculum</h2>
                    <p className="text-slate-600">Manage and organize your course content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xl font-medium">
                    {course.modules?.length || 0} modules
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                  >
                    <CogIcon className="h-5 w-5 text-slate-600" />
                  </motion.button>
                </div>
              </div>

              {Array.isArray(course.modules) && course.modules.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {course.modules.map((module, index) => (
                      <PremiumModuleCard
                        key={module._id || `${module.title}-${module.order}`}
                        module={module}
                        index={index}
                        isOpen={openModules[index]}
                        onToggle={() => toggleModule(index)}
                        courseStatus={course.status}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <BookOpenIcon className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No Modules Created</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    {course.aiGenerated 
                      ? 'AI is generating your course content...' 
                      : 'Start building your course by adding modules and lessons'
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/courses/${course._id}/edit`)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create First Module
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* AI Generation Panel */}
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`${glassStyle} rounded-3xl p-8`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                    <RocketLaunchIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">AI Generation Analytics</h3>
                    <p className="text-slate-600">Detailed insights from your AI course creation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Generation Status</div>
                    <div className={`text-lg font-bold ${
                      generated.status === 'done' ? 'text-emerald-600' : 
                      generated.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {generated.status?.charAt(0).toUpperCase() + generated.status?.slice(1) || 'Unknown'}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Created Date</div>
                    <div className="text-lg font-bold text-slate-900">
                      {generated.createdAt ? new Date(generated.createdAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Modules Generated</div>
                    <div className="text-lg font-bold text-slate-900">{course.modules?.length || 0}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">AI Provider</div>
                    <div className="text-lg font-bold text-slate-900">OpenAI GPT-4</div>
                  </div>
                </div>

                {/* Error Display */}
                {generated.parseError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-3 text-red-800 mb-3">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <span className="font-semibold">Parse Error Detected</span>
                    </div>
                    <code className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded-xl block">
                      {generated.parseError}
                    </code>
                  </motion.div>
                )}

                {Array.isArray(generated.validationErrors) && generated.validationErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-3 text-amber-800 mb-3">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <span className="font-semibold">Validation Issues ({generated.validationErrors.length})</span>
                    </div>
                    <div className="space-y-2">
                      {generated.validationErrors.slice(0, 5).map((error, i) => (
                        <div key={i} className="text-sm text-amber-700">
                          <code className="bg-amber-100 px-2 py-1 rounded-lg">
                            {(error.instancePath || error.dataPath || '').toString()}: {error.message}
                          </code>
                        </div>
                      ))}
                      {generated.validationErrors.length > 5 && (
                        <div className="text-amber-600 text-sm">
                          + {generated.validationErrors.length - 5} more issues
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Raw Output */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-900 rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-slate-800">
                    <div className="flex items-center gap-2 text-slate-200">
                      <ChartPieIcon className="h-5 w-5" />
                      <span className="font-semibold">Raw AI Output</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <pre className="text-slate-200 text-sm overflow-auto max-h-64 font-mono">
                      {typeof generated.rawOutput === 'string'
                        ? generated.rawOutput
                        : JSON.stringify(generated.rawOutput, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </LazyMotion>
    );
  }

  // Courses List View
  if (Array.isArray(coursesList)) {
    if (coursesList.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AcademicCapIcon className="h-16 w-16 text-slate-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">No Courses Yet</h2>
              <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
                Start your educational journey by creating your first premium course
              </p>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/courses/new')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-200 inline-flex items-center gap-3"
              >
                <RocketLaunchIcon className="h-6 w-6" />
                <span>Create Your First Course</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                My Courses
              </h1>
              <p className="text-slate-600 text-lg mt-2">Manage and track all your educational content</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/courses/new')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              + New Course
            </motion.button>
          </motion.div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursesList.map((course, index) => {
              const lessonCount = (course.modules || []).reduce((s, m) => s + (m.lessons?.length || 0), 0);
              const quizQs = (course.modules || []).reduce((s, m) => s + (m.quiz?.questions?.length || 0), 0);
              const completedModules = (course.modules || []).filter(m => 
                (m.lessons?.length || 0) >= 5 && (m.quiz?.questions?.length || 0) >= 10
              ).length;

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`${glassStyle} rounded-3xl p-6 cursor-pointer group relative overflow-hidden`}
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  {/* Background Effect */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-2xl text-sm font-semibold ${
                            course.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {course.status}
                          </span>
                          {course.aiGenerated && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              AI Generated
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">
                          {course.description || 'No description provided'}
                        </p>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-500 text-white rounded-xl ml-4"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </motion.div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">{course.modules?.length || 0}</div>
                        <div className="text-xs text-slate-500">Modules</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">{lessonCount}</div>
                        <div className="text-xs text-slate-500">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">{completedModules}</div>
                        <div className="text-xs text-slate-500">Complete</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(course.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <QuestionMarkCircleIcon className="h-4 w-4" />
                          <span>{quizQs} Qs</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.aiGenerated && (
                          <SparklesIcon className="h-4 w-4 text-purple-500" />
                        )}
                        <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-6">
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AcademicCapIcon className="h-16 w-16 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Course Not Found</h2>
        <p className="text-xl text-slate-600 mb-8">The requested course could not be loaded</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg"
        >
          Back to Courses
        </motion.button>
      </div>
    </div>
  );
}