// backend/services/testAiService.js
import { GoogleGenAI } from '@google/genai';
import Ajv from 'ajv';
import dotenv from 'dotenv';
dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const ajv = new Ajv({ allErrors: true, strict: false });
const testSchema = {
  type: 'object',
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['order','text','options','answerIndex','points'],
        properties: {
          order: { type: 'integer' },
          text: { type: 'string' },
          options: { type: 'array', minItems: 2, items: { type: 'string' } },
          answerIndex: { type: 'integer', minimum: 0 },
          points: { type: 'integer', minimum: 1 }
        }
      }
    }
  }
};
const validate = ajv.compile(testSchema);

function buildPrompt({ title, courseTitle, description, difficulty, type, numQuestions }) {
  return `
You are an assessment designer. Return EXACTLY ONE JSON object (no markdown) with:
{
  "questions": [
    { "order": integer, "text": string, "options": [string,string,...], "answerIndex": integer (0-based), "points": integer }
  ]
}
Rules:
- Create ${numQuestions} questions.
- Difficulty: ${difficulty}.
- Category: ${type}.
- No extra fields. No commentary. No code fences.
Context:
title="${title}"
course="${courseTitle}"
description="${description||''}"
`.trim();
}

function extractText(result) {
  try {
    const cand = result?.candidates?.[0];
    const parts = cand?.content?.parts;
    if (Array.isArray(parts)) return parts.map(p => p?.text || '').join('');
    return cand?.text || '';
  } catch { return ''; }
}

export async function generateTestContent(input) {
  if (!genAI) return { ok: false, error: 'No AI key configured' };
  const prompt = buildPrompt(input);
  const res = await genAI.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });
  const raw = extractText(res).trim();
  let cleaned = raw.replace(/^```json\s*/i,'').replace(/```$/,'').trim();
  try {
    const parsed = JSON.parse(cleaned);
    const valid = validate(parsed);
    if (!valid) return { ok: false, rawOutput: cleaned, validationErrors: validate.errors || [] };
    return { ok: true, rawOutput: cleaned, questions: parsed.questions };
  } catch (e) {
    return { ok: false, rawOutput: cleaned || raw, parseError: e.message };
  }
}
