// CourseEditor.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import courseApi from '../../api/course';

export default function CourseEditor() {
  const { id, courseId: cid } = useParams();
  const courseId = id || cid || null;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | success | error
  const [expandedModules, setExpandedModules] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!courseId) {
        setCourse({ title: '', description: '', modules: [], assessments: [] });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await courseApi.getCourse(courseId);
        if (!mounted) return;
        const c = res.course;
        // ensure shape defaults
        c.modules = (c.modules || []).map((m, i) => ({
          ...m,
          order: m.order ?? i,
          lessons: (m.lessons || []).map((l, j) => ({
            title: l.title || '',
            order: l.order ?? j,
            description: l.description || '',
            content: l.content || '',
            resources: Array.isArray(l.resources) ? l.resources : [],
            assignment: l.assignment || {
              title: 'Assignment',
              description: '',
              instructions: '',
              required: true
            }
          })),
          quiz: m.quiz || { questions: [], passPercent: 75 }
        }));
        setCourse(c);
        const ids = new Set();
        c.modules.forEach((_, i) => ids.add(i));
        setExpandedModules(ids);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message || 'Failed to load course');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseId]);

  const toggleModule = (index) => {
    setExpandedModules(prev => {
      const s = new Set(prev);
      s.has(index) ? s.delete(index) : s.add(index);
      return s;
    });
  };

  const addModule = () => {
    setCourse(c => {
      const order = c.modules?.length || 0;
      const m = {
        title: 'New Module',
        order,
        lessons: [],
        quiz: { questions: [], passPercent: 75 }
      };
      return { ...c, modules: [...(c.modules || []), m] };
    });
    const newIndex = course?.modules?.length || 0;
    setExpandedModules(prev => new Set(prev).add(newIndex));
  };

  const updateModule = (midx, patch) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      modules[midx] = { ...modules[midx], ...patch };
      return { ...c, modules };
    });
  };

  const removeModule = (midx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      modules.splice(midx, 1);
      // reassign order
      const re = modules.map((m, i) => ({ ...m, order: i }));
      return { ...c, modules: re };
    });
    setExpandedModules(prev => {
      const s = new Set(prev);
      s.delete(midx);
      return s;
    });
  };

  /* ---------- Lessons ---------- */
  const addLesson = (midx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const order = mod.lessons?.length || 0;
      const lesson = {
        title: 'New Lesson',
        order,
        description: '',
        content: '',
        resources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/', source: 'wikipedia' }],
        assignment: {
          title: 'Assignment',
          description: 'Apply the concept in a short exercise.',
          instructions: 'Submit a brief write-up or code snippet.',
          required: true
        }
      };
      mod.lessons = [...(mod.lessons || []), lesson];
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const updateLesson = (midx, lidx, patch) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      lessons[lidx] = { ...lessons[lidx], ...patch };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const removeLesson = (midx, lidx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      lessons.splice(lidx, 1);
      // reassign order
      mod.lessons = lessons.map((l, i) => ({ ...l, order: i }));
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  /* ---------- Resources ---------- */
  const addResource = (midx, lidx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      const res = lessons[lidx].resources || [];
      lessons[lidx] = {
        ...lessons[lidx],
        resources: [...res, { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/', source: 'wikipedia' }]
      };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const updateResource = (midx, lidx, ridx, patch) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      const resources = [...(lessons[lidx].resources || [])];
      resources[ridx] = { ...resources[ridx], ...patch };
      lessons[lidx] = { ...lessons[lidx], resources };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const removeResource = (midx, lidx, ridx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      const resources = [...(lessons[lidx].resources || [])];
      resources.splice(ridx, 1);
      lessons[lidx] = { ...lessons[lidx], resources };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  /* ---------- Assignment ---------- */
  const updateAssignment = (midx, lidx, patch) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      lessons[lidx] = { ...lessons[lidx], assignment: { ...lessons[lidx].assignment, ...patch } };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  /* ---------- Quiz ---------- */
  const ensureTenQuestions = (midx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const q = [...(mod.quiz?.questions || [])];
      const need = Math.max(0, 10 - q.length);
      for (let i = 0; i < need; i++) {
        q.push({
          prompt: `Question ${q.length + 1}`,
          options: [{ text: 'Option A' }, { text: 'Option B' }, { text: 'Option C' }, { text: 'Option D' }],
          correctIndex: 0
        });
      }
      mod.quiz = { passPercent: mod.quiz?.passPercent ?? 75, questions: q };
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const addQuestion = (midx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const q = [...(mod.quiz?.questions || [])];
      q.push({
        prompt: `Question ${q.length + 1}`,
        options: [{ text: 'Option A' }, { text: 'Option B' }, { text: 'Option C' }, { text: 'Option D' }],
        correctIndex: 0
      });
      mod.quiz = { passPercent: mod.quiz?.passPercent ?? 75, questions: q };
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const updateQuestion = (midx, qidx, patch) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const qs = [...(mod.quiz?.questions || [])];
      qs[qidx] = { ...qs[qidx], ...patch };
      mod.quiz = { passPercent: mod.quiz?.passPercent ?? 75, questions: qs };
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const updateOption = (midx, qidx, oidx, text) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const qs = [...(mod.quiz?.questions || [])];
      const opts = [...(qs[qidx].options || [])];
      opts[oidx] = { text };
      qs[qidx] = { ...qs[qidx], options: opts };
      mod.quiz = { passPercent: mod.quiz?.passPercent ?? 75, questions: qs };
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const removeQuestion = (midx, qidx) => {
    setCourse(c => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const qs = [...(mod.quiz?.questions || [])];
      qs.splice(qidx, 1);
      mod.quiz = { passPercent: mod.quiz?.passPercent ?? 75, questions: qs };
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const setPassPercent = (midx, val) => {
    const n = Math.max(50, Math.min(100, Number(val) || 75));
    updateModule(midx, { quiz: { ...(course.modules[midx].quiz || { questions: [] }), passPercent: n } });
  };

  /* ---------- Save ---------- */
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('saving');
    setError(null);
    try {
      const payload = {
        title: course.title?.trim(),
        description: course.description || '',
        modules: (course.modules || []).map((m, mi) => ({
          title: m.title?.trim() || `Module ${mi + 1}`,
          order: mi,
          lessons: (m.lessons || []).map((l, li) => ({
            title: l.title?.trim() || `Lesson ${li + 1}`,
            order: li,
            description: l.description || '',
            content: l.content || '',
            resources: (l.resources || []).map(r => ({
              label: r.label || '',
              url: r.url || '',
              source: r.source || 'other'
            })),
            assignment: {
              title: l.assignment?.title || 'Assignment',
              description: l.assignment?.description || '',
              instructions: l.assignment?.instructions || '',
              required: true
            }
          })),
          quiz: {
            passPercent: Math.max(50, Math.min(100, m.quiz?.passPercent ?? 75)),
            questions: (m.quiz?.questions || []).map(q => ({
              prompt: q.prompt || '',
              options: (q.options || []).map(o => ({ text: o.text || '' })),
              correctIndex: Math.max(0, Math.min((q.options?.length || 1) - 1, Number(q.correctIndex) || 0))
            }))
          }
        })),
        assessments: course.assessments || []
      };
      const res = await courseApi.updateCourse(courseId, payload);
      setCourse(res.course);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Save failed');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-6 animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center max-w-md">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-slate-600 mb-6">The course is missing or access is denied.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white group"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <ArrowLeftIcon className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                <span className="font-medium text-slate-700 group-hover:text-blue-600">Back to Dashboard</span>
              </motion.button>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex items-center space-x-2 px-4 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white group"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <EyeIcon className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                <span className="font-medium text-slate-700 group-hover:text-blue-600">Preview</span>
              </motion.button>

              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-5 w-5" />
                    <span>Save Course</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Course header card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-3">
                  <AcademicCapIcon className="h-5 w-5" />
                  <span>Course Title</span>
                </label>
                <input
                  className="w-full px-4 py-3 text-2xl font-bold bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={course.title || ''}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  placeholder="Enter course title..."
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-3">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>Course Description</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe outcomes and scope..."
                  rows="3"
                  value={course.description || ''}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-6 w-6 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-900">Course Modules</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {course.modules?.length || 0} modules
              </span>
            </div>

            <motion.button
              onClick={addModule}
              className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Module</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {(course.modules || []).map((module, midx) => (
                <motion.div
                  key={module._id || `${module.title}-${midx}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg overflow-hidden"
                >
                  {/* Module header */}
                  <div className="p-6 border-b border-slate-200/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {midx + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <input
                              className="w-full text-xl font-bold bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2"
                              value={module.title}
                              onChange={(e) => updateModule(midx, { title: e.target.value })}
                              placeholder="Module title..."
                            />
                            <textarea
                              className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 resize-none text-slate-600"
                              placeholder="Module description (optional)..."
                              value={module.description || ''}
                              onChange={(e) => updateModule(midx, { description: e.target.value })}
                              rows="2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button onClick={() => toggleModule(midx)} className="p-2 text-slate-500 hover:text-slate-700">
                          {expandedModules.has(midx) ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                        </button>
                        <button onClick={() => removeModule(midx)} className="p-2 text-red-500 hover:text-red-700">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Module content */}
                  <AnimatePresence>
                    {expandedModules.has(midx) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-6 bg-slate-50/50">
                        {/* Lessons */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-700 flex items-center space-x-2">
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>Lessons ({module.lessons?.length || 0})</span>
                          </h4>
                          <motion.button
                            onClick={() => addLesson(midx)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add Lesson</span>
                          </motion.button>
                        </div>

                        <div className="space-y-3">
                          {(module.lessons || []).map((lesson, lidx) => (
                            <motion.div key={lesson._id || `${lesson.title}-${lidx}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-slate-200 p-4">
                              <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-medium text-sm mt-1">
                                  {lidx + 1}
                                </div>
                                <div className="flex-1 space-y-3">
                                  <input
                                    className="w-full font-semibold bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(midx, lidx, { title: e.target.value })}
                                    placeholder="Lesson title..."
                                  />
                                  <textarea
                                    className="w-full bg-transparent border border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 resize-none text-sm"
                                    value={lesson.description || ''}
                                    onChange={(e) => updateLesson(midx, lidx, { description: e.target.value })}
                                    placeholder="Short description (≤ 60 words)..."
                                    rows="2"
                                  />
                                  <textarea
                                    className="w-full bg-transparent border border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 resize-none text-sm"
                                    value={lesson.content || ''}
                                    onChange={(e) => updateLesson(midx, lidx, { content: e.target.value })}
                                    placeholder="Lesson content (≤ 200 words)..."
                                    rows="4"
                                  />

                                  {/* Resources */}
                                  <div className="border border-slate-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                                        <LinkIcon className="h-4 w-4" />
                                        <span>Resources</span>
                                      </div>
                                      <button onClick={() => addResource(midx, lidx)} className="px-2 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200">
                                        Add link
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      {(lesson.resources || []).map((r, ridx) => (
                                        <div key={ridx} className="flex items-center space-x-2">
                                          <input
                                            className="w-32 px-2 py-1 border border-slate-200 rounded text-xs"
                                            placeholder="Label"
                                            value={r.label || ''}
                                            onChange={(e) => updateResource(midx, lidx, ridx, { label: e.target.value })}
                                          />
                                          <input
                                            className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs"
                                            placeholder="https://..."
                                            value={r.url || ''}
                                            onChange={(e) => updateResource(midx, lidx, ridx, { url: e.target.value })}
                                          />
                                          <select
                                            className="px-2 py-1 border border-slate-200 rounded text-xs"
                                            value={r.source || 'other'}
                                            onChange={(e) => updateResource(midx, lidx, ridx, { source: e.target.value })}
                                          >
                                            <option value="wikipedia">wikipedia</option>
                                            <option value="web">web</option>
                                            <option value="other">other</option>
                                          </select>
                                          <button onClick={() => removeResource(midx, lidx, ridx)} className="p-1 text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ))}
                                      {(lesson.resources || []).length === 0 && (
                                        <p className="text-xs text-slate-500">Add at least one link. Prefer Wikipedia when possible.</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Assignment */}
                                  <div className="border border-slate-200 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                                      <ClipboardDocumentListIcon className="h-4 w-4" />
                                      <span>Assignment (required)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <input
                                        className="px-3 py-2 border border-slate-200 rounded text-sm md:col-span-1"
                                        placeholder="Title"
                                        value={lesson.assignment?.title || ''}
                                        onChange={(e) => updateAssignment(midx, lidx, { title: e.target.value })}
                                      />
                                      <input
                                        className="px-3 py-2 border border-slate-200 rounded text-sm md:col-span-1"
                                        placeholder="Short description"
                                        value={lesson.assignment?.description || ''}
                                        onChange={(e) => updateAssignment(midx, lidx, { description: e.target.value })}
                                      />
                                      <div className="flex items-center space-x-2 md:col-span-1">
                                        <label className="text-xs text-slate-600">Required</label>
                                        <input
                                          type="checkbox"
                                          checked={lesson.assignment?.required ?? true}
                                          onChange={(e) => updateAssignment(midx, lidx, { required: e.target.checked })}
                                        />
                                      </div>
                                      <textarea
                                        className="px-3 py-2 border border-slate-200 rounded text-sm md:col-span-3"
                                        rows="2"
                                        placeholder="Instructions"
                                        value={lesson.assignment?.instructions || ''}
                                        onChange={(e) => updateAssignment(midx, lidx, { instructions: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <button onClick={() => removeLesson(midx, lidx)} className="p-2 text-red-500 hover:text-red-700">
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}

                          {(!module.lessons || module.lessons.length === 0) && (
                            <div className="text-center py-8 text-slate-500">
                              <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No lessons yet. Add your first lesson to get started.</p>
                            </div>
                          )}
                        </div>

                        {/* Quiz */}
                        <div className="mt-6 border border-slate-200 rounded-xl p-4 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <QuestionMarkCircleIcon className="h-5 w-5 text-slate-700" />
                              <h4 className="font-semibold text-slate-800">Module Quiz</h4>
                              <span className="text-xs text-slate-500">
                                {module.quiz?.questions?.length || 0} questions
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-slate-600">Pass %</label>
                              <input
                                type="number"
                                min="50" max="100"
                                className="w-16 px-2 py-1 border border-slate-200 rounded text-sm"
                                value={module.quiz?.passPercent ?? 75}
                                onChange={(e) => setPassPercent(midx, e.target.value)}
                              />
                              <button
                                onClick={() => ensureTenQuestions(midx)}
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              >
                                Ensure 10+
                              </button>
                              <button
                                onClick={() => addQuestion(midx)}
                                className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
                              >
                                Add Question
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {(module.quiz?.questions || []).map((q, qidx) => (
                              <div key={qidx} className="border border-slate-200 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <input
                                    className="flex-1 mr-3 px-3 py-2 border border-slate-200 rounded text-sm"
                                    value={q.prompt}
                                    onChange={(e) => updateQuestion(midx, qidx, { prompt: e.target.value })}
                                    placeholder={`Question ${qidx + 1} prompt`}
                                  />
                                  <button onClick={() => removeQuestion(midx, qidx)} className="p-2 text-red-500 hover:text-red-700">
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {(q.options || []).map((o, oidx) => (
                                    <div key={oidx} className="flex items-center space-x-2">
                                      <input
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm"
                                        value={o.text}
                                        onChange={(e) => updateOption(midx, qidx, oidx, e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + oidx)}`}
                                      />
                                      <label className="text-xs text-slate-600">Correct</label>
                                      <input
                                        type="radio"
                                        name={`m${midx}q${qidx}`}
                                        checked={q.correctIndex === oidx}
                                        onChange={() => updateQuestion(midx, qidx, { correctIndex: oidx })}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {(module.quiz?.questions || []).length < 10 && (
                              <p className="text-xs text-amber-600">Need at least 10 questions to publish.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {(course.modules || []).length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
                <BookOpenIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Modules Yet</h3>
                <p className="text-slate-500 mb-6">Start building your course by adding your first module</p>
                <motion.button
                  onClick={addModule}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  Create First Module
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
