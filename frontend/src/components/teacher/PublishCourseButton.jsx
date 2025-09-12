// frontend/src/components/courses/PublishCourseButton.jsx
import React, { useState } from 'react';
import courseApi from '../../api/course';

export default function PublishCourseButton({ courseId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const showError = (e) => {
    // handle axios error shapes and server returned field names
    const data = e?.response?.data;
    const serverMsg = data?.error || data?.message || null;
    setErr(serverMsg || e?.message || 'Publish failed');
  };

  const handlePublish = async () => {
    if (!confirm('Publish course? This will make the course visible to students.')) return;
    setErr(null);

    // Preflight check: fetch course and ensure it has modules/lessons
    try {
      setLoading(true);
      const courseRes = await courseApi.getCourse(courseId); // { course, generated }
      const course = courseRes?.course;
      if (!course) {
        setErr('Course not found.');
        return;
      }
      if (!Array.isArray(course.modules) || course.modules.length === 0) {
        setErr('Cannot publish an empty course. Add modules & lessons before publishing.');
        return;
      }
    } catch (e) {
      // If we can't fetch course, show server message or error
      showError(e);
      return;
    }

    // If preflight OK, attempt publish
    try {
      const res = await courseApi.publishCourse(courseId);
      if (onSuccess) onSuccess(res.course);
      alert('Published');
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePublish}
        disabled={loading}
        className="px-3 py-1.5 bg-green-600 text-white rounded disabled:opacity-60"
      >
        {loading ? 'Publishing…' : 'Publish'}
      </button>
      {err && <div className="text-xs text-red-600 mt-1">{err}</div>}
    </div>
  );
}
