import Database from 'better-sqlite3';
import fc from 'fast-check';
import { expect, test } from 'vitest';
import { createProject, getProject, migrateDatabase } from '../../src/database.js';
import { normalizeProject } from '../../src/shared/project.js';

const words = [...'Portfolio proyecto 漢字 😀 <tag> &'];
const text = (max: number) => fc.array(fc.constantFrom(...words), { minLength: 1, maxLength: max }).map(chars => `A${chars.join('')}`);
const project = fc.record({
  title: text(40),
  description: text(200),
  technologies: fc.array(text(16), { minLength: 1, maxLength: 8 }).map(items => items.join('\n')),
  codeUrl: fc.option(fc.webUrl(), { nil: '' }),
  demoUrl: fc.option(fc.webUrl(), { nil: '' }),
});

test('SQLite round trips generated normalized project data exactly', () => {
  fc.assert(fc.property(project, input => {
    const normalized = normalizeProject(input);
    expect(normalized.valid).toBe(true);
    if (!normalized.valid) return;

    const db = new Database(':memory:');
    try {
      migrateDatabase(db);
      const id = createProject(db, normalized.value);
      const saved = getProject(db, id);
      expect(saved).toMatchObject({ id, ...normalized.value });
    } finally {
      db.close();
    }
  }));
});
