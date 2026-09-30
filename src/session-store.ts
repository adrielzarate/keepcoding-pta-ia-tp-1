import { Store, type SessionData } from 'express-session';
import type Database from 'better-sqlite3';
type Done = (error?: unknown) => void;
export class SqliteSessionStore extends Store {
  constructor(private readonly db: Database.Database) {
    super();
    db.exec('CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT NOT NULL, expires INTEGER NOT NULL)');
    db.exec('CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires)');
  }
  override get(sid: string, done: (error: unknown, session?: SessionData | null) => void) {
    try {
      const row = this.db.prepare('SELECT data FROM sessions WHERE sid = ? AND expires > ?').get(sid, Date.now()) as { data: string } | undefined;
      done(null, row ? JSON.parse(row.data) as SessionData : null);
    } catch (error) { done(error); }
  }
  override set(sid: string, value: SessionData, done: Done = () => undefined) {
    try {
      const expires = value.cookie.expires ? new Date(value.cookie.expires).getTime() : Date.now() + 8 * 60 * 60 * 1000;
      this.db.prepare('INSERT INTO sessions (sid, data, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires = excluded.expires').run(sid, JSON.stringify(value), expires);
      this.db.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now());
      done();
    } catch (error) { done(error); }
  }
  override destroy(sid: string, done: Done = () => undefined) {
    try { this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid); done(); }
    catch (error) { done(error); }
  }
  override touch(sid: string, value: SessionData, done: Done = () => undefined) {
    try {
      const expires = value.cookie.expires ? new Date(value.cookie.expires).getTime() : Date.now() + 8 * 60 * 60 * 1000;
      this.db.prepare('UPDATE sessions SET expires = ? WHERE sid = ? AND expires > ?').run(expires, sid, Date.now());
      done();
    } catch (error) { done(error); }
  }
}
