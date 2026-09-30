import fc from 'fast-check';
import { expect, test } from 'vitest';
import { openDatabase, getProfile, saveProfile } from '../../src/database.js';
import { validateProfile, limits } from '../../src/shared/profile.js';
import { fixture } from '../helpers.js';
const text = (maxLength: number) => fc.array(fc.constantFrom(...'abcXYZ012 éñ<>"&😀'), { minLength: 1, maxLength }).map(chars => 'A' + chars.join(''));
const profile = fc.record({ name: text(40), title: text(60), biography: text(300) });
test('valid presentations survive a SQLite round trip without losing text', () => {
  const db = openDatabase(':memory:');
  try {
    fc.assert(fc.property(profile, generated => {
      db.exec('SAVEPOINT property_case');
      try {
        const result = validateProfile(generated); expect(result.valid).toBe(true);
        saveProfile(db, result.value); expect(getProfile(db)).toEqual(result.value);
      } finally { db.exec('ROLLBACK TO property_case; RELEASE property_case'); }
    }));
  } finally { db.close(); }
});
test('normalization is idempotent for arbitrary inputs', () => {
  fc.assert(fc.property(fc.record({ name: fc.string(), title: fc.string(), biography: fc.string() }), input => {
    const once = validateProfile(input);
    expect(validateProfile(once.value).value).toEqual(once.value);
  }));
});
test('over-limit updates through the backend preserve the stored presentation', async () => {
  const f = await fixture();
  try {
    const token = await f.login(); const original = getProfile(f.db);
    await fc.assert(fc.asyncProperty(fc.constantFrom('name', 'title', 'biography'), fc.integer({ min: 1, max: 100 }), async (field, extra) => {
      const response = await f.agent.post('/admin/presentation').type('form').send({ ...original, [field]: 'x'.repeat(limits[field] + extra), _csrf: token });
      expect(response.status).toBe(422);
      expect(getProfile(f.db)).toEqual(original);
    }), { numRuns: 40 });
  } finally { f.db.close(); }
});
