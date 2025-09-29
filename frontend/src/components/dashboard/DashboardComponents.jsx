

// // DashboardComponents.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   PlayIcon, 
//   ArrowRightIcon, 
//   BookOpenIcon, 
//   ClockIcon,
//   ChartBarIcon,
//   AcademicCapIcon
// } from '@heroicons/react/24/outline';

// // Enhanced Progress Ring with better UX
// export function ProgressRing({ 
//   value = 0, 
//   size = 120,
//   strokeWidth = 8,
//   label = "Progress",
//   showLabel = true 
// }) {
//   const radius = (size - strokeWidth) / 2;
//   const normalized = Math.min(100, Math.max(0, value));
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (normalized / 100) * circumference;
  
//   // Color based on progress
//   const getProgressColor = (progress) => {
//     if (progress >= 90) return '#10B981'; // Green
//     if (progress >= 70) return '#3B82F6'; // Blue  
//     if (progress >= 50) return '#F59E0B'; // Amber
//     return '#EF4444'; // Red
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="relative" role="progressbar" aria-valuenow={normalized} aria-valuemin="0" aria-valuemax="100">
//         <svg 
//           width={size} 
//           height={size} 
//           viewBox={`0 0 ${size} ${size}`}
//           className="transform -rotate-90"
//         >
//           {/* Background circle */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="#E5E7EB"
//             strokeWidth={strokeWidth}
//             fill="none"
//           />
//           {/* Progress circle */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke={getProgressColor(normalized)}
//             strokeWidth={strokeWidth}
//             strokeLinecap="round"
//             strokeDasharray={circumference}
//             strokeDashoffset={strokeDashoffset}
//             fill="none"
//             className="transition-all duration-500 ease-out"
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-2xl font-bold text-gray-900">{`${normalized}%`}</span>
//           {showLabel && (
//             <span className="text-xs text-gray-500 mt-1">{label}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Enhanced Enrolled Card with better information architecture
// export function EnrolledCard({ course, isLoading = false }) {
//   if (isLoading) {
//     return <EnrolledCardSkeleton />;
//   }

//   const progress = Math.round((course.progress || 0) * 100);
  
//   return (
//     <motion.div 
//       className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-100"
//       whileHover={{ y: -4 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       role="article"
//       aria-label={`Course: ${course.title}, Progress: ${progress}%`}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex-1 min-w-0">
//           <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
//             {course.title}
//           </h3>
//           <div className="flex items-center mt-2 text-sm text-gray-600">
//             <BookOpenIcon className="h-4 w-4 mr-1" />
//             <span>{course.modules || 0} modules</span>
//             <span className="mx-2">•</span>
//             <ClockIcon className="h-4 w-4 mr-1" />
//             <span>{course.duration || 'Self-paced'}</span>
//           </div>
//         </div>
        
//         <div className="ml-4 flex-shrink-0">
//           <ProgressRing value={progress} size={60} strokeWidth={6} showLabel={false} />
//         </div>
//       </div>

//       {/* Enhanced Progress Bar */}
//       <div className="mb-4">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>Course progress</span>
//           <span className="font-medium text-gray-900">{progress}%</span>
//         </div>
//         <div className="w-full bg-gray-100 rounded-full h-3">
//           <motion.div 
//             className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
//             initial={{ width: 0 }}
//             animate={{ width: `${progress}%` }}
//             transition={{ duration: 1, ease: "easeOut" }}
//           />
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="text-sm text-gray-500">
//           Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : 'Never'}
//         </div>
        
//         <motion.button 
//           className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           aria-label={`Continue ${course.title}`}
//         >
//           <PlayIcon className="h-4 w-4" />
//           <span>Continue</span>
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// // Enhanced Recommended Card with better CTAs
// export function RecommendedCard({ course, isLoading = false }) {
//   if (isLoading) {
//     return <RecommendedCardSkeleton />;
//   }

//   return (
//     <motion.div 
//       className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-100 overflow-hidden"
//       whileHover={{ y: -4 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       role="article"
//     >
//       {/* Header with image/icon */}
//       <div className="relative mb-4">
//         <div className="h-40 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300 flex items-center justify-center">
//           <div className="bg-blue-500 p-4 rounded-2xl text-white transform group-hover:scale-110 transition-transform duration-300">
//             <AcademicCapIcon className="h-8 w-8" />
//           </div>
//         </div>
        
//         {/* Difficulty badge */}
//         {course.difficulty && (
//           <div className="absolute top-3 right-3">
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//               course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
//               course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
//               'bg-red-100 text-red-800'
//             }`}>
//               {course.difficulty}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
//           {course.title}
//         </h3>
//         <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
//           {course.description || 'Start your learning journey with this comprehensive course.'}
//         </p>
//       </div>

//       {/* Metadata */}
//       <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center">
//             <ClockIcon className="h-4 w-4 mr-1" />
//             <span>{course.duration || 'Self-paced'}</span>
//           </div>
//           <div className="flex items-center">
//             <ChartBarIcon className="h-4 w-4 mr-1" />
//             <span>{course.rating || '4.5'}/5</span>
//           </div>
//         </div>
        
//         {course.category && (
//           <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
//             {course.category}
//           </span>
//         )}
//       </div>

//       {/* CTA */}
//       <motion.button 
//         className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 group/btn"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         aria-label={`Enroll in ${course.title}`}
//       >
//         <span>Enroll Now</span>
//         <ArrowRightIcon className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
//       </motion.button>
//     </motion.div>
//   );
// }

// // Skeleton Loaders
// function EnrolledCardSkeleton() {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex-1 min-w-0">
//           <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         </div>
//         <div className="ml-4 w-15 h-15 bg-gray-200 rounded-full"></div>
//       </div>
//       <div className="mb-4">
//         <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//         <div className="h-3 bg-gray-200 rounded w-full"></div>
//       </div>
//       <div className="flex justify-between">
//         <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//         <div className="h-10 bg-gray-200 rounded w-1/4"></div>
//       </div>
//     </div>
//   );
// }

// function RecommendedCardSkeleton() {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
//       <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
//       <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//       <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//       <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
//       <div className="h-10 bg-gray-200 rounded w-full"></div>
//     </div>
//   );
// }

// DashboardComponents.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  ArrowRightIcon, 
  BookOpenIcon, 
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Premium Progress Ring
export function ProgressRing({ 
  value = 0, 
  size = 120,
  strokeWidth = 8,
  label = "Progress",
  showLabel = true,
  className = ""
}) {
  const radius = (size - strokeWidth) / 2;
  const normalized = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  
  const getProgressColor = (progress) => {
    if (progress >= 90) return '#10B981'; // Emerald
    if (progress >= 70) return '#3B82F6'; // Blue  
    if (progress >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" role="progressbar" aria-valuenow={normalized} aria-valuemin="0" aria-valuemax="100">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
            className="transition-all duration-300"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor(normalized)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{`${normalized}%`}</span>
          {showLabel && (
            <span className="text-xs text-slate-500 mt-1">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Premium Enrolled Card
export function EnrolledCard({ course, isLoading = false }) {
  if (isLoading) {
    return <EnrolledCardSkeleton />;
  }

  const progress = Math.round((course.progress || 0) * 100);
  
  return (
    <motion.div 
      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="article"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center mt-2 text-sm text-slate-600">
            <BookOpenIcon className="h-4 w-4 mr-1" />
            <span>{course.modules || 0} modules</span>
            <span className="mx-2">•</span>
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{course.duration || 'Self-paced'}</span>
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <ProgressRing value={progress} size={60} strokeWidth={6} showLabel={false} />
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Course progress</span>
          <span className="font-medium text-slate-900">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <motion.div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : 'Never'}
        </div>
        
        <motion.button 
          className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlayIcon className="h-4 w-4" />
          <span>Continue</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Premium Recommended Card
export function RecommendedCard({ course, isLoading = false }) {
  if (isLoading) {
    return <RecommendedCardSkeleton />;
  }

  return (
    <motion.div 
      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 overflow-hidden"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="article"
    >
      {/* Header with gradient */}
      <div className="relative mb-4">
        <div className="h-40 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300 flex items-center justify-center">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <AcademicCapIcon className="h-8 w-8" />
          </div>
        </div>
        
        {/* Difficulty badge */}
        {course.difficulty && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {course.description || 'Start your learning journey with this comprehensive course.'}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{course.duration || 'Self-paced'}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            <span>{course.rating || '4.5'}/5</span>
          </div>
        </div>
        
        {course.category && (
          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-700">
            {course.category}
          </span>
        )}
      </div>

      {/* CTA */}
      <motion.button 
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 group/btn shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Enroll Now</span>
        <ArrowRightIcon className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}

// Premium Skeleton Loaders
function EnrolledCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="ml-4 w-15 h-15 bg-slate-200 rounded-full"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

function RecommendedCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
      <div className="h-10 bg-slate-200 rounded w-full"></div>
    </div>
  );
}