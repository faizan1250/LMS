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

/* ---------------- JSON schema for richer plan ---------------- */
const ajv = new Ajv({ allErrors: true, strict: false });

const resourceLinkSchema = {
  type: 'object',
  required: ['url'],
  additionalProperties: false,
  properties: {
    label: { type: 'string' },
    url: { type: 'string', format: 'uri' },
    source: { type: 'string', enum: ['wikipedia', 'web', 'other'] }
  }
};

const assignmentSchema = {
  type: 'object',
  required: ['title', 'description', 'instructions', 'required'],
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    description: { type: 'string', maxLength: 1000 },
    instructions: { type: 'string', maxLength: 2000 },
    required: { type: 'boolean' }
  }
};

const lessonSchema = {
  type: 'object',
  required: ['title', 'order', 'description', 'content', 'resources', 'assignment'],
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    order: { type: 'integer' },
    description: { type: 'string', maxLength: 600 },
    content: { type: 'string', maxLength: 4000 },
    resources: { type: 'array', items: resourceLinkSchema, minItems: 1 },
    assignment: assignmentSchema
  }
};

const quizQuestionSchema = {
  type: 'object',
  required: ['prompt', 'options', 'correctIndex'],
  additionalProperties: false,
  properties: {
    prompt: { type: 'string' },
    options: {
      type: 'array',
      items: { type: 'object', required: ['text'], additionalProperties: false, properties: { text: { type: 'string' } } },
      minItems: 2
    },
    correctIndex: { type: 'integer', minimum: 0 }
  }
};

const moduleQuizSchema = {
  type: 'object',
  required: ['questions', 'passPercent'],
  additionalProperties: false,
  properties: {
    questions: { type: 'array', items: quizQuestionSchema, minItems: 10 },
    passPercent: { type: 'integer', minimum: 50, maximum: 100 }
  }
};

const moduleSchema = {
  type: 'object',
  required: ['title', 'order', 'lessons', 'quiz'],
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    order: { type: 'integer' },
    lessons: { type: 'array', items: lessonSchema, minItems: 5 },
    quiz: moduleQuizSchema
  }
};

const assessmentSchema = {
  type: 'object',
  required: ['type', 'order', 'data'],
  additionalProperties: false,
  properties: {
    type: { type: 'string', enum: ['quiz', 'project', 'assignment'] },
    order: { type: 'integer' },
    data: { type: 'object' }
  }
};

const courseSchema = {
  type: 'object',
  required: ['description', 'modules', 'assessments'],
  additionalProperties: false,
  properties: {
    description: { type: 'string', maxLength: 500 },
    modules: { type: 'array', items: moduleSchema, minItems: 1 },
    assessments: { type: 'array', items: assessmentSchema }
  }
};

const validateCourse = ajv.compile(courseSchema);

/* ---------------- default fallback (valid to new schema) ---------------- */
function defaultCoursePlan({ title = 'Untitled Course' } = {}) {
  const mkQ = (i) => ({
    prompt: `Check ${i + 1}: Basic concept`,
    options: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
    correctIndex: 0
  });
  const mkLesson = (i) => ({
    title: `Lesson ${i + 1}`,
    order: i,
    description: 'Key ideas, definitions, and a short overview.',
    content: 'Concise explanation of the topic with examples. Focus on core intuition and outcomes.',
    resources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', source: 'wikipedia' }
    ],
    assignment: {
      title: 'Assignment',
      description: 'Apply the concept in a short exercise.',
      instructions: 'Submit a brief write-up or code snippet showing your approach.',
      required: true
    }
  });

  return {
    description: `${title} — auto-generated outline with lessons, assignments, and quizzes.`,
    modules: [
      {
        title: 'Module 1: Foundations',
        order: 0,
        lessons: Array.from({ length: 5 }, (_, i) => mkLesson(i)),
        quiz: {
          questions: Array.from({ length: 10 }, (_, i) => mkQ(i)),
          passPercent: 75
        }
      }
    ],
    assessments: [
      { type: 'quiz', order: 0, data: { scope: 'module', moduleOrder: 0 } }
    ]
  };
}

/* ---------------- prompt builders ---------------- */
function buildMainPrompt({ title, audience = 'beginners', duration = 'self-paced', format = 'mixed' }) {
  return `
You are an expert curriculum designer. Return ONLY a single valid JSON object (no commentary, no markdown) that matches EXACTLY this structure and constraints:

{
  "description": string, // ≤ 40 words
  "modules": [
    {
      "title": string,
      "order": integer,
      "lessons": [
        {
          "title": string,
          "order": integer,
          "description": string,     // short, ≤ 60 words
          "content": string,         // ≤ 200 words
          "resources": [             // ≥ 1 item; include Wikipedia links when possible
            { "label": string, "url": string, "source": "wikipedia" | "web" | "other" }
          ],
          "assignment": {
            "title": string,
            "description": string,
            "instructions": string,
            "required": true
          }
        }
      ], // At least 5 lessons per module
      "quiz": {
        "questions": [               // Exactly 10 preferred, ≥ 10 required
          {
            "prompt": string,
            "options": [ { "text": string }, ... ], // 4 options typical
            "correctIndex": integer                  // 0-based
          }
        ],
        "passPercent": 75
      }
    }
  ],
  "assessments": [
    { "type": "quiz" | "project" | "assignment", "order": integer, "data": object }
  ]
}

Rules:
1) Use only JSON keys shown. No extra fields. No nulls. Use "" or [] if unknown.
2) At least one module. Each module has ≥ 5 lessons.
3) Provide at least one resource per lesson. Prefer Wikipedia URLs when applicable.
4) Provide a required assignment for every lesson.
5) Provide a module quiz with ≥ 10 questions. Each question has options and a valid 0-based correctIndex.
6) Keep language concise and concrete.

Input context:
title: "${title}"
audience: "${audience}"
duration: "${duration}"
format: "${format}"

Return JSON now.
`.trim();
}

function buildRepairPrompt(invalidText) {
  return `
The previous output failed JSON parsing or schema validation. Here is the exact invalid output:

===BEGIN_INVALID===
${invalidText}
===END_INVALID===

Return ONLY a single corrected JSON object that conforms to the schema and constraints described earlier:
- modules ≥ 1
- each module: lessons ≥ 5 with description, content, resources[], assignment{...}
- each module: quiz.questions ≥ 10, each with options[] and correctIndex
- passPercent present (75 default)
- no extra fields, no nulls

No commentary or markdown — JSON only.
`.trim();
}

/* ---------------- extract model text helper ---------------- */
function extractTextFromModelResult(result) {
  if (!result) return '';
  try {
    const cand = result?.candidates?.[0] || null;
    if (cand) {
      const parts = cand?.content?.parts || cand?.content || null;
      if (Array.isArray(parts) && parts.length) {
        return parts.map(p => (typeof p === 'string' ? p : p?.text || '')).join('');
      }
      if (typeof cand?.text === 'string') return cand.text;
      if (typeof cand?.outputText === 'string') return cand.outputText;
    }
    if (Array.isArray(result?.output) && result.output.length > 0) {
      const out = result.output[0];
      const parts = out?.content?.parts;
      if (Array.isArray(parts)) return parts.map(p => p?.text || '').join('');
    }
    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch (e) {
    return String(result || '');
  }
}

/* ---------------- main exported function ---------------- */
export async function callAIGenerate({ title, audience, duration, format } = {}) {
  if (!GEMINI_API_KEY) {
    if (!IS_PROD) {
      console.warn('[callAIGenerate] GEMINI_API_KEY missing — returning dev fallback output.');
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    throw new Error('GEMINI_API_KEY not configured in environment');
  }

  const prompt = buildMainPrompt({ title, audience, duration, format });

  try {
    const result = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const rawText = extractTextFromModelResult(result);

    if (!rawText || rawText.trim() === '') {
      // try repair
      try {
        const repairResult = await genAI.models.generateContent({
          model: MODEL,
          contents: [{ role: 'user', parts: [{ text: buildRepairPrompt(rawText || '') }] }]
        });
        const repairText = extractTextFromModelResult(repairResult);
        if (repairText && repairText.trim() !== '') return parseAndValidate(repairText);
      } catch (repairErr) {
        console.warn('[callAIGenerate] repair attempt failed', repairErr?.message || repairErr);
      }
      if (!IS_PROD) {
        const parsed = defaultCoursePlan({ title });
        return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
      }
      return { success: false, rawText: null, parseError: 'no_text_from_model' };
    }

    const parsedAttempt = await parseAndValidate(rawText);
    if (parsedAttempt.success) return parsedAttempt;

    // repair step
    try {
      const repairResult = await genAI.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: buildRepairPrompt(rawText) }] }]
      });
      const repairText = extractTextFromModelResult(repairResult);
      if (repairText && repairText.trim() !== '') {
        const parsedRepair = await parseAndValidate(repairText);
        if (parsedRepair.success) return parsedRepair;
        return { success: false, rawText: repairText, parseError: parsedRepair.parseError, validationErrors: parsedRepair.validationErrors };
      }
    } catch (repairErr) {
      console.warn('[callAIGenerate] repair prompt failed', repairErr?.message || repairErr);
    }

    if (!IS_PROD) {
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    return { success: false, rawText, parseError: 'parse_and_repair_failed' };
  } catch (err) {
    console.error('[callAIGenerate] AI call failed:', err?.message || err);
    if (!IS_PROD) {
      const parsed = defaultCoursePlan({ title });
      return { success: true, parsed, rawText: JSON.stringify(parsed, null, 2) };
    }
    throw new Error(`AI model call failed: ${err?.message || String(err)}`);
  }
}

/* ---------------- parse & validate ---------------- */
async function parseAndValidate(rawText) {
  try {
    const cleaned = (rawText || '')
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // extra guard: ensure each module quiz has at least 10 Qs and passPercent set
    if (Array.isArray(parsed?.modules)) {
      for (const m of parsed.modules) {
        if (!m.quiz) m.quiz = { questions: [], passPercent: 75 };
        if (!Array.isArray(m.quiz.questions)) m.quiz.questions = [];
        if (typeof m.quiz.passPercent !== 'number') m.quiz.passPercent = 75;
      }
    }

    const valid = validateCourse(parsed);
    if (valid) {
      // secondary constraint: correctIndex < options.length for all questions
      for (const m of parsed.modules) {
        for (const q of m.quiz.questions) {
          if (!Array.isArray(q.options) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
            return { success: false, rawText: cleaned, validationErrors: [{ message: 'correctIndex out of range in quiz question' }] };
          }
        }
      }
      return { success: true, parsed, rawText: cleaned };
    }
    return { success: false, rawText: cleaned, validationErrors: validateCourse.errors || [] };
  } catch (err) {
    return { success: false, rawText, parseError: err?.message || String(err) };
  }
}
