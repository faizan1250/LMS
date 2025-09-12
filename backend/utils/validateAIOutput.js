// backend/utils/validateAIOutput.js
export function validateAIOutput(obj) {
  if (!obj || typeof obj !== 'object') return { ok: false, reason: 'output not an object' };
  if (!Array.isArray(obj.modules)) return { ok: false, reason: 'missing modules array' };
  for (const m of obj.modules) {
    if (!m.title) return { ok: false, reason: 'module without title' };
    if (!Array.isArray(m.lessons)) return { ok: false, reason: `module ${m.title} missing lessons array` };
    for (const l of m.lessons) {
      if (!l.title) return { ok: false, reason: `lesson missing title in module ${m.title}` };
    }
  }
  return { ok: true };
}
