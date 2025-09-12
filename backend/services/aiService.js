// backend/services/aiService.js
import { GoogleGenAI } from '@google/genai';
import Ajv from 'ajv';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const IS_PROD = process.env.NODE_ENV === 'production';

if (!GEMINI_API_KEY) {
  console.warn('[aiService] GEMINI_API_KEY not configured. AI calls will fail unless you provide a key.');
}

// init client if key present
const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/**
 * Course schema used for validation of AI output
 * (keeps same structure you had earlier)
 */
const ajv = new Ajv({ allErrors: true, strict: false });
const courseSchema = {
  type: 'object',
  required: ['description', 'modules', 'assessments'],
  properties: {
    description: { type: 'string', maxLength: 500 },
    modules: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'order', 'lessons'],
        properties: {
          title: { type: 'string' },
          order: { type: 'integer' },
          lessons: {
            type: 'array',
            items: {
              type: 'object',
              required: ['title', 'order', 'content'],
              properties: {
                title: { type: 'string' },
                order: { type: 'integer' },
                content: { type: 'string', maxLength: 2000 }
              }
            }
          }
        }
      }
    },
    assessments: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'order', 'data'],
        properties: {
          type: { type: 'string', enum: ['quiz', 'project', 'assignment'] },
          order: { type: 'integer' },
          data: { type: 'object' }
        }
      }
    }
  }
};
const validateCourse = ajv.compile(courseSchema);

/* ---------------- default fallback (strict) ----------------
   If AI output is missing or invalid we use this structured fallback.
   This is intentionally conservative and valid against the schema.
*/
function defaultCoursePlan({ title = 'Untitled Course' } = {}) {
  return {
    description: `${title} — an auto-generated course summary.`,
    modules: [
      {
        title: 'Introduction',
        order: 0,
        lessons: [
          { title: 'Welcome & Overview', order: 0, content: 'Course overview, objectives and how to use the materials.' }
        ]
      }
    ],
    assessments: [
      { type: 'quiz', order: 0, data: { questions: [] } }
    ]
  };
}

/* ---------------- prompt builders ---------------- */
function buildMainPrompt({ title, audience = 'beginners', duration = 'self-paced', format = 'mixed' }) {
  return `
You are an expert curriculum designer. Output exactly one valid JSON object (no commentary, no markdown, no code fences) that matches this schema (use double quotes, no trailing commas):

{
  "description": string,
  "modules": [
    {
      "title": string,
      "order": integer,
      "lessons": [
        { "title": string, "order": integer, "content": string }
      ]
    }
  ],
  "assessments": [
    { "type": "quiz|project|assignment", "order": integer, "data": object }
  ]
}

Rules:
1) Use empty string "" or [] for unknown/omittable values. Do not use null.
2) Keep description to ~1-2 sentences (max 40 words).
3) Lesson content should be concise (<=120 words).
4) Quizzes: questions must have at least 2 options and a valid 0-based answerIndex.
5) Follow schema types strictly.
6) Do not include any extra fields. No urls, no citations, no commentary.

Input:
title: "${title}"
audience: "${audience}"
duration: "${duration}"
format: "${format}"

Return the JSON now.
`.trim();
}

function buildRepairPrompt(invalidText) {
  return `
The previous output failed to parse as valid JSON or did not match the required schema. Here is the exact invalid output:

===BEGIN_INVALID===
${invalidText}
===END_INVALID===

Your task: Return only a single corrected, valid JSON object that conforms exactly to the schema provided earlier. Fix punctuation, missing quotes, trailing commas, or stray text. If you cannot recover details confidently, return the simplest valid JSON preserving the structure (use "" or [] where needed). No commentary, no markdown, no explanation — JSON only.
`.trim();
}

/* ---------------- small helper to extract text ----------------
   The Google SDK response shape can vary. Try common locations.
*/
function extractTextFromModelResult(result) {
  if (!result) return '';
  // common shapes: result.candidates[0].content.parts[0].text or result.output[0].content.parts...
  try {
    const cand = result?.candidates?.[0] || null;
    if (cand) {
      // candidate.content.parts (array of {text}) OR candidate.content itself
      const parts = cand?.content?.parts || cand?.content || null;
      if (Array.isArray(parts) && parts.length) {
        return parts.map(p => (typeof p === 'string' ? p : p?.text || '')).join('');
      }
      if (typeof cand?.text === 'string') return cand.text;
      if (typeof cand?.outputText === 'string') return cand.outputText;
    }

    // older shape
    if (Array.isArray(result?.output) && result.output.length > 0) {
      const out = result.output[0];
      const parts = out?.content?.parts;
      if (Array.isArray(parts)) return parts.map(p => p?.text || '').join('');
    }

    // final fallback
    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch (e) {
    return String(result || '');
  }
}

/* ---------------- the exported function ----------------
   Mirrors the example: call model, clean text, parse JSON, validate; fallback on errors.
   Returns an object with shape similar to your previous implementation:
     - on success: { success: true, parsed, rawText }
     - on parse/validation failure: { success: false, rawText, parseError?, validationErrors? }
     - on model/network error: throws Error (except in non-prod where a safe fallback is returned)
*/
export async function callAIGenerate({ title, audience, duration, format } = {}) {
  // If no API key and we are in dev, return the fallback immediately (helpful for offline dev)
  if (!GEMINI_API_KEY) {
    if (!IS_PROD) {
      console.warn('[callAIGenerate] GEMINI_API_KEY missing — returning dev fallback output.');
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    throw new Error('GEMINI_API_KEY not configured in environment');
  }

  // Build prompt and call model
  const prompt = buildMainPrompt({ title, audience, duration, format });

  try {
    const result = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const rawText = extractTextFromModelResult(result);

    if (!rawText || rawText.trim() === '') {
      // no usable text returned
      console.warn('[callAIGenerate] model returned empty text');
      // attempt a repair pass (best-effort)
      try {
        const repairResult = await genAI.models.generateContent({
          model: MODEL,
          contents: [{ role: 'user', parts: [{ text: buildRepairPrompt(rawText || '') }] }]
        });
        const repairText = extractTextFromModelResult(repairResult);
        if (repairText && repairText.trim() !== '') {
          // try parse below with repairText
          return parseAndValidate(repairText);
        }
      } catch (repairErr) {
        console.warn('[callAIGenerate] repair attempt failed', repairErr?.message || repairErr);
      }

      // final fallback for non-production: return default plan
      if (!IS_PROD) {
        const parsed = defaultCoursePlan({ title });
        return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
      }

      // production: return failure object
      return { success: false, rawText: null, parseError: 'no_text_from_model' };
    }

    // try parse & validate main output
    const parsedAttempt = await parseAndValidate(rawText);
    if (parsedAttempt.success) return parsedAttempt;

    // if parse/validate failed, attempt repair prompt
    console.info('[callAIGenerate] main parse/validation failed; attempting repair step');
    try {
      const repairResult = await genAI.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: buildRepairPrompt(rawText) }] }]
      });
      const repairText = extractTextFromModelResult(repairResult);
      if (repairText && repairText.trim() !== '') {
        const parsedRepair = await parseAndValidate(repairText);
        if (parsedRepair.success) return parsedRepair;
        // if still invalid, fall through to fallback/return below
        return { success: false, rawText: repairText, parseError: parsedRepair.parseError, validationErrors: parsedRepair.validationErrors };
      }
    } catch (repairErr) {
      console.warn('[callAIGenerate] repair prompt failed', repairErr?.message || repairErr);
    }

    // Final fallback: in dev return default plan, in prod return failure details
    if (!IS_PROD) {
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    return { success: false, rawText, parseError: 'parse_and_repair_failed' };
  } catch (err) {
    // model/network error
    console.error('[callAIGenerate] AI call failed:', err?.message || err);
    if (!IS_PROD) {
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    // bubble up in production
    throw new Error(`AI model call failed: ${err?.message || String(err)}`);
  }
}

/* ---------------- helper: parse & validate ----------------
   Returns the canonical return shape for parse attempts.
*/
async function parseAndValidate(rawText) {
  try {
    // Strip common markdown/code fences
    const cleaned = (rawText || '')
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    const valid = validateCourse(parsed);
    if (valid) {
      return { success: true, parsed, rawText: cleaned };
    }
    // validation failed
    return { success: false, rawText: cleaned, validationErrors: validateCourse.errors || [] };
  } catch (err) {
    return { success: false, rawText, parseError: err?.message || String(err) };
  }
}
