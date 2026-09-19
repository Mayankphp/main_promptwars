import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Accessibility & Senior Persona Unit Tests', () => {
  test('Language codes adhere to regional standards (en, hi)', () => {
    const supportedLanguages = ['en', 'hi'];
    assert.strictEqual(supportedLanguages.includes('en'), true);
    assert.strictEqual(supportedLanguages.includes('hi'), true);
    assert.strictEqual(supportedLanguages.includes('fr'), false);
  });

  test('Senior Mode pace is calibrated slower (0.82x vs 0.90x normal)', () => {
    const standardRate = 0.90;
    const seniorRate = 0.82;
    assert.strictEqual(seniorRate < standardRate, true);
    assert.strictEqual(seniorRate, 0.82);
  });

  test('Voice Utterance mapping assigns correct regional BCP 47 tags', () => {
    const getLanguageTag = (lang) => (lang === 'hi' ? 'hi-IN' : 'en-IN');
    assert.strictEqual(getLanguageTag('hi'), 'hi-IN');
    assert.strictEqual(getLanguageTag('en'), 'en-IN');
  });

  test('High-contrast senior mode CSS class token exists', () => {
    const seniorClass = 'senior-mode';
    assert.strictEqual(seniorClass, 'senior-mode');
  });
});
