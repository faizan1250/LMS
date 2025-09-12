import dotenv from 'dotenv';
dotenv.config();
import { callAIGenerate } from '../backend/services/aiService.js';

(async () => {
  try {
    const r = await callAIGenerate({ title: 'Intro to JavaScript', audience: 'beginners', duration: '4', format: 'self-paced' });
    console.log('success:', r.success);
    console.log('rawText snippet:', typeof r.rawText === 'string' ? r.rawText.slice(0, 400) : r.rawText);
    console.log('parseError:', r.parseError);
    console.log('validationErrors:', (r.validationErrors || []).length);
  } catch (e) {
    console.error('callAIGenerate threw:', e);
  }
  process.exit();
})();
