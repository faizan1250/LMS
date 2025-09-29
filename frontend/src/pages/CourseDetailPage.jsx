// frontend/src/pages/CourseDetailPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ClockIcon,
  LinkIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import courseApi from "../api/course";

// --- helpers ---
const clamp = (n) => (n == null || isNaN(n) ? 0 : Math.max(0, Math.min(100, Math.round(Number(n)))));
// normalize possibly-object values (e.g., {text:"..."}) to string
function t(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") {
    if (typeof v.text === "string" || typeof v.text === "number") return String(v.text);
    if (typeof v.label === "string") return v.label;
    if (typeof v.title === "string") return v.title;
    if (typeof v.url === "string") return v.url;
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}
const optText = (opt) => t(opt);
const qText = (q) => t(q?.prompt ?? q?.question ?? q);

export default function CourseDetailPage() {
  const { id: routeId, courseId: routeCourseId } = useParams();
  const courseId = routeId || routeCourseId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [progressPct, setProgressPct] = useState(0);
  const [error, setError] = useState(null);

  // per-lesson UI state
  const [assignmentInput, setAssignmentInput] = useState({}); // {lessonId: string}
  const [assignmentBusy, setAssignmentBusy] = useState(null); // lessonId
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());

  // per-module quiz state
  const [quizAnswers, setQuizAnswers] = useState({}); // {moduleId: {qIdx: optionIdx}}
  const [quizBusy, setQuizBusy] = useState(null); // moduleId
  const [quizResults, setQuizResults] = useState({}); // {moduleId: {score, correct, total, passed}}

  // module expand state
  const [openModules, setOpenModules] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [cRes, pRes] = await Promise.all([
          courseApi.getCourse(courseId),
          courseApi.getProgress(courseId),
        ]);
        if (!mounted) return;

        const c = cRes?.course || cRes;
        setCourse(c);

        const idxSet = new Set();
        (c?.modules || []).forEach((_, i) => idxSet.add(i));
        setOpenModules(idxSet);

        const pct = pRes?.progress?.percent ?? pRes?.percent ?? 0;
        setProgressPct(clamp(pct));

        const doneIds = new Set(pRes?.progress?.completedLessonIds?.map(String) || []);
        setCompletedLessonIds(doneIds);
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [courseId]);

  const stats = useMemo(() => {
    const modules = course?.modules || [];
    const lessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);
    const qCount = modules.reduce((s, m) => s + (m.quiz?.questions?.length || 0), 0);
    return { modules: modules.length, lessons, qCount };
  }, [course]);

  async function toggleLessonComplete(lessonId, checked) {
    try {
      const { hasAssignment, submitted } = locateLessonAssignment(course, lessonId);
      if (hasAssignment && !submitted && checked) {
        setError("Submit the assignment first.");
        return;
      }
      await courseApi.updateLessonProgress(courseId, { lessonId, completed: !!checked });
      const pr = await courseApi.getProgress(courseId);
      const pct = pr?.progress?.percent ?? pr?.percent ?? 0;
      setProgressPct(clamp(pct));
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(String(lessonId));
        else next.delete(String(lessonId));
        return next;
      });
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to update progress");
    }
  }

  async function submitAssignment(moduleId, lesson) {
    const lessonId = String(lesson._id);
    const text = (assignmentInput[lessonId] || "").trim();
    if (!text) { setError("Provide assignment submission content."); return; }
    try {
      setAssignmentBusy(lessonId);
      const res = await courseApi.submitAssignment(courseId, lessonId, { content: text });
      const updated = markLessonAssignmentSubmitted(course, moduleId, lessonId, res?.submissionId || true);
      setCourse(updated);
      await toggleLessonComplete(lessonId, true);
      setAssignmentInput((m) => ({ ...m, [lessonId]: "" }));
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Assignment submit failed");
    } finally {
      setAssignmentBusy(null);
    }
  }

  async function submitQuiz(module) {
    const moduleId = String(module._id || module.id || module.order);
    const questions = module?.quiz?.questions || [];
    if (!questions.length) { setError("No quiz in this module."); return; }
    const aMap = quizAnswers[moduleId] || {};
    const answers = questions.map((_, i) => (typeof aMap[i] === "number" ? aMap[i] : -1));
    if (answers.some((v) => v < 0)) { setError("Answer all questions."); return; }
    try {
      setQuizBusy(moduleId);
      const result = await courseApi.attemptModuleQuiz(courseId, moduleId, { answers });
      setQuizResults((m) => ({
        ...m,
        [moduleId]: {
          score: clamp(result?.scorePercent ?? 0),
          correct: result?.correctCount ?? 0,
          total: result?.total ?? questions.length,
          passed: !!result?.passed,
        },
      }));
      const pr = await courseApi.getProgress(courseId);
      const pct = pr?.progress?.percent ?? pr?.percent ?? 0;
      setProgressPct(clamp(pct));
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Quiz submission failed");
    } finally {
      setQuizBusy(null);
    }
  }

  function locateLessonAssignment(c, lessonId) {
    const id = String(lessonId);
    for (const m of c?.modules || []) {
      for (const l of m?.lessons || []) {
        if (String(l._id) === id) {
          const hasAssignment = !!l?.assignment;
          const submitted = !!l?.assignment?.submitted;
          return { hasAssignment, submitted };
        }
      }
    }
    return { hasAssignment: false, submitted: false };
  }

  function markLessonAssignmentSubmitted(c, moduleId, lessonId, submissionId) {
    const next = { ...c, modules: (c.modules || []).map((m) => ({ ...m })) };
    const mid = String(moduleId);
    for (const m of next.modules) {
      if (String(m._id || m.id || m.order) !== mid) continue;
      m.lessons = (m.lessons || []).map((l) => {
        if (String(l._id) !== String(lessonId)) return l;
        const assignment = {
          ...(l.assignment || { type: "text" }),
          submitted: true,
          submissionId: submissionId || true,
          submittedAt: new Date().toISOString(),
        };
        return { ...l, assignment };
      });
    }
    return next;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white/80 border rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-slate-700">Course not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-white border rounded-xl hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">{t(course.title)}</div>
            <div className="text-slate-600">{t(course.status)}</div>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">{stats.modules} modules</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">{stats.lessons} lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">{stats.qCount} questions</span>
            </div>
            {course.duration && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">{t(course.duration)}</span>
              </div>
            )}
            <div className="ml-auto">
              <div className="text-right">
                <div className="text-sm text-slate-500">Progress</div>
                <div className="text-lg font-semibold">{progressPct}%</div>
              </div>
              <div className="w-64 bg-slate-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
          {course.description && <p className="text-slate-700 mt-4">{t(course.description)}</p>}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center"
            >
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{t(error)}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-600 text-sm">dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modules */}
        <div className="space-y-6">
          {(course.modules || []).map((m, mi) => {
            const moduleId = String(m._id || m.id || m.order);
            const q = m?.quiz?.questions || [];
            const moduleResult = quizResults[moduleId];

            return (
              <motion.div
                key={moduleId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 border rounded-2xl overflow-hidden"
              >
                {/* Module header */}
                <button
                  onClick={() =>
                    setOpenModules((s) => {
                      const n = new Set(s);
                      n.has(mi) ? n.delete(mi) : n.add(mi);
                      return n;
                    })
                  }
                  className="w-full text-left p-5 hover:bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
                      {mi + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{t(m.title)}</div>
                      {m.description && <div className="text-sm text-slate-600 line-clamp-1">{t(m.description)}</div>}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {(m.lessons?.length || 0)} lessons · {q.length} Qs
                  </div>
                </button>

                <AnimatePresence>
                  {openModules.has(mi) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5"
                    >
                      {/* Lessons */}
                      <div className="space-y-4">
                        {(m.lessons || []).map((l, li) => {
                          const lid = String(l._id);
                          const done = completedLessonIds.has(lid);
                          const hasAssignment = !!l.assignment;
                          const submitted = !!l.assignment?.submitted;

                          // normalize resources to array of {url, label}
                          const resources = Array.isArray(l.resources) ? l.resources : [];
                          const normRes = resources.map((r) => {
                            const url = typeof r === "string" ? r : r?.url || "";
                            const label = t(r?.title ?? r?.label ?? r?.text ?? r ?? url);
                            return { url, label };
                          });

                          return (
                            <div key={lid} className="border rounded-xl p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 text-sm font-semibold">
                                      {li + 1}
                                    </div>
                                    <div className="font-medium text-slate-900">{t(l.title)}</div>
                                  </div>
                                  {l.description && <p className="text-slate-700 mt-2">{t(l.description)}</p>}
                                  {!l.description && l.content && <p className="text-slate-700 mt-2">{t(l.content)}</p>}

                                  {/* Resources */}
                                  {normRes.length > 0 && (
                                    <div className="mt-3">
                                      <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                                        <LinkIcon className="h-4 w-4" /> Resources
                                      </div>
                                      <ul className="list-disc ml-6 mt-1 space-y-1">
                                        {normRes.map((r, idx) => (
                                          <li key={idx} className="text-sm">
                                            <a
                                              href={r.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-blue-600 hover:underline break-all"
                                            >
                                              {t(r.label)}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Assignment */}
                                  {hasAssignment && (
                                    <div className="mt-4">
                                      <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                                        <ClipboardDocumentListIcon className="h-4 w-4" />
                                        Assignment
                                        {submitted && (
                                          <span className="ml-2 inline-flex items-center text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">
                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                            submitted
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-700 mt-1">
                                        {t(l.assignment?.prompt || "Complete the task and submit below.")}
                                      </p>

                                      {!submitted && (
                                        <div className="mt-2">
                                          <textarea
                                            rows={3}
                                            className="w-full border rounded-xl p-3 text-sm"
                                            placeholder="Write your submission..."
                                            value={assignmentInput[lid] || ""}
                                            onChange={(e) =>
                                              setAssignmentInput((m) => ({ ...m, [lid]: e.target.value }))
                                            }
                                          />
                                          <div className="mt-2 flex items-center gap-3">
                                            <button
                                              disabled={assignmentBusy === lid}
                                              onClick={() => submitAssignment(m._id || m.id || m.order, l)}
                                              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                            >
                                              {assignmentBusy === lid ? "Submitting..." : "Submit assignment"}
                                            </button>
                                            <span className="text-xs text-slate-500">
                                              Completing this assignment is required to mark the lesson done.
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Complete toggle */}
                                <div className="pt-1">
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={done}
                                      onChange={(e) => toggleLessonComplete(lid, e.target.checked)}
                                      disabled={hasAssignment && !submitted}
                                    />
                                    <div className={`w-11 h-6 rounded-full transition ${done ? "bg-green-500" : "bg-slate-300"} relative`}>
                                      <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition ${done ? "translate-x-5" : ""}`} />
                                    </div>
                                  </label>
                                  {hasAssignment && !submitted && (
                                    <div className="text-[11px] text-amber-700 mt-1">submit assignment first</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz */}
                      <div className="mt-5 border-t pt-5">
                        <div className="flex items-center gap-2 mb-2">
                          <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-600" />
                          <div className="font-semibold text-slate-900">Module Quiz</div>
                          <div className="text-xs text-slate-500">
                            {m.quiz?.passPercent ?? 75}% to pass · {q.length} questions
                          </div>
                        </div>

                        {q.length === 0 ? (
                          <div className="text-slate-500 text-sm">No quiz for this module.</div>
                        ) : (
                          <div className="space-y-4">
                            {q.map((ques, qi) => {
                              const moduleIdStr = String(m._id || m.id || m.order);
                              const sel = quizAnswers[moduleIdStr]?.[qi];
                              const options = Array.isArray(ques.options) ? ques.options : [];
                              return (
                                <div key={qi} className="border rounded-xl p-4">
                                  <div className="font-medium text-slate-900">
                                    {qi + 1}. {qText(ques)}
                                  </div>
                                  <div className="mt-2 grid gap-2">
                                    {options.map((opt, oi) => (
                                      <label
                                        key={oi}
                                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                                          sel === oi ? "border-blue-500 bg-blue-50" : "border-slate-200"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`m-${moduleIdStr}-q-${qi}`}
                                          checked={sel === oi}
                                          onChange={() =>
                                            setQuizAnswers((mmap) => ({
                                              ...mmap,
                                              [moduleIdStr]: { ...(mmap[moduleIdStr] || {}), [qi]: oi },
                                            }))
                                          }
                                        />
                                        <span className="text-sm">{optText(opt)}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}

                            <div className="flex items-center gap-3">
                              <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                                disabled={quizBusy === String(m._id || m.id || m.order)}
                                onClick={() => submitQuiz(m)}
                              >
                                {quizBusy === String(m._id || m.id || m.order) ? "Submitting..." : "Submit quiz"}
                              </button>
                              {moduleResult && (
                                <div
                                  className={`text-sm px-3 py-1 rounded-full ${
                                    moduleResult.passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  Score {moduleResult.score}% — {moduleResult.correct}/{moduleResult.total}{" "}
                                  {moduleResult.passed ? "passed" : "need 75%+"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
