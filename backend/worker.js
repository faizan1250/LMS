// backend/worker.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { courseQueue } from './queue.js';
import Course from './models/Course.js';
import GeneratedData from './models/GeneratedData.js';
import { callAIGenerate } from './services/aiService.js';
import { validateAIOutput } from './utils/validateAIOutput.js';

dotenv.config();

async function attachProcessor() {
  courseQueue.process(async (job) => {
    const payload = job.data || job; // fallback for in-process queue
    const { courseId, genId, input } = payload;
    console.log('Worker processing', courseId);
    let genRecord = null;
    try {
      genRecord = await GeneratedData.findById(genId);
      if (!genRecord) throw new Error('GeneratedData record not found');
      genRecord.status = 'pending';
      await genRecord.save();

      const aiPayload = {
        title: input.title,
        audience: input.audience || 'beginners',
        duration: input.duration || 'self-paced',
        format: input.format || 'mixed'
      };

      const aiOutput = await callAIGenerate(aiPayload);

      genRecord.rawOutput = aiOutput;
      genRecord.status = 'done';
      await genRecord.save();

      const { ok, reason } = validateAIOutput(aiOutput);
      if (!ok) {
        genRecord.status = 'failed';
        genRecord.error = `Validation failed: ${reason}`;
        await genRecord.save();
        throw new Error('AI output validation failed: ' + reason);
      }

      const course = await Course.findById(courseId);
      if (!course) throw new Error('Course not found');

      course.modules = (aiOutput.modules || []).map((m, mi) => ({
        title: m.title,
        order: m.order ?? mi,
        lessons: (m.lessons || []).map((l, li) => ({
          title: l.title,
          content: l.content || '',
          order: l.order ?? li
        }))
      }));

      course.assessments = (aiOutput.assessments || []).map((a, ai) => ({
        type: a.type || 'quiz',
        data: a.data || {},
        order: a.order ?? ai
      }));

      course.description = aiOutput.description || course.description;
      course.aiGenerated = true;
      await course.save();

      console.log('Course updated with AI content', course._id.toString());
    } catch (err) {
      console.error('Error processing generation job:', err.message || err);
      if (genRecord) {
        genRecord.status = genRecord.status === 'done' ? genRecord.status : 'failed';
        genRecord.error = genRecord.error || (err.message || 'unknown error');
        await genRecord.save().catch(() => {});
      }
      throw err;
    }
  });
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI required for worker');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Worker connected to mongo');
  attachProcessor();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
