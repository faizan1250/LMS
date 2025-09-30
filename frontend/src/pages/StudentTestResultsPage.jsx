import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useNavigate, useParams } from "react-router-dom";
import { getPublishedTest } from "../api/test";

function StudentTestResultsPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    if (testId) {
      loadTestData();
    }
  }, [testId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load test details
      const testData = await getPublishedTest(testId);
      setTest(testData.test);
      
      // TODO: Load attempt data when the endpoint is available
      // For now, we'll show a placeholder
      setAttempt({
        percent: 85,
        correctCount: 8,
        totalPoints: 10,
        earnedPoints: 8.5,
        submittedAt: new Date().toISOString(),
        perQuestion: []
      });
    } catch (err) {
      setError(err.message || 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent work!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Passing grade!';
    return 'Keep studying!';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <XCircleIcon className="h-24 w-24 text-red-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">Error Loading Results</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/student-tests')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!test || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AcademicCapIcon className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No Results Found</h3>
            <p className="text-slate-500 mb-6">You haven't submitted this test yet or the results are not available.</p>
            <button
              onClick={() => navigate('/student-tests')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </motion.div>
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
            <button
              onClick={() => navigate('/student-tests')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Tests
            </button>
            
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ClockIcon className="h-4 w-4" />
              Submitted: {formatDate(attempt.submittedAt)}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{test.title}</h1>
            {test.description && (
              <p className="text-slate-600 mb-4">{test.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {test.durationMins} minutes
              </div>
              <div className="flex items-center gap-1">
                <AcademicCapIcon className="h-4 w-4" />
                {test.numQuestions} questions
              </div>
              <div className="flex items-center gap-1">
                <TrophyIcon className="h-4 w-4" />
                {test.difficulty}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Completed!</h2>
              <p className="text-slate-600">{getScoreMessage(attempt.percent)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(attempt.percent)} mb-2`}>
                  {attempt.percent}%
                </div>
                <div className="text-slate-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {attempt.correctCount}
                </div>
                <div className="text-slate-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {attempt.earnedPoints}
                </div>
                <div className="text-slate-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-600 mb-2">
                  {attempt.totalPoints}
                </div>
                <div className="text-slate-600">Total Points</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Performance Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Accuracy Rate</span>
                <span className="font-semibold text-slate-900">
                  {Math.round((attempt.correctCount / test.numQuestions) * 100)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Questions Answered</span>
                <span className="font-semibold text-slate-900">
                  {test.numQuestions} / {test.numQuestions}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Time Taken</span>
                <span className="font-semibold text-slate-900">
                  {test.durationMins} minutes
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/student-tests')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentTestResultsPage;


