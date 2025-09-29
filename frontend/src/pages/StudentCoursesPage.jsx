import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  StarIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import {
  getCourses,
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  getProgress,
} from "../api/course";
import {
  getCourseTests,
  getTestAttempts,
} from "../api/test";

function clampPercent(n) {
  if (n == null || isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(Number(n))));
}

// normalize any shape the tests endpoint might return
function normalizeTestsPayload(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.tests)) return payload.tests;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.items)) return payload.items;
  if (payload.data && Array.isArray(payload.data.tests)) return payload.data.tests;
  return [];
}

export default function StudentCoursesPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);

  const [percentMap, setPercentMap] = useState({});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // tests per course + my latest attempt per test
  const [testsByCourse, setTestsByCourse] = useState({});      // {courseId: [tests]}
  const [myAttemptByTest, setMyAttemptByTest] = useState({});  // {testId: attempt|null}

  // load courses
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getCourses(search ? { q: search } : {});
        const list = data?.courses || data?.rows || (Array.isArray(data) ? data : []);
        setCourses(list);
      } catch (err) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  // enrollments
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyEnrollments();
        const list = data?.courses || data?.rows || (Array.isArray(data) ? data : []);
        const ids = list.map((x) => x._id || x.course?._id || x.course).filter(Boolean);
        setEnrolledIds(ids);
      } catch {}
    })();
  }, []);

  // bookmarks
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyBookmarks();
        const list = data?.courses || data?.rows || (Array.isArray(data) ? data : []);
        const ids = list.map((x) => x._id || x.course?._id || x.course).filter(Boolean);
        setBookmarkIds(ids);
      } catch {}
    })();
  }, []);

  // fetch progress for enrolled courses
  useEffect(() => {
    if (!enrolledIds.length) return;
    (async () => {
      try {
        const entries = await Promise.allSettled(enrolledIds.map(async (id) => {
          const pr = await getProgress(id);
          const pct = pr?.progress?.percent ?? pr?.percent ?? 0;
          return [id, clampPercent(pct)];
        }));
        const merged = {};
        for (const r of entries) {
          if (r.status === 'fulfilled' && Array.isArray(r.value)) {
            const [id, pct] = r.value;
            merged[id] = pct;
          }
        }
        setPercentMap((m) => ({ ...m, ...merged }));
      } catch {}
    })();
  }, [enrolledIds]);

  // fetch tests for visible courses and my latest attempts
  useEffect(() => {
    if (!courses.length) return;
    (async () => {
      try {
        const courseIds = courses.map(c => c._id).filter(Boolean);

        // fetch tests per course (published only) with cache-buster to avoid 304/no body
        const testResults = await Promise.allSettled(
          courseIds.map((cid) => getCourseTests(cid, { publishedOnly: true, _ts: Date.now() }))
        );

        const nextTestsByCourse = {};
        const testIds = [];
        courseIds.forEach((cid, idx) => {
          if (testResults[idx].status === 'fulfilled') {
            const normalized = normalizeTestsPayload(testResults[idx].value);
            // optionally filter to published/upcoming only (defensive)
            const tests = normalized.filter(t => t.isPublished !== false);
            nextTestsByCourse[cid] = tests;
            tests.forEach(t => t?._id && testIds.push(t._id));
          } else {
            nextTestsByCourse[cid] = [];
          }
        });

        setTestsByCourse(nextTestsByCourse);

        // my latest attempt for each test (optional; ignore errors)
        if (testIds.length) {
          const attemptsResults = await Promise.allSettled(
            testIds.map(tid => getTestAttempts(tid, { mine: true, latest: true, _ts: Date.now() }))
          );
          const map = {};
          testIds.forEach((tid, idx) => {
            if (attemptsResults[idx].status === 'fulfilled') {
              const val = attemptsResults[idx].value || {};
              const arr =
                Array.isArray(val?.attempts) ? val.attempts :
                Array.isArray(val?.rows) ? val.rows :
                Array.isArray(val) ? val : [];
              map[tid] = arr[0] || val.attempt || null;
            }
          });
          setMyAttemptByTest(map);
        }
      } catch {
        // soft-fail; don't block course list
      }
    })();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (tab === "enrolled") list = list.filter((c) => enrolledIds.includes(c._id));
    if (tab === "bookmarks") list = list.filter((c) => bookmarkIds.includes(c._id));
    return list.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));
  }, [courses, tab, search, enrolledIds, bookmarkIds]);

  async function toggleEnroll(id, e) {
    e?.stopPropagation();
    setBusy(id);
    try {
      if (enrolledIds.includes(id)) {
        await unenrollFromCourse(id);
        setEnrolledIds((arr) => arr.filter((x) => x !== id));
        setPercentMap((m) => {
          const n = { ...m };
          delete n[id];
          return n;
        });
      } else {
        await enrollInCourse(id);
        setEnrolledIds((arr) => [...arr, id]);
        const pr = await getProgress(id);
        const pct = pr?.progress?.percent ?? pr?.percent ?? 0;
        setPercentMap((m) => ({ ...m, [id]: clampPercent(pct) }));
      }
    } catch (e2) {
      setError(e2.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function toggleBookmark(id, e) {
    e?.stopPropagation();
    setBusy(id);
    try {
      if (bookmarkIds.includes(id)) {
        await removeBookmark(id);
        setBookmarkIds((arr) => arr.filter((x) => x !== id));
      } else {
        await addBookmark(id);
        setBookmarkIds((arr) => [...arr, id]);
      }
    } catch (e2) {
      setError(e2.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  function openTest(test) {
    const mine = myAttemptByTest[test._id];
    if (mine && (mine.submittedAt || mine.status === 'submitted' || mine.score != null)) {
      navigate(`/tests/${test._id}/review`);
    } else {
      navigate(`/tests/${test._id}/attempt`);
    }
  }

  function testBadgeLabel(t) {
    const tag = t.category || t.kind || t.type || 'test';
    const due = t.dueAt ? new Date(t.dueAt).toLocaleDateString() : null;
    return due ? `${tag} • due ${due}` : tag;
  }

  const tabItems = [
    { key: "all", label: "All Courses", count: courses.length },
    { key: "enrolled", label: "My Learning", count: enrolledIds.length },
    { key: "bookmarks", label: "Bookmarks", count: bookmarkIds.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Discover Courses
              </h1>
              <p className="text-slate-600 mt-2">Expand your knowledge with our curated course collection</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{filteredCourses.length}</div>
              <div className="text-sm text-slate-500">Courses Available</div>
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by title, topic, or instructor..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-1">
              {tabItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    tab === item.key ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${tab === item.key ? 'bg-blue-400' : 'bg-slate-200'}`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4"
            >
              <div className="flex items-center space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-500" />
                <span className="text-red-700 font-medium">{error}</span>
                <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <AnimatePresence>
              {filteredCourses.map((course, index) => {
                const enrolled = enrolledIds.includes(course._id);
                const bookmarked = bookmarkIds.includes(course._id);
                const percent = percentMap[course._id] || 0;
                const ratingAvg = course?.rating?.avg ? Number(course.rating.avg).toFixed(1) : null;
                const ratingCount = course?.rating?.count || 0;

                const tests = testsByCourse[course._id] || [];

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              <AcademicCapIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                {course.title}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                                {course.duration && (
                                  <div className="flex items-center space-x-1">
                                    <ClockIcon className="h-4 w-4" />
                                    <span>{course.duration}</span>
                                  </div>
                                )}
                                {course.students && (
                                  <div className="flex items-center space-x-1">
                                    <UserGroupIcon className="h-4 w-4" />
                                    <span>{course.students.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {course.description && (
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                              {course.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            {ratingAvg && (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-semibold text-slate-900">{ratingAvg}</span>
                                </div>
                                <span className="text-slate-500 text-sm">({ratingCount})</span>
                              </div>
                            )}
                            {enrolled && (
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-900">{percent}%</div>
                                <div className="text-xs text-slate-500">Progress</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {enrolled && (
                        <div className="mb-4">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tests badges row */}
                      {tests.length > 0 && (
                        <div className="mb-4 -mt-1">
                          <div className="flex flex-wrap gap-2">
                            {tests.slice(0, 4).map((t) => {
                              const mine = myAttemptByTest[t._id];
                              const isDone = !!(mine && (mine.submittedAt || mine.status === 'submitted' || mine.score != null));
                              return (
                                <button
                                  key={t._id}
                                  onClick={(e) => { e.stopPropagation(); openTest(t); }}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                                    isDone
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                  }`}
                                  title={t.title}
                                >
                                  {isDone ? <TrophyIcon className="h-4 w-4" /> : <PencilSquareIcon className="h-4 w-4" />}
                                  <span className="truncate max-w-[120px]">
                                    {testBadgeLabel(t)}
                                  </span>
                                </button>
                              );
                            })}
                            {tests.length > 4 && (
                              <span className="text-xs text-slate-500">
                                +{tests.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <motion.button
                          onClick={(e) => toggleEnroll(course._id, e)}
                          disabled={busy === course._id}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            enrolled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          whileHover={{ scale: busy === course._id ? 1 : 1.02 }}
                          whileTap={{ scale: busy === course._id ? 1 : 0.98 }}
                        >
                          {busy === course._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : enrolled ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4" />
                              <span>Enrolled</span>
                            </>
                          ) : (
                            <>
                              <PlayCircleIcon className="h-4 w-4" />
                              <span>Enroll</span>
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={(e) => toggleBookmark(course._id, e)}
                          disabled={busy === course._id}
                          className={`p-3 rounded-xl border transition-all duration-200 ${
                            bookmarked ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          whileHover={{ scale: busy === course._id ? 1 : 1.05 }}
                          whileTap={{ scale: busy === course._id ? 1 : 0.95 }}
                        >
                          <BookmarkIcon className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <AcademicCapIcon className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No courses found</h3>
            <p className="text-slate-500 mb-6">
              {search ? `No courses match "${search}"` : `No courses available in ${tab}`}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
