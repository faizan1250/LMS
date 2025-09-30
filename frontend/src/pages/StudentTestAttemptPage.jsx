import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  DocumentCheckIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  TrophyIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useNavigate, useParams } from "react-router-dom";
import { getPublishedTest, submitAttempt } from "../api/test";

function StudentTestAttemptPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId]);

  useEffect(() => {
    if (test && test.durationMins && !submitted) {
      const durationMs = test.durationMins * 60 * 1000;
      setTimeLeft(durationMs);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, submitted]);

  const loadTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const testData = await getPublishedTest(testId);
      setTest(testData.test);
    } catch (err) {
      setError(err.message || 'Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionOrder, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionOrder]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (submitting || submitted) return;

    try {
      setSubmitting(true);
      
      // Convert answers to the format expected by the API
      const answersArray = Object.entries(answers).map(([qOrder, answerIndex]) => ({
        qOrder: parseInt(qOrder),
        answerIndex: parseInt(answerIndex)
      }));

      const result = await submitAttempt(testId, { answers: answersArray });
      setResult(result.attempt); // Extract the attempt data from the response
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Passing grade!';
    return 'Keep studying!';
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
            <h3 className="text-2xl font-bold text-slate-600 mb-2">Error Loading Test</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/tests')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <DocumentCheckIcon className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">Test Not Found</h3>
            <p className="text-slate-500 mb-6">The test you're looking for doesn't exist or is no longer available.</p>
            <button
              onClick={() => navigate('/tests')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mb-8">
              <TrophyIcon className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Submitted!</h2>
              <p className="text-slate-600 mb-6">{getScoreMessage(result.percent)}</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(result.percent)} mb-2`}>
                    {result.percent}%
                  </div>
                  <div className="text-slate-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {result.correctCount}
                  </div>
                  <div className="text-slate-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {result.earnedPoints}
                  </div>
                  <div className="text-slate-600">Points Earned</div>
                </div>
              </div>
            </div>

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
              onClick={() => navigate('/tests')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Tests
            </button>
            
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <ClockIcon className="h-6 w-6 text-orange-500" />
                <span className={timeLeft < 300000 ? 'text-red-600' : 'text-slate-900'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
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
                <DocumentCheckIcon className="h-4 w-4" />
                {test.numQuestions} questions
              </div>
              <div className="flex items-center gap-1">
                <TrophyIcon className="h-4 w-4" />
                {test.difficulty}
              </div>
              {test.type && (
                <div className="flex items-center gap-1">
                  <AcademicCapIcon className="h-4 w-4" />
                  {test.type}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Questions */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {test.questions?.map((question, index) => (
            <motion.div
              key={question.order}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Question {index + 1}: {question.text}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-slate-50 ${
                      answers[question.order] === optionIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.order}`}
                      value={optionIndex}
                      checked={answers[question.order] === optionIndex}
                      onChange={() => handleAnswerChange(question.order, optionIndex)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[question.order] === optionIndex
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {answers[question.order] === optionIndex && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
          
          <p className="text-sm text-slate-500 mt-3">
            You can submit your test at any time. Make sure to review your answers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentTestAttemptPage;
