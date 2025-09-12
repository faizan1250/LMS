// frontend/src/components/courses/CreateCourseForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseApi from '../../api/course';

/**
 * CreateCourseForm
 * props:
 *  - onCreated(optional) -> callback({ courseId })
 */
export default function CreateCourseForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('4'); // default duration (weeks/hours — your choice)
  const [format, setFormat] = useState('self-paced'); // 'self-paced' | 'instructor-led' | 'blended'
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const validate = () => {
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return 'Title is required (min 3 characters).';
    }
    // optional: validate duration is positive integer
    const d = parseInt(String(duration || '0'), 10);
    if (Number.isNaN(d) || d < 1) {
      return 'Duration must be a positive number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    const clientErr = validate();
    if (clientErr) {
      setError(clientErr);
      return;
    }

    setCreating(true);

    try {
      // Backend expects: { title, audience, duration, format }
      const payload = {
        title: title.trim(),
        audience: audience.trim() || undefined,
        duration: duration ? String(duration).trim() : undefined,
        format: format || undefined
      };

      const res = await courseApi.createCourse(payload); // ensure createCourse accepts an object
      const courseId = res?.courseId;

      if (onCreated) onCreated({ courseId });

      // navigate to the editor for the new draft
      if (courseId) {
        navigate(`/courses/${courseId}/edit`);
      } else {
        // fallback: show success but no id (should not happen normally)
        setError('Course created but server did not return an id.');
      }
    } catch (err) {
      console.error('Create course error', err);
      // backend returns { error: '...' } per your server code; handle common shapes
      const serverData = err?.response?.data;
      const serverMsg = serverData?.error || serverData?.message || err?.message || 'Create failed';
      setError(serverMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <form className="bg-white p-4 rounded-md shadow" onSubmit={handleSubmit} aria-labelledby="create-course-heading">
      <h3 id="create-course-heading" className="text-lg font-medium text-gray-900 mb-3">Create new course</h3>

      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700">Course title</span>
        <input
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g. Intro to Machine Learning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={creating}
          aria-required
        />
      </label>

      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700">Target audience (optional)</span>
        <input
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g. Beginners, data analysts, product managers"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          disabled={creating}
        />
      </label>

      <div className="flex gap-3 mb-2">
        <label className="flex-1">
          <span className="text-sm font-medium text-gray-700">Estimated duration</span>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              min="1"
              className="w-24 px-2 py-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={creating}
              aria-label="duration"
            />
            <select
              className="px-2 py-2 border rounded"
              disabled={creating}
              aria-label="duration unit (weeks/hours)"
              value="weeks" // keep UI simple — server currently just receives duration string
              onChange={() => {}}
            >
              <option value="weeks">weeks</option>
            </select>
          </div>
          <p className="text-xs text-gray-400 mt-1">Provide a rough duration (positive number). Unit: weeks.</p>
        </label>

        <label style={{ minWidth: 160 }}>
          <span className="text-sm font-medium text-gray-700">Format</span>
          <select
            className="w-full px-3 py-2 border rounded mt-1"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={creating}
          >
            <option value="self-paced">Self-paced</option>
            <option value="instructor-led">Instructor-led</option>
            <option value="blended">Blended</option>
          </select>
        </label>
      </div>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {creating ? 'Creating…' : 'Create & Draft'}
        </button>

        <button
          type="button"
          onClick={() => {
            setTitle('');
            setAudience('');
            setDuration('4');
            setFormat('self-paced');
            setError(null);
          }}
          className="px-4 py-2 border rounded"
          disabled={creating}
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        AI drafting runs in the background — you will be redirected to the editor after creation.
      </p>
    </form>
  );
}
