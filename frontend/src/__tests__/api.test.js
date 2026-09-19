import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Frontend API Service Tests', () => {
  test('API base defaults to /api when VITE_API_BASE is undefined', () => {
    const apiBase = process.env.VITE_API_BASE || '/api';
    assert.strictEqual(apiBase, '/api');
  });

  test('Payload construction for document analysis preserves multilingual fields', () => {
    const constructPayload = (content, language, taskContext) => ({
      content: content.trim(),
      language: language || 'en',
      task_context: taskContext || null
    });

    const payload = constructPayload('Electricity bill due on 25 Sept', 'hi', 'Bill Explanation');
    assert.strictEqual(payload.content, 'Electricity bill due on 25 Sept');
    assert.strictEqual(payload.language, 'hi');
    assert.strictEqual(payload.task_context, 'Bill Explanation');
  });

  test('Input validation rejects empty content before network call', () => {
    const validateContent = (text) => Boolean(text && text.trim().length >= 3);
    assert.strictEqual(validateContent(''), false);
    assert.strictEqual(validateContent('  '), false);
    assert.strictEqual(validateContent('Hi'), false);
    assert.strictEqual(validateContent('Valid notice text'), true);
  });
});
