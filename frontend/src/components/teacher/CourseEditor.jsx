// CourseEditor.jsx (only showing relevant parts)
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import courseApi from '../../api/course';

export default function CourseEditor() {
  const params = useParams();
  // support both /courses/:id and /courses/:courseId etc.
  const courseId = params.id || params.courseId || params.course_id || null;
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    // If there's no courseId, don't attempt to call getCourse.
    if (!courseId) {
      // If you want "create new" behaviour, initialize a blank course here instead.
      setCourse({
        title: '',
        description: '',
        modules: [],
        assessments: []
      });
      setLoading(false);
      return () => { mounted = false; };
    }

    async function load() {
      setLoading(true);
      try {
        const res = await courseApi.getCourse(courseId);
        if (mounted) setCourse(res.course);
      } catch (err) {
        console.error('Failed to load course:', err);
        if (mounted) setError(err?.response?.data?.message || err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseId]);


  // small helpers to mutate modules/lessons locally
  const addModule = () => {
    setCourse((c) => ({
      ...c,
      modules: [...(c.modules || []), { title: 'New Module', order: (c.modules?.length || 0), lessons: [] }]
    }));
  };

  const updateModuleTitle = (idx, title) => {
    setCourse((c) => {
      const modules = [...(c.modules || [])];
      modules[idx] = { ...modules[idx], title };
      return { ...c, modules };
    });
  };

  const addLesson = (midx) => {
    setCourse((c) => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      mod.lessons = [...(mod.lessons || []), { title: 'New Lesson', content: '', order: mod.lessons?.length || 0 }];
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const updateLesson = (midx, lidx, patch) => {
    setCourse((c) => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      const lessons = [...(mod.lessons || [])];
      lessons[lidx] = { ...lessons[lidx], ...patch };
      mod.lessons = lessons;
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const removeModule = (midx) => {
    setCourse((c) => {
      const modules = [...(c.modules || [])];
      modules.splice(midx, 1);
      return { ...c, modules };
    });
  };

  const removeLesson = (midx, lidx) => {
    setCourse((c) => {
      const modules = [...(c.modules || [])];
      const mod = { ...modules[midx] };
      mod.lessons = [...(mod.lessons || [])];
      mod.lessons.splice(lidx, 1);
      modules[midx] = mod;
      return { ...c, modules };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: course.title,
        description: course.description,
        modules: course.modules,
        assessments: course.assessments || []
      };
      const res = await courseApi.updateCourse(courseId, payload);
      setCourse(res.course);
      // show a success micro-toast-like indicator (simple alert here)
      // replace with nicer notification in your real app
      alert('Saved');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading editor…</div>;
  if (!course) return <div className="p-4 bg-red-50 rounded">Course not found.</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow flex items-start justify-between">
        <div>
          <input
            className="text-2xl font-semibold w-full border-0 p-0"
            value={course.title || ''}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />
          <textarea
            className="w-full mt-2 p-2 border rounded"
            placeholder="Short course description"
            value={course.description || ''}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 bg-indigo-600 text-white rounded">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={() => navigate(`/courses/${courseId}`)} className="px-3 py-1.5 border rounded">Preview</button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-medium">Modules</h4>
          <div className="flex gap-2">
            <button onClick={addModule} className="px-3 py-1 border rounded">Add module</button>
          </div>
        </div>

        <div className="space-y-3">
          {(course.modules || []).map((m, midx) => (
            <div key={m._id || `${m.title}-${midx}`} className="bg-white border rounded p-3">
              <div className="flex items-start justify-between gap-4">
                <input
                  className="font-medium text-lg flex-1 border-0 p-0"
                  value={m.title}
                  onChange={(e) => updateModuleTitle(midx, e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => addLesson(midx)} className="px-2 py-1 text-sm border rounded">+Lesson</button>
                  <button onClick={() => removeModule(midx)} className="px-2 py-1 text-sm text-red-600">Remove</button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {(m.lessons || []).map((l, lidx) => (
                  <div key={l._id || `${l.title}-${lidx}`} className="p-2 border rounded">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        className="flex-1 border-0"
                        value={l.title}
                        onChange={(e) => updateLesson(midx, lidx, { title: e.target.value })}
                      />
                      <button onClick={() => removeLesson(midx, lidx)} className="text-sm text-red-600">Delete</button>
                    </div>
                    <textarea
                      className="w-full mt-2 p-2 border rounded text-sm"
                      value={l.content || ''}
                      onChange={(e) => updateLesson(midx, lidx, { content: e.target.value })}
                      placeholder="Short lesson summary (120 words max)"
                    />
                  </div>
                ))}
                {(!m.lessons || m.lessons.length === 0) && <div className="text-sm text-gray-500">No lessons yet for this module.</div>}
              </div>
            </div>
          ))}
          {(course.modules || []).length === 0 && <div className="text-sm text-gray-500">No modules. Try regenerating AI draft or add modules manually.</div>}
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
