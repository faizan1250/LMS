import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  BookOpenIcon, 
  ClockIcon, 
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ProgressRing, EnrolledCard, RecommendedCard } from './DashboardComponents';

/**
 * Premium Student Dashboard with luxury glassmorphic design
 * Enhanced with sophisticated visual hierarchy and micro-interactions
 */
export default function StudentDashboard({ user }) {
  const [enrolled, setEnrolled] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // TODO: replace with real endpoints
        const enrolledRes = await fetch('/api/courses?enrolled=true');
        const recRes = await fetch('/api/courses?recommended=true');
        const enrolledData = await enrolledRes.json();
        const recData = await recRes.json();
        if (!mounted) return;
        setEnrolled(enrolledData.courses || []);
        setRecommended(recData.courses || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const overallProgress = Math.round((enrolled.reduce((acc, c) => acc + (c.progress || 0), 0) / Math.max(enrolled.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-amber-50/30 py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/5 to-purple-300/5 rounded-full"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity }
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-r from-amber-400/5 to-amber-200/5 rounded-full"
          animate={{ 
            rotate: -360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity }
          }}
        ></motion.div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.section 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header Section */}
          <motion.header 
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-3xl border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
            }}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 md:mb-0">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Welcome back, {user?.name || 'Student'}!
              </motion.h2>
              <motion.p 
                className="text-sm text-slate-600 mt-2 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ClockIcon className="h-4 w-4 mr-1 text-indigo-500" />
                Last active: 2 hours ago
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-amber-200/50"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                style={{
                  background: 'linear-gradient(145deg, rgba(253, 230, 138, 0.2), rgba(254, 243, 199, 0.15))',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 6px 20px rgba(251, 191, 36, 0.15)',
                }}
              >
                <div className="p-2 bg-amber-400/10 rounded-lg">
                  <SparklesIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Learning Streak</div>
                  <div className="text-sm font-semibold text-slate-800">4 days</div>
                </div>
              </motion.div>
              
              <motion.button 
                className="p-3.5 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowPathIcon className="h-5 w-5 text-slate-600" />
              </motion.button>
            </motion.div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <main className="space-y-8">
              {/* Progress Summary */}
              <motion.div 
                className="p-8 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-2.5 bg-indigo-100 rounded-lg mr-3">
                    <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Overall Learning Progress</h3>
                </div>
                
                <div className="mt-3 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-48 h-48">
                    <ProgressRing value={overallProgress} size={192} strokeWidth={14} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">{overallProgress}%</span>
                      <span className="text-sm text-slate-500 mt-1">Complete</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-6">Average completion of enrolled courses</div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <motion.div 
                        className="p-4 rounded-2xl border border-slate-100 bg-white/80"
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                          <div className="text-xs font-medium text-slate-500">Enrolled Courses</div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-700">{enrolled.length}</div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-2xl border border-slate-100 bg-white/80"
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <div className="text-xs font-medium text-slate-500">Hours Learned</div>
                        </div>
                        <div className="text-2xl font-bold text-amber-700">24.5</div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-2xl border border-slate-100 bg-white/80"
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                          <div className="text-xs font-medium text-slate-500">Certificates</div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-700">3</div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-2xl border border-slate-100 bg-white/80"
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                          <div className="text-xs font-medium text-slate-500">Assignments Due</div>
                        </div>
                        <div className="text-2xl font-bold text-rose-700">2</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enrolled Courses */}
              <motion.div 
                className="p-8 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-indigo-100 rounded-lg mr-3">
                      <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Enrolled Courses</h3>
                  </div>
                  <motion.button 
                    className="text-sm text-indigo-600 font-medium flex items-center group"
                    whileHover={{ x: 3 }}
                  >
                    View all 
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
                
                <div className="mt-3 space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : enrolled.length === 0 ? (
                    <div className="text-center py-10 px-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <AcademicCapIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No enrolled courses yet</p>
                      <p className="text-sm text-slate-400 mt-1">Browse our recommendations to get started</p>
                    </div>
                  ) : (
                    enrolled.map((c, index) => (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <EnrolledCard course={c} />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recommended Courses */}
              <motion.div 
                className="p-8 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-indigo-100 rounded-lg mr-3">
                      <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Recommended for you</h3>
                  </div>
                  <motion.button 
                    className="text-sm text-indigo-600 font-medium flex items-center group"
                    whileHover={{ x: 3 }}
                  >
                    View all 
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {recommended.slice(0, 4).map((c, index) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <RecommendedCard course={c} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </main>

            <aside className="space-y-8">
              {/* Upcoming Events */}
              <motion.div 
                className="p-7 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center mb-5">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800">Upcoming Events</h4>
                </div>
                
                <ul className="mt-3 space-y-4">
                  <motion.li 
                    className="flex items-start p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-2.5 bg-indigo-100 rounded-lg mr-4">
                      <ClockIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">Data Structures Quiz</div>
                      <div className="text-xs text-slate-500 mt-1.5 flex items-center">
                        <span>Tomorrow • 30 minutes</span>
                      </div>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-2.5 bg-amber-100 rounded-lg mr-4">
                      <BookOpenIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">Project Draft Submission</div>
                      <div className="text-xs text-slate-500 mt-1.5">In 3 days • Web Development</div>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-2.5 bg-emerald-100 rounded-lg mr-4">
                      <TrophyIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">Final Exam: Algorithms</div>
                      <div className="text-xs text-slate-500 mt-1.5">Next week • 2 hours</div>
                    </div>
                  </motion.li>
                </ul>
                
                <motion.button 
                  className="w-full mt-5 py-3 text-center text-sm font-medium text-indigo-600 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  whileHover={{ y: -1 }}
                >
                  View Calendar
                </motion.button>
              </motion.div>

              {/* Achievements */}
              <motion.div 
                className="p-7 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center mb-5">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <TrophyIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800">Recent Achievements</h4>
                </div>
                
                <div className="mt-3 space-y-4">
                  <motion.div 
                    className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-50/30"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-500 rounded-lg mr-4">
                        <SparklesIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">First Course Completed</div>
                        <div className="text-xs text-slate-600 mt-1">You finished your first course!</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-amber-50/30"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-amber-500 rounded-lg mr-4">
                        <TrophyIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Quiz Master</div>
                        <div className="text-xs text-slate-600 mt-1">5 quizzes with 90%+ accuracy</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/30"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-emerald-500 rounded-lg mr-4">
                        <BookOpenIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Consistent Learner</div>
                        <div className="text-xs text-slate-600 mt-1">7 days of active learning</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="p-7 rounded-3xl border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h4 className="text-lg font-semibold text-slate-800 mb-5">Weekly Performance</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "7.5", label: "Hours", color: "indigo" },
                    { value: "12", label: "Lessons", color: "amber" },
                    { value: "3", label: "Quizzes", color: "slate" },
                    { value: "92%", label: "Avg. Score", color: "emerald" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-100 text-center"
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <div className={`text-2xl font-bold text-${stat.color}-700 mb-1`}>{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Weekly goal</span>
                    <span className="font-medium text-slate-800">75% completed</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </motion.section>
      </div>
    </div>
  );
}