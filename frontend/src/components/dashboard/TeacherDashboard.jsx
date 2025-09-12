// import React, { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { 
//   PlusIcon, 
//   MagnifyingGlassIcon, 
//   BookOpenIcon, 
//   ClockIcon, 
//   ChartBarIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   TrashIcon,
//   PencilSquareIcon,
//   ArrowPathIcon,
//   SparklesIcon
// } from '@heroicons/react/24/outline';
// import CreateCourseForm from '../teacher/CreateCourseForm';
// import courseApi from '../../api/course';

// /**
//  * Premium Teacher Dashboard with glassomorphic design
//  *
//  * Props:
//  * - user: { id, name, email, role }
//  */
// export default function TeacherDashboard({ user }) {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [creatingPreview, setCreatingPreview] = useState(null);
//   const [error, setError] = useState(null);
//   const [query, setQuery] = useState('');
//   const [busyCourseId, setBusyCourseId] = useState(null);
//   const navigate = useNavigate();

//   // load owned courses via courseApi.listOwned()
//   const loadOwned = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const owned = await courseApi.listOwned();
//       setCourses(Array.isArray(owned) ? owned : []);
//     } catch (err) {
//       console.error('Failed to load owned courses', err);
//       setError('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       if (!mounted) return;
//       await loadOwned();
//     })();
//     return () => { mounted = false; };
//   }, []);

//   const visible = useMemo(() => {
//     if (!query) return courses;
//     const q = query.toLowerCase();
//     return courses.filter((c) => (c.title || '').toLowerCase().includes(q));
//   }, [courses, query]);

//   // callback used by CreateCourseForm onCreated
//   const onCourseCreated = async ({ courseId, title }) => {
//     const preview = {
//       _id: courseId,
//       title: title || 'Untitled course',
//       status: 'draft',
//       aiGenerated: false,
//       createdAt: new Date().toISOString(),
//       description: ''
//     };
//     setCreatingPreview(preview);
//     setCourses((s) => [preview, ...s]);

//     navigate(`/courses/${courseId}/edit`);
//     setTimeout(() => {
//       loadOwned().catch(() => {});
//     }, 800);
//   };

//   const handlePublish = async (courseId) => {
//     setBusyCourseId(courseId);
//     setError(null);
//     try {
//       await courseApi.publishCourse(courseId);
//       await loadOwned();
//     } catch (err) {
//       console.error(err);
//       setError('Publish failed');
//     } finally {
//       setBusyCourseId(null);
//     }
//   };

//   const handleDelete = async (courseId) => {
//     if (!confirm('Delete this course? This cannot be undone.')) return;
//     setBusyCourseId(courseId);
//     setError(null);
//     try {
//       await courseApi.deleteCourse(courseId);
//       await loadOwned();
//       if (creatingPreview && creatingPreview._id === courseId) setCreatingPreview(null);
//     } catch (err) {
//       console.error(err);
//       setError('Delete failed');
//     } finally {
//       setBusyCourseId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f5f7ff] to-[#e8eeff] py-8 px-4">
//       {/* Background elements */}
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/10 to-[#C6A96C]/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#0A1428]/10 to-[#4660d9]/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <motion.section 
//           className="space-y-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* Header / quick actions */}
//           <motion.div 
//             className="flex items-center justify-between p-6 rounded-2xl"
//             style={{
//               background: 'rgba(255, 255, 255, 0.7)',
//               backdropFilter: 'blur(12px)',
//               WebkitBackdropFilter: 'blur(12px)',
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//             }}
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Panel</h2>
//               <p className="text-sm text-gray-600 mt-1">Manage your courses, monitor AI drafts, and publish when ready.</p>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="hidden md:block">
//                 <CreateCourseForm onCreated={(payload) => onCourseCreated(payload)} />
//               </div>

//               <div className="block md:hidden">
//                 <motion.button
//                   onClick={() => navigate('/teacher/create')}
//                   className="px-4 py-2 rounded-xl font-medium flex items-center"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   style={{
//                     background: 'linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)',
//                     boxShadow: '0 4px 15px rgba(90, 127, 241, 0.3)',
//                   }}
//                 >
//                   <PlusIcon className="h-5 w-5 text-white" />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Stats */}
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-3 gap-4"
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <StatCard 
//               title="Courses" 
//               value={courses.length} 
//               subtitle="Total in your account" 
//               icon={<BookOpenIcon className="h-6 w-6" />}
//               color="from-[#5A7FF1] to-[#4660d9]"
//             />
//             <StatCard 
//               title="Drafts" 
//               value={courses.filter(c => c.status === 'draft').length} 
//               subtitle="Awaiting review" 
//               icon={<EyeSlashIcon className="h-6 w-6" />}
//               color="from-[#C6A96C] to-[#8B6122]"
//             />
//             <StatCard 
//               title="Published" 
//               value={courses.filter(c => c.status === 'published').length} 
//               subtitle="Live students" 
//               icon={<EyeIcon className="h-6 w-6" />}
//               color="from-[#0A1428] to-[#4660d9]"
//             />
//           </motion.div>

//           {/* Main area */}
//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
//             <div className="space-y-6">
//               <motion.div 
//                 className="p-6 rounded-2xl flex items-center justify-between"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.7)',
//                   backdropFilter: 'blur(12px)',
//                   WebkitBackdropFilter: 'blur(12px)',
//                   boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//                 }}
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="relative flex-1 max-w-md">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                     <input
//                       className="pl-10 pr-4 py-3 rounded-xl w-full focus:outline-none"
//                       placeholder="Search courses by title..."
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       style={{
//                         background: 'rgba(255, 255, 255, 0.5)',
//                         backdropFilter: 'blur(10px)',
//                         WebkitBackdropFilter: 'blur(10px)',
//                         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
//                       }}
//                     />
//                   </div>
//                   <div className="text-sm text-gray-600">Showing <strong>{visible.length}</strong></div>
//                 </div>
//                 <div className="text-sm text-gray-600 hidden md:block">
//                   Last synced: <strong>{new Date().toLocaleTimeString()}</strong>
//                 </div>
//               </motion.div>

//               {loading ? (
//                 <motion.div 
//                   className="p-6 rounded-2xl text-center"
//                   style={{
//                     background: 'rgba(255, 255, 255, 0.7)',
//                     backdropFilter: 'blur(12px)',
//                     WebkitBackdropFilter: 'blur(12px)',
//                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//                   }}
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                 >
//                   <div className="flex justify-center">
//                     <ArrowPathIcon className="h-6 w-6 text-[#5A7FF1] animate-spin" />
//                   </div>
//                   <p className="text-gray-600 mt-2">Loading courses…</p>
//                 </motion.div>
//               ) : visible.length === 0 ? (
//                 <motion.div 
//                   className="p-6 rounded-2xl text-center"
//                   style={{
//                     background: 'rgba(255, 255, 255, 0.7)',
//                     backdropFilter: 'blur(12px)',
//                     WebkitBackdropFilter: 'blur(12px)',
//                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//                   }}
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                 >
//                   <div className="bg-gradient-to-br from-[#5A7FF1]/10 to-[#0A1428]/10 p-4 rounded-2xl inline-flex mb-4">
//                     <BookOpenIcon className="h-8 w-8 text-[#5A7FF1]" />
//                   </div>
//                   <p className="text-gray-700 mb-2">No courses yet.</p>
//                   <p className="text-sm text-gray-600">Create a course and let the AI draft the syllabus for you.</p>
//                 </motion.div>
//               ) : (
//                 <motion.div 
//                   className="space-y-4"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                 >
//                   <AnimatePresence>
//                     {visible.map((c) => (
//                       <CourseCard
//                         key={c._id}
//                         course={c}
//                         onPublish={() => handlePublish(c._id)}
//                         onDelete={() => handleDelete(c._id)}
//                         busy={busyCourseId === c._id}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </motion.div>
//               )}

//               {error && (
//                 <motion.div 
//                   className="p-4 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                 >
//                   {error}
//                 </motion.div>
//               )}
//             </div>

//             <aside className="space-y-6">
//               {/* Compact create panel for sidebar */}
//               <motion.div 
//                 className="p-6 rounded-2xl"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.7)',
//                   backdropFilter: 'blur(12px)',
//                   WebkitBackdropFilter: 'blur(12px)',
//                   boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//                 }}
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//               >
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <SparklesIcon className="h-5 w-5 text-[#5A7FF1] mr-2" />
//                   Create Course
//                 </h4>
//                 <div className="md:hidden">
//                   <CreateCourseForm onCreated={(payload) => onCourseCreated(payload)} />
//                 </div>
//                 <p className="text-sm text-gray-600 mt-3">AI generation happens in background. You can edit the draft later.</p>
//               </motion.div>

//               <motion.div 
//                 className="p-6 rounded-2xl"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.7)',
//                   backdropFilter: 'blur(12px)',
//                   WebkitBackdropFilter: 'blur(12px)',
//                   boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//                 }}
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.5 }}
//               >
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h4>
//                 <ul className="mt-3 space-y-3">
//                   {[
//                     { action: "Draft created", title: "Intro to AI", time: "10m ago" },
//                     { action: "Published", title: "Time Management", time: "2d ago" },
//                     { action: "AI generation failed", title: "Quantum Cooking", time: "1w ago" },
//                   ].map((item, index) => (
//                     <li key={index} className="flex items-start p-3 rounded-xl bg-white/50">
//                       <div className="bg-[#5A7FF1] p-1 rounded-lg mr-3 mt-0.5">
//                         <ClockIcon className="h-4 w-4 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{item.action}: <span className="text-[#5A7FF1]">{item.title}</span></div>
//                         <div className="text-xs text-gray-500 mt-1">{item.time}</div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </aside>
//           </div>
//         </motion.section>
//       </div>
//     </div>
//   );
// }

// /* ---------------- subcomponents ---------------- */

// function StatCard({ title, value, subtitle, icon, color }) {
//   return (
//     <motion.div 
//       className="p-6 rounded-2xl flex items-center justify-between"
//       style={{
//         background: 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(12px)',
//         WebkitBackdropFilter: 'blur(12px)',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//       }}
//       whileHover={{ y: -5 }}
//     >
//       <div>
//         <div className="text-sm text-gray-600">{title}</div>
//         <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
//         <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
//       </div>
//       <div className={`bg-gradient-to-br ${color} p-3 rounded-xl text-white`}>
//         {icon}
//       </div>
//     </motion.div>
//   );
// }

// function CourseCard({ course, onPublish, onDelete, busy }) {
//   const navigate = useNavigate();
//   const status = course.status || 'draft';
  
//   return (
//     <motion.div 
//       className="p-6 rounded-2xl flex items-start justify-between"
//       style={{
//         background: 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(12px)',
//         WebkitBackdropFilter: 'blur(12px)',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
//       }}
//       whileHover={{ y: -2 }}
//       layout
//     >
//       <div className="flex-1">
//         <div className="flex items-start justify-between gap-3 mb-3">
//           <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
//           <div className={`text-xs px-3 py-1 rounded-full ${status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
//             {status}
//           </div>
//         </div>
        
//         <div className="flex items-center text-sm text-gray-500 mb-3">
//           <ClockIcon className="h-4 w-4 mr-1" />
//           Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}
//           {course.aiGenerated && (
//             <span className="ml-3 flex items-center">
//               <SparklesIcon className="h-4 w-4 mr-1 text-amber-500" />
//               AI Generated
//             </span>
//           )}
//         </div>
        
//         <p className="text-sm text-gray-600 mb-4">
//           {course.description || (course.aiGenerated ? 'AI drafted course — edit to refine.' : 'Draft — no description yet.')}
//         </p>
        
//         {course.generated && course.generated.validationErrors && course.generated.validationErrors.length > 0 && (
//           <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
//             AI validation issues: {course.generated.validationErrors.length} errors
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col items-end gap-3 ml-4 min-w-[120px]">
//         <motion.button
//           onClick={() => navigate(`/courses/${course._id}/edit`)}
//           className="px-4 py-2 rounded-xl text-sm font-medium flex items-center w-full justify-center"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           style={{
//             background: 'rgba(255, 255, 255, 0.8)',
//             backdropFilter: 'blur(10px)',
//             WebkitBackdropFilter: 'blur(10px)',
//             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
//           }}
//         >
//           <PencilSquareIcon className="h-4 w-4 mr-1" />
//           Edit
//         </motion.button>

//         {status === 'draft' ? (
//           <motion.button
//             onClick={onPublish}
//             disabled={busy}
//             className="px-4 py-2 rounded-xl text-sm font-medium flex items-center w-full justify-center"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             style={{
//               background: 'linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)',
//               boxShadow: '0 4px 15px rgba(90, 127, 241, 0.3)',
//             }}
//           >
//             {busy ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : 'Publish'}
//           </motion.button>
//         ) : (
//           <motion.button
//             onClick={onPublish}
//             disabled={busy}
//             className="px-4 py-2 rounded-xl text-sm font-medium flex items-center w-full justify-center"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             style={{
//               background: 'rgba(255, 255, 255, 0.8)',
//               backdropFilter: 'blur(10px)',
//               WebkitBackdropFilter: 'blur(10px)',
//               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
//             }}
//           >
//             Unpublish
//           </motion.button>
//         )}

//         <motion.button
//           onClick={onDelete}
//           disabled={busy}
//           className="px-4 py-2 rounded-xl text-sm font-medium flex items-center w-full justify-center text-red-600"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           style={{
//             background: 'rgba(255, 255, 255, 0.8)',
//             backdropFilter: 'blur(10px)',
//             WebkitBackdropFilter: 'blur(10px)',
//             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
//           }}
//         >
//           <TrashIcon className="h-4 w-4 mr-1" />
//           Delete
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }



import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Teacher Dashboard</h1>
        <div className="flex gap-6">
          <button onClick={() => navigate("/course")} className="hover:underline">
            Courses
          </button>
          <button onClick={() => navigate("/assignments")} className="hover:underline">
            Assignments
          </button>
          <button onClick={() => navigate("/tests")} className="hover:underline">
            Tests
          </button>
          <button onClick={() => navigate("/analytics")} className="hover:underline">
            Analytics
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome, Teacher!</h2>
        <p className="text-gray-700">
          Use the navigation bar to manage your courses, assignments, tests, and analytics.
        </p>
      </main>
    </div>
  );
}
