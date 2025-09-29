import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import testApi from "../../api/test";
import courseApi from "../../api/course";

/** Small helpers */
const DIFFICULTY = ["easy", "medium", "hard"];
const TYPES = ["quiz", "weekly", "final"];
const toISO = (s) => (s ? new Date(s).toISOString() : null);
const fromISOInput = (iso) => (iso ? iso.slice(0, 16) : "");

function emptyQuestion(order = 0) {
  return {
    order,
    text: "",
    options: ["", ""],
    answerIndex: 0,
    points: 1,
  };
}

export default function TestCreator() {
  // form
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [type, setType] = useState("quiz");
  const [numQuestions, setNumQuestions] = useState(10);
  const [startAt, setStartAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [durationMins, setDurationMins] = useState(30);

  // data & state
  const [courses, setCourses] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // current test (after create)
  const [testId, setTestId] = useState(null);
  const [test, setTest] = useState(null); // { status, questions, ... }
  const [polling, setPolling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // UX
  const [showPreview, setShowPreview] = useState(true);

  /** Load teacher's courses */
  useEffect(() => {
    (async () => {
      try {
        const resp = await courseApi.getCourses({ mine: true });
        const list = resp?.courses || resp?.rows || (Array.isArray(resp) ? resp : []);
        setCourses(list);
        if (!courseId && list.length) setCourseId(list[0]._id);
      } catch (e) {
        setError(e?.response?.data?.error || e.message || "Failed to load courses");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Poll test until AI ready/failed */
  useEffect(() => {
    if (!testId || !polling) return;
    let stop = false;
    const tick = async () => {
      try {
        const res = await testApi.getTest(testId);
        setTest(res?.test || res);
        const status = (res?.test || res)?.status;
        if (status === "ready" || status === "failed" || status === "published") {
          setPolling(false);
        }
      } catch (e) {
        // transient errors ignored during polling
      }
      if (!stop && polling) setTimeout(tick, 2000);
    };
    tick();
    return () => {
      stop = true;
    };
  }, [testId, polling]);

  /** Create test -> starts AI */
  const onCreate = async (e) => {
    e?.preventDefault?.();
    setError(null);

    // minimal validation
    if (!title.trim()) return setError("Title is required.");
    if (!courseId) return setError("Please select a course.");
    if (!TYPES.includes(type)) return setError("Invalid test type.");
    if (!DIFFICULTY.includes(difficulty)) return setError("Invalid difficulty.");
    const nQ = Math.max(1, Math.min(100, Number(numQuestions) || 10));

    setCreating(true);
    try {
      const payload = {
        title: title.trim(),
        courseId,
        description: description?.trim() || "",
        difficulty,
        type,
        numQuestions: nQ,
        startAt: toISO(startAt),
        dueAt: toISO(dueAt),
        durationMins: Number(durationMins) || 30,
      };
      const res = await testApi.createTest(payload);
      const id = res?.testId || res?.id || res?._id;
      setTestId(id);
      // immediately fetch current snapshot for UI
      try {
        const t = await testApi.getTest(id);
        setTest(t?.test || t);
      } catch {}
      setPolling(true);
      setShowPreview(true);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to create test");
    } finally {
      setCreating(false);
    }
  };

  /** Derived helpers */
  const status = test?.status || (polling ? "generating" : "draft");
  const questions = useMemo(() => {
    const arr = Array.isArray(test?.questions) ? test.questions : [];
    // ensure order sorted & contiguous
    return arr
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((q, idx) => ({ ...q, order: idx }));
  }, [test]);

  /** Edit handlers */
  const updateQuestion = (idx, patch) => {
    const next = questions.map((q, i) => (i === idx ? { ...q, ...patch } : q));
    setTest((t) => ({ ...(t || {}), questions: next }));
  };
  const addQuestion = () => {
    const next = [...questions, emptyQuestion(questions.length)];
    setTest((t) => ({ ...(t || {}), questions: next }));
  };
  const removeQuestion = (idx) => {
    const next = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i }));
    setTest((t) => ({ ...(t || {}), questions: next }));
  };
  const addOption = (qi) => {
    const opts = [...(questions[qi].options || [])];
    opts.push("");
    updateQuestion(qi, { options: opts });
  };
  const updateOption = (qi, oi, val) => {
    const opts = [...(questions[qi].options || [])];
    opts[oi] = val;
    updateQuestion(qi, { options: opts });
  };
  const removeOption = (qi, oi) => {
    const opts = (questions[qi].options || []).filter((_, i) => i !== oi);
    let answerIndex = questions[qi].answerIndex ?? 0;
    if (oi < answerIndex) answerIndex -= 1;
    if (answerIndex >= opts.length) answerIndex = Math.max(0, opts.length - 1);
    updateQuestion(qi, { options: opts, answerIndex });
  };

  /** Save test edits */
  const saveEdits = async () => {
    if (!testId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: test?.title || title,
        description: test?.description ?? description,
        questions: questions.map((q, i) => ({
          order: i,
          text: String(q.text || ""),
          options: (q.options || []).map(String),
          answerIndex: Number.isFinite(q.answerIndex) ? q.answerIndex : 0,
          points: Number(q.points) || 1,
        })),
        difficulty: test?.difficulty || difficulty,
        type: test?.type || type,
        durationMins: test?.durationMins || durationMins,
        startAt: test?.startAt || toISO(startAt),
        dueAt: test?.dueAt || toISO(dueAt),
      };
      const res = await testApi.updateTest(testId, payload);
      setTest(res?.test || res);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to save test");
    } finally {
      setSaving(false);
    }
  };

  /** Publish */
  const canPublish = status === "ready" && questions.length > 0 && questions.every(q => (q.options || []).length >= 2);
  const onPublish = async () => {
    if (!testId) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await testApi.publishTest(testId);
      setTest(res?.test || res);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  /** Stats (attempts / avg) */
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (!testId) return;
    (async () => {
      try {
        const s = await testApi.getTestStats(testId);
        setStats(s?.stats || s);
      } catch {}
    })();
  }, [testId, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Create & Publish Test
            </h1>
            <p className="text-slate-600 mt-1">
              Define the test, let AI draft questions, then review, edit, and publish.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-center gap-2"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!testId && (
          <motion.form
            onSubmit={onCreate}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-700">Title *</label>
                <input
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Week 3 Quiz: Arrays & Loops"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Course *</label>
                <select
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} {c.status === "draft" ? "(draft)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-slate-700">Description</label>
                <textarea
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope, modules covered, special instructions…"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Difficulty</label>
                <select
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {DIFFICULTY.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700">Type</label>
                <select
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700"># Questions</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Duration (mins)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Opens</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Due</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={creating}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-60"
                whileHover={{ scale: creating ? 1 : 1.02 }}
                whileTap={{ scale: creating ? 1 : 0.98 }}
              >
                {creating ? (
                  <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                ) : (
                  <RocketLaunchIcon className="h-5 w-5" />
                )}
                <span>Create & Start AI</span>
              </motion.button>
              <span className="text-slate-500 text-sm">
                AI will draft {numQuestions} MCQs based on your inputs.
              </span>
            </div>
          </motion.form>
        )}

        {/* After create */}
        {testId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status === "generating" && (
                    <ArrowPathIcon className="h-6 w-6 text-indigo-600 animate-spin" />
                  )}
                  {status === "ready" && (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  )}
                  {status === "failed" && (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  )}
                  {status === "published" && (
                    <PaperAirplaneIcon className="h-6 w-6 text-blue-600" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {test?.title || title}
                    </div>
                    <div className="text-sm text-slate-500">
                      Status: <span className="capitalize">{status}</span>
                      {polling && " — generating questions…"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {stats && (
                    <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Duration: {test?.durationMins || durationMins}m</span>
                      </div>
                      <div>Attempts: {stats.attempts ?? 0}</div>
                      <div>Avg: {stats.avgScore != null ? `${Math.round(stats.avgScore)}%` : "—"}</div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowPreview((v) => !v)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>

                  <motion.button
                    onClick={saveEdits}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black inline-flex items-center gap-2 disabled:opacity-60"
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                  >
                    {saving ? (
                      <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                    ) : (
                      <PencilSquareIcon className="h-4 w-4" />
                    )}
                    <span>Save Edits</span>
                  </motion.button>

                  <motion.button
                    onClick={onPublish}
                    disabled={!canPublish || publishing}
                    className={`px-4 py-2 rounded-xl ${
                      canPublish
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-300"
                    } text-white inline-flex items-center gap-2 disabled:opacity-60`}
                    whileHover={{ scale: !canPublish || publishing ? 1 : 1.02 }}
                    whileTap={{ scale: !canPublish || publishing ? 1 : 0.98 }}
                  >
                    {publishing ? (
                      <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4" />
                    )}
                    <span>{status === "published" ? "Published" : "Publish"}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Preview/Edit */}
            {showPreview && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Questions ({questions.length})
                  </h3>
                  <button
                    onClick={addQuestion}
                    className="px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                  >
                    + Add Question
                  </button>
                </div>

                {questions.length === 0 && (
                  <div className="text-slate-500">No questions yet. AI is generating…</div>
                )}

                <div className="space-y-4">
                  {questions.map((q, qi) => (
                    <div
                      key={qi}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                              {qi + 1}
                            </div>
                            <input
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                              placeholder="Question text"
                              value={q.text || ""}
                              onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                            />
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            {(q.options || []).map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`answer-${qi}`}
                                  checked={q.answerIndex === oi}
                                  onChange={() => updateQuestion(qi, { answerIndex: oi })}
                                />
                                <input
                                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                                  placeholder={`Option ${oi + 1}`}
                                  value={opt}
                                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                                />
                                <button
                                  onClick={() => removeOption(qi, oi)}
                                  className="text-slate-500 hover:text-red-600 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            <button
                              onClick={() => addOption(qi)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm"
                            >
                              + Add Option
                            </button>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Points</span>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="w-20 px-2 py-1 border border-slate-200 rounded"
                                value={q.points || 1}
                                onChange={(e) =>
                                  updateQuestion(qi, { points: Math.max(1, Number(e.target.value) || 1) })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => removeQuestion(qi)}
                            className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta editor */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-700">Title</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={test?.title ?? title}
                    onChange={(e) => setTest((t) => ({ ...(t || {}), title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Type</label>
                  <select
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={test?.type ?? type}
                    onChange={(e) => setTest((t) => ({ ...(t || {}), type: e.target.value }))}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={test?.description ?? description}
                    onChange={(e) => setTest((t) => ({ ...(t || {}), description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700">Opens</label>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={fromISOInput(test?.startAt) || startAt}
                    onChange={(e) =>
                      setTest((t) => ({ ...(t || {}), startAt: new Date(e.target.value).toISOString() }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Due</label>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={fromISOInput(test?.dueAt) || dueAt}
                    onChange={(e) =>
                      setTest((t) => ({ ...(t || {}), dueAt: new Date(e.target.value).toISOString() }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700">Difficulty</label>
                  <select
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={test?.difficulty ?? difficulty}
                    onChange={(e) => setTest((t) => ({ ...(t || {}), difficulty: e.target.value }))}
                  >
                    {DIFFICULTY.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-700">Duration (mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl"
                    value={test?.durationMins ?? durationMins}
                    onChange={(e) =>
                      setTest((t) => ({ ...(t || {}), durationMins: Math.max(1, Number(e.target.value) || 1) }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={saveEdits}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                  ) : (
                    <PencilSquareIcon className="h-4 w-4" />
                  )}
                  <span>Save Settings</span>
                </button>
                <span className="text-slate-500 text-sm">
                  You can publish once questions are ready and valid.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
