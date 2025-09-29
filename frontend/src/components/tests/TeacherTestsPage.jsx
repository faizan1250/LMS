import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import testApi from "../../api/test";
import courseApi from "../../api/course";
import { useNavigate } from "react-router-dom";

export default function TeacherTestsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [tRes, cRes] = await Promise.all([
        testApi.listTests({ courseId: courseId || undefined, status: status || undefined, q: q || undefined }),
        courseApi.getCourses({ mine: true }),
      ]);
      const list = tRes?.tests || tRes?.rows || (Array.isArray(tRes) ? tRes : []);
      setTests(list);
      const cl = cRes?.courses || cRes?.rows || (Array.isArray(cRes) ? cRes : []);
      setCourses(cl);
      if (!courseId && cl.length) setCourseId("");
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [q, courseId, status]);

  const rows = useMemo(() => tests, [tests]);

  const remove = async (id) => {
    if (!window.confirm("Delete this test?")) return;
    try {
      await testApi.deleteTest(id);
      setTests((x) => x.filter((t) => t._id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Delete failed");
    }
  };

  const publish = async (id) => {
    try {
      await testApi.publishTest(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Publish failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Tests</h1>
            <p className="text-slate-600 mt-1">Create, review, and publish tests for your courses</p>
          </div>
          <button
            onClick={() => navigate("/tests/new")}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Test
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Search tests…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-500" />
            <select className="flex-1 px-3 py-2 border border-slate-200 rounded-xl" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">All courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-500" />
            <select className="flex-1 px-3 py-2 border border-slate-200 rounded-xl" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any status</option>
              <option value="draft">draft</option>
              <option value="generating">generating</option>
              <option value="ready">ready</option>
              <option value="published">published</option>
              <option value="failed">failed</option>
            </select>
          </div>
          <button onClick={load} className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">Refresh</button>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3" colSpan={7}>
                        <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr className="border-t">
                    <td className="px-4 py-6 text-slate-500 text-center" colSpan={7}>No tests found.</td>
                  </tr>
                ) : (
                  rows.map((t) => (
                    <tr key={t._id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{t.title}</div>
                        <div className="text-xs text-slate-500">{t.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1 text-slate-700">
                          <AcademicCapIcon className="h-4 w-4" />
                          <span>{t.course?.title || t.courseTitle || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{t.type}</td>
                      <td className="px-4 py-3 text-center capitalize">{t.status}</td>
                      <td className="px-4 py-3 text-center">{t.questions?.length ?? "—"}</td>
                      <td className="px-4 py-3 text-center">{t.stats?.attempts ?? t.attempts ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/tests/${t._id}`)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center gap-1"
                          >
                            <EyeIcon className="h-4 w-4" /> View
                          </button>
                          {t.status !== "published" && (
                            <button
                              onClick={() => publish(t._id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-1"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" /> Publish
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/tests/${t._id}/edit`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black inline-flex items-center gap-1"
                          >
                            <PencilSquareIcon className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => remove(t._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
