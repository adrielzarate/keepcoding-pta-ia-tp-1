import { describe, expect, test } from 'vitest';
import { validateProfile } from '../../src/shared/profile.js';
describe('presentation rules', () => {
  test('normalizes ordinary whitespace and line endings', () => {
    expect(validateProfile({ name: '  Adriel  ', title: ' Developer ', biography: ' First\r\n\r\nSecond ' }).value).toEqual({ name: 'Adriel', title: 'Developer', biography: 'First\n\nSecond' });
  });
  test.each([null, [], {}, { name: ['Ada'], title: {}, biography: 7 }])('rejects missing or non-string fields: %j', input => expect(validateProfile(input).valid).toBe(false));
  test('keeps markup as plain text instead of silently stripping user content', () => {
    expect(validateProfile({ name: 'Ada', title: 'Developer', biography: '<script>alert(1)</script>' }).value.biography).toBe('<script>alert(1)</script>');
  });
  test('rejects newlines in a title and NUL characters in text', () => {
    expect(validateProfile({ name: 'Ada', title: 'A\nB', biography: 'Bio\0' }).errors).toHaveProperty('title');
    expect(validateProfile({ name: 'Ada', title: 'Dev', biography: 'Bio\0' }).errors).toHaveProperty('biography');
  });
});
