import fc from 'fast-check';
import { expect, test } from 'vitest';
import { normalizeProject, projectLimits } from '../../src/shared/project.js';
const chars = [...'abcXYZ012 éñ<>"&😀'];
const text = (max: number) => fc.array(fc.constantFrom(...chars), { minLength: 1, maxLength: max }).map(items => 'A' + items.join(''));
const project = fc.record({
  title: text(40), description: text(300), technologies: fc.array(text(25), { minLength: 1, maxLength: 8 }).map(items => items.join('\n')),
  codeUrl: fc.option(fc.webUrl(), { nil: '' }), demoUrl: fc.option(fc.webUrl(), { nil: '' }),
});
test('normalizing valid project fields is idempotent', () => {
  fc.assert(fc.property(project, input => {
    const once = normalizeProject(input);
    expect(once.valid).toBe(true);
    expect(normalizeProject(once.value)).toEqual(once);
  }));
});
test('project field limits are measured on normalized values', () => {
  fc.assert(fc.property(text(projectLimits.title), title => {
    const result = normalizeProject({ title, description: 'Description', technologies: ['TypeScript'] });
    expect(result.valid).toBe(true);
    expect(result.value.title.length).toBeLessThanOrEqual(projectLimits.title);
    const tooLong = normalizeProject({ title: title + 'x'.repeat(projectLimits.title + 1), description: 'Description', technologies: ['TypeScript'] });
    expect(tooLong.valid).toBe(false);
  }));
});
test('generated non-HTTP schemes are always rejected', () => {
  fc.assert(fc.property(fc.constantFrom('javascript', 'data', 'file', 'ftp', 'vbscript'), text(30), (scheme, rest) => {
    const result = normalizeProject({ title: 'Project', description: 'Description', technologies: ['TypeScript'], codeUrl: `${scheme}:${rest}` });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('codeUrl');
  }));
});
