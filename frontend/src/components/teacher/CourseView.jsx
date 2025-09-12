// frontend/src/components/courses/CourseView.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseApi from '../../api/course';
import PublishCourseButton from './PublishCourseButton';
import DeleteCourseButton from './DeleteCourseButton';

/**
 * CourseView shows course summary and generated debug info.
 * If courseId is passed as a prop -> shows single course (GET /courses/:id).
 * Otherwise, it attempts to read :courseId from the route params.
 * If no courseId is present, it falls back to showing the teacher's list (mine=true).
 */
export default function CourseView({ courseId: propCourseId }) {
  const params = useParams();
  // prefer explicit prop if provided; fallback to route param :courseId (or :id)
  const courseId = propCourseId || params.courseId || params.id || null;

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null); // { course, generated } for single
  const [coursesList, setCoursesList] = useState(null); // fallback for list responses
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadSingle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getCourse(id); // expects { course, generated }
      setCourseData(res);
      setCoursesList(null);
    } catch (err) {
      console.error(err);
      setCourseData(null);
      setError(err?.response?.data?.message || err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      // expects getCourses to accept an object: getCourses({ mine: true })
      const res = await courseApi.getCourses({ mine: true });
      setCoursesList(res.courses || []);
      setCourseData(null);
    } catch (err) {
      console.error(err);
      setCoursesList(null);
      setError(err?.response?.data?.message || err.message || 'Failed to load courses list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadSingle(courseId);
    } else {
      // If no courseId in props or route, show the teacher's courses (or change this behaviour if undesired)
      loadList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (loading) {
    return <div className="p-4 bg-white rounded shadow">Loading course…</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  }

  // Single-course path
  if (courseData?.course) {
    const { course, generated } = courseData;
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
              <p className="text-sm text-gray-500">
                Status: <strong className="capitalize">{course.status}</strong>
              </p>
              <p className="mt-2 text-gray-700">
                {course.description || (course.aiGenerated ? 'AI-drafted. Edit or publish when ready.' : 'No description')}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={() => navigate(`/courses/${course._id}/edit`)} className="px-3 py-1.5 border rounded">
                Edit
              </button>

              <PublishCourseButton courseId={course._id} onSuccess={() => loadSingle(course._id)} />

              <DeleteCourseButton courseId={course._id} onDeleted={() => navigate('/teacher')} />
            </div>
          </div>
        </div>

        {/* Modules preview */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium text-gray-800 mb-2">Modules Preview</h3>
          {Array.isArray(course.modules) && course.modules.length > 0 ? (
            <div className="space-y-3">
              {course.modules.map((m) => (
                <div key={m._id || `${m.title}-${m.order}`} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{m.title}</div>
                      <div className="text-xs text-gray-500">Lessons: {Array.isArray(m.lessons) ? m.lessons.length : 0}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {Array.isArray(m.lessons) &&
                      m.lessons.slice(0, 3).map((l) => (
                        <div key={l._id || `${l.title}-${l.order}`} className="mb-1">
                          <strong>{l.title}</strong> —{' '}
                          <span className="text-xs text-gray-500">
                            {l.content?.slice(0, 120)}
                            {l.content?.length > 120 ? '…' : ''}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No modules yet. Wait for AI or edit to add modules.</div>
          )}
        </div>

        {/* Generated debug block */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium text-gray-800 mb-2">AI generation (debug)</h4>
          {generated ? (
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                Status: <strong>{generated.status}</strong>
              </div>
              {generated.parseError && <div className="text-red-600">Parse error: {generated.parseError}</div>}
              {Array.isArray(generated.validationErrors) && generated.validationErrors.length > 0 && (
                <div className="text-red-600">
                  Validation errors ({generated.validationErrors.length}):
                  <ul className="list-disc ml-5 mt-1">
                    {generated.validationErrors.map((e, i) => (
                      <li key={i}>
                        <code className="text-xs">{e.instancePath || e.dataPath || ''} {e.message}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-indigo-600">View raw output</summary>
                <pre className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-72 overflow-auto">
                  {typeof generated.rawOutput === 'string' ? generated.rawOutput : JSON.stringify(generated.rawOutput, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No AI generation record found yet.</div>
          )}
        </div>
      </div>
    );
  }

  // List path (no courseId or list fallback)
  if (Array.isArray(coursesList)) {
    if (coursesList.length === 0) {
      return <div className="p-4 bg-yellow-50">No courses found.</div>;
    }

    return (
      <div className="space-y-4">
        {coursesList.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.description}</p>
              </div>
              <div>
                <button onClick={() => navigate(`/courses/${c._id}`)} className="px-3 py-1 border rounded">
                  Open
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // fallback
  return <div className="p-4 bg-yellow-50">Course not found.</div>;
}
