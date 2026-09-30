import { expect, test } from 'vitest';
import { Cookie, type SessionData } from 'express-session';
import { openDatabase } from '../../src/database.js';
import { SqliteSessionStore } from '../../src/session-store.js';
test('expires sessions and refuses to revive an expired session by touching it', () => {
  const db = openDatabase(':memory:'); const store = new SqliteSessionStore(db);
  try {
    const cookie = new Cookie(); cookie.maxAge = 60000;
    const session: SessionData = { cookie, authenticated: true };
    store.set('valid', session, error => expect(error).toBeUndefined());
    store.get('valid', (error, value) => { expect(error).toBeNull(); expect(value?.authenticated).toBe(true); });
    db.prepare('UPDATE sessions SET expires = ? WHERE sid = ?').run(Date.now() - 1, 'valid');
    store.touch('valid', session);
    store.get('valid', (error, value) => { expect(error).toBeNull(); expect(value).toBeNull(); });
    store.destroy('valid');
    expect(db.prepare('SELECT * FROM sessions').all()).toHaveLength(0);
  } finally { db.close(); }
});
