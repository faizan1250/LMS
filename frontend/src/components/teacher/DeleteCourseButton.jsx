import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseApi from '../../api/course';

/**
 * DeleteCourseButton
 * Props:
 * - courseId
 * - onDeleted (optional) -> callback after deletion
 */
export default function DeleteCourseButton({ courseId, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm('Delete this course? This action is permanent.')) return;
    setDeleting(true);
    setErr(null);
    try {
      await courseApi.deleteCourse(courseId);
      if (onDeleted) onDeleted();
      else navigate('/teacher');
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-3 py-1.5 text-sm text-red-600 border rounded disabled:opacity-60"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
      {err && <div className="text-xs text-red-600 mt-1">{err}</div>}
    </div>
  );
}
