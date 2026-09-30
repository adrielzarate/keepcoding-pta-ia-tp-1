import { describe, expect, test } from 'vitest';
import { normalizeProject } from '../../src/shared/project.js';
const validProject = { title: 'Portfolio app', description: 'A small portfolio.', technologies: 'TypeScript\nSQLite', codeUrl: '', demoUrl: '' };
describe('project validation', () => {
  test('trims text, normalizes line endings, and removes duplicate technologies in order', () => {
    const result = normalizeProject({ title: ' Portfolio app ', description: ' First\r\n\r\nSecond ', technologies: ' TypeScript \n\nSQLite\nTypeScript ', codeUrl: ' https://example.com/repo ', demoUrl: '' });
    expect(result.valid).toBe(true);
    expect(result.value).toEqual({ title: 'Portfolio app', description: 'First\n\nSecond', technologies: ['TypeScript', 'SQLite'], codeUrl: 'https://example.com/repo', demoUrl: null });
  });
  test('accepts the normalized representation and keeps empty links optional', () => {
    const first = normalizeProject(validProject);
    expect(first.valid).toBe(true);
    expect(normalizeProject(first.value)).toEqual(first);
  });
  test.each([
    [{ ...validProject, title: ' '.repeat(4) }, 'title'],
    [{ ...validProject, title: 'a'.repeat(121) }, 'title'],
    [{ ...validProject, description: 'a'.repeat(3001) }, 'description'],
    [{ ...validProject, technologies: '' }, 'technologies'],
    [{ ...validProject, technologies: Array.from({ length: 21 }, (_, i) => `Tech${i}`).join('\n') }, 'technologies'],
    [{ ...validProject, technologies: 'x'.repeat(51) }, 'technologies'],
    [{ ...validProject, codeUrl: 'javascript:alert(1)' }, 'codeUrl'],
    [{ ...validProject, demoUrl: 'https://user:password@example.com/demo' }, 'demoUrl'],
    [{ ...validProject, codeUrl: 'https://example.com/' + 'x'.repeat(2048) }, 'codeUrl'],
    [{ ...validProject, title: 'bad\u0000title' }, 'title'],
  ])('rejects invalid field %s', (input, field) => {
    const result = normalizeProject(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty(field);
  });
  test.each([null, 4, ['a', 'b'], { ...validProject, title: ['array'] }, { ...validProject, technologies: 3 }])('rejects unexpected input types: %j', input => expect(normalizeProject(input).valid).toBe(false));
});
