import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  EyeIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import testApi from "../../api/test";

export default function TestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [test, setTest] = useState(null);
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [polling, setPolling] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [t, s, a] = await Promise.all([
        testApi.getTest(id),
        testApi.getTestStats(id).catch(() => null),
        testApi.getTestAttempts(id).catch(() => []),
      ]);
      setTest(t?.test || t);
      setStats(s?.stats || s);
      const rows = a?.attempts || a?.rows || (Array.isArray(a) ? a : []);
      setAttempts(rows);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  useEffect(() => {
    if (!polling) return;
    const h = setInterval(load, 2000);
    return () => clearInterval(h);
  }, [polling]);

  const status = test?.status || (polling ? "generating" : "draft");
  const questions = useMemo(
    () =>
      (test?.questions || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((q, i) => ({ ...q, order: i })),
    [test]
  );

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        title: test.title,
        description: test.description,
        questions: questions.map((q, i) => ({
          order: i,
          text: String(q.text || ""),
          options: (q.options || []).map(String),
          answerIndex: Number.isFinite(q.answerIndex) ? q.answerIndex : 0,
          points: Number(q.points) || 1,
        })),
        difficulty: test.difficulty,
        type: test.type,
        durationMins: test.durationMins,
        startAt: test.startAt,
        dueAt: test.dueAt,
      };
      const res = await testApi.updateTest(id, payload);
      setTest(res?.test || res);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    try {
      setPublishing(true);
      const res = await testApi.publishTest(id);
      setTest(res?.test || res);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const startPolling = () => setPolling(true);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-slate-200 rounded mb-4 animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-80 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 text-red-600">{error || "Test not found"}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/tests")}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back
          </button>

          <div className="flex items-center gap-2">
            {status === "generating" && (
              <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 inline-flex items-center gap-1">
                <ArrowPathIcon className="h-4 w-4 animate-spin" /> generating…
              </div>
            )}
            {status === "failed" && (
              <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 inline-flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" /> failed
              </div>
            )}
            {status === "ready" && (
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" /> ready
              </div>
            )}
            {status === "published" && (
              <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 inline-flex items-center gap-1">
                <PaperAirplaneIcon className="h-4 w-4" /> published
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black inline-flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /> : <PencilSquareIcon className="h-4 w-4" />}
              Save
            </button>

            <button
              onClick={publish}
              disabled={publishing || questions.length === 0}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-60"
            >
              {publishing ? <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /> : <PaperAirplaneIcon className="h-4 w-4" />}
              {status === "published" ? "Published" : "Publish"}
            </button>

            {status === "generating" && (
              <button
                onClick={startPolling}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              >
                Refresh Automatically
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
        )}

        {/* Overview */}
        <div className="bg-white/80 rounded-2xl border border-white/20 shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{test.title}</h2>
              <p className="text-slate-600">{test.description}</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <div>Type: <span className="capitalize">{test.type}</span></div>
              <div>Difficulty: {test.difficulty}</div>
              <div>Duration: {test.durationMins}m</div>
              {test.startAt && <div>Opens: {new Date(test.startAt).toLocaleString()}</div>}
              {test.dueAt && <div>Due: {new Date(test.dueAt).toLocaleString()}</div>}
            </div>
          </div>
        </div>

        {/* Questions Preview / Quick Edit */}
        <div className="bg-white/80 rounded-2xl border border-white/20 shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Questions ({questions.length})</h3>
            <div className="text-slate-500 text-sm">Correct option is selected with ●</div>
          </div>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">{qi + 1}</div>
                  <input
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                    value={q.text || ""}
                    onChange={(e) => {
                      const next = [...questions];
                      next[qi] = { ...next[qi], text: e.target.value };
                      setTest((t) => ({ ...(t || {}), questions: next }));
                    }}
                  />
                </div>

                <div className="mt-3 space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`a-${qi}`}
                        checked={q.answerIndex === oi}
                        onChange={() => {
                          const next = [...questions];
                          next[qi] = { ...next[qi], answerIndex: oi };
                          setTest((t) => ({ ...(t || {}), questions: next }));
                        }}
                      />
                      <input
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                        value={opt}
                        onChange={(e) => {
                          const next = [...questions];
                          const opts = [...(next[qi].options || [])];
                          opts[oi] = e.target.value;
                          next[qi] = { ...next[qi], options: opts };
                          setTest((t) => ({ ...(t || {}), questions: next }));
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-slate-500">No questions yet.</div>
            )}
          </div>
        </div>

        {/* Attempts / Leaderboard */}
        <div className="bg-white/80 rounded-2xl border border-white/20 shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Submissions & Leaderboard</h3>
            {stats && (
              <div className="text-slate-600 text-sm">
                Attempts: {stats.attempts ?? 0} • Avg: {stats.avgScore != null ? `${Math.round(stats.avgScore)}%` : "—"}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>No attempts yet.</td>
                  </tr>
                ) : (
                  attempts
                    .slice()
                    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                    .map((a, i) => (
                      <tr key={a._id || i} className="border-t">
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center gap-1">
                            <TrophyIcon className={`h-4 w-4 ${i === 0 ? "text-yellow-500" : "text-slate-400"}`} />
                            #{i + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3">{a.student?.name || a.student?.email || a.userId}</td>
                        <td className="px-4 py-3">{a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "—"}</td>
                        <td className="px-4 py-3">{a.score != null ? `${Math.round(a.score)}%` : "—"}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview as student link (optional route) */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => navigate(`/tests/${id}/preview`)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" /> Preview as Student
          </button>
        </div>
      </div>
    </div>
  );
}
