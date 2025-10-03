import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  PlusIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import courseApi from "../../api/course";

const glassStyle = "bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10";

export default function CreateCourseForm({ onCourseCreated, onCancel }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audience: "",
    duration: "",
    format: "",
    category: "",
    difficulty: "beginner",
    language: "english",
    price: 0,
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  useEffect(() => {
    const aiParam = searchParams.get("ai");
    const method = searchParams.get("method");
    setIsAIEnabled(aiParam === "true" || method === "ai");
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        audience: formData.audience.trim(),
        duration: formData.duration.trim(),
        format: formData.format.trim(),
        category: formData.category.trim(),
        difficulty: formData.difficulty,
        language: formData.language,
        price: Number(formData.price) || 0,
        isPublic: formData.isPublic,
      };

      const result = await courseApi.createCourse(courseData);
      
      setSuccess(true);
      setTimeout(() => {
        if (onCourseCreated) {
          onCourseCreated();
        } else {
          navigate(`/courses/${result.courseId}`);
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/courses");
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                onClick={handleCancel}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-4 bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                  Back
                </span>
              </motion.button>
            </div>

            <div className="text-right">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 sm:gap-3 justify-end mb-1 sm:mb-2"
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                  <AcademicCapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {isAIEnabled ? "AI Course Creator" : "Create Course"}
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 text-sm sm:text-lg"
              >
                {isAIEnabled ? "Let AI help you create an amazing course" : "Design your educational masterpiece"}
              </motion.p>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${glassStyle} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8`}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 sm:py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                  >
                    <CheckIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-4">
                    Course Created Successfully!
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {isAIEnabled 
                      ? "Your AI-generated course is being prepared. You'll be redirected shortly."
                      : "Your course has been created and is ready for editing."
                    }
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* AI Notice */}
                    {isAIEnabled && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <SparklesIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-purple-900 mb-2">AI-Powered Course Creation</h3>
                            <p className="text-purple-700 text-sm sm:text-base">
                              Our AI will analyze your inputs and generate a complete course structure with modules, lessons, quizzes, and assignments automatically.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                      >
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">Basic Information</h3>
                      
                      {/* Course Title */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          placeholder="Enter your course title"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Course Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-none"
                          placeholder="Describe what students will learn in this course"
                        />
                      </div>

                      {/* Two Column Layout for larger screens */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Audience */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Target Audience
                          </label>
                          <input
                            type="text"
                            name="audience"
                            value={formData.audience}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="e.g., Beginners, Professionals"
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="e.g., 4 weeks, 20 hours"
                          />
                        </div>
                      </div>

                      {/* Format and Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Format
                          </label>
                          <select
                            name="format"
                            value={formData.format}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          >
                            <option value="">Select format</option>
                            <option value="video">Video-based</option>
                            <option value="text">Text-based</option>
                            <option value="interactive">Interactive</option>
                            <option value="mixed">Mixed format</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="e.g., Technology, Business"
                          />
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Advanced Settings</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {/* Difficulty */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Difficulty Level
                            </label>
                            <select
                              name="difficulty"
                              value={formData.difficulty}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>

                          {/* Language */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Language
                            </label>
                            <select
                              name="language"
                              value={formData.language}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            >
                              <option value="english">English</option>
                              <option value="spanish">Spanish</option>
                              <option value="french">French</option>
                              <option value="german">German</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Price (USD)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Public/Private */}
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                          />
                          <label className="text-sm font-semibold text-slate-700">
                            Make this course public
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200"
                    >
                      <motion.button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Cancel
                      </motion.button>
                      
                      <motion.button
                        type="submit"
                        disabled={loading || !formData.title.trim()}
                        className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {isAIEnabled ? "Generating with AI..." : "Creating Course..."}
                          </>
                        ) : (
                          <>
                            {isAIEnabled ? (
                              <>
                                <SparklesIcon className="h-4 w-4" />
                                Create with AI
                              </>
                            ) : (
                              <>
                                <PlusIcon className="h-4 w-4" />
                                Create Course
                              </>
                            )}
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </LazyMotion>
  );
}