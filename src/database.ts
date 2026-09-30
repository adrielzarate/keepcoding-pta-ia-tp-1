import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Profile } from './shared/profile.js';
import type { Project } from './shared/project.js';
type ProjectRow = { id: number; title: string; description: string; technologies: string; code_url: string | null; demo_url: string | null; created_at: string };
export function migrateDatabase(db: Database.Database) {
  let version = db.pragma('user_version', { simple: true }) as number;
  if (version > 2) throw new Error('Database version is newer than this application.');
  if (version < 1) {
    db.transaction(() => {
      db.exec(`
        CREATE TABLE profile (id INTEGER PRIMARY KEY CHECK(id = 1), name TEXT NOT NULL, title TEXT NOT NULL, biography TEXT NOT NULL);
        CREATE TABLE administrator (id INTEGER PRIMARY KEY CHECK(id = 1), username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
        PRAGMA user_version = 1;
      `);
      db.prepare('INSERT INTO profile VALUES (1, ?, ?, ?)').run('Adriel Zarate', 'Fullstack developer', 'This is sample text. A personal introduction will be added here.');
    })();
    version = 1;
  }
  if (version < 2) db.transaction(() => {
    db.exec(`
      CREATE TABLE project (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT NOT NULL CHECK (json_valid(technologies) AND json_type(technologies) = 'array'),
        code_url TEXT,
        demo_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX project_recent_first ON project (id DESC);
      PRAGMA user_version = 2;
    `);
  })();
}
export function openDatabase(filename: string) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  try { migrateDatabase(db); }
  catch (error) { db.close(); throw error; }
  return db;
}
export function getProfile(db: Database.Database): Profile {
  return db.prepare('SELECT name, title, biography FROM profile WHERE id = 1').get() as Profile;
}
export function saveProfile(db: Database.Database, value: Profile) {
  db.prepare('UPDATE profile SET name = ?, title = ?, biography = ? WHERE id = 1').run(value.name, value.title, value.biography);
}
function fromProjectRow(row: ProjectRow | undefined): (Project & { id: number; createdAt: string }) | undefined {
  if (!row) return undefined;
  return { id: row.id, title: row.title, description: row.description, technologies: JSON.parse(row.technologies) as string[], codeUrl: row.code_url, demoUrl: row.demo_url, createdAt: row.created_at };
}
export function createProject(db: Database.Database, value: Project) {
  const result = db.prepare('INSERT INTO project (title, description, technologies, code_url, demo_url) VALUES (?, ?, ?, ?, ?)').run(value.title, value.description, JSON.stringify(value.technologies), value.codeUrl, value.demoUrl);
  return Number(result.lastInsertRowid);
}
export function getProject(db: Database.Database, id: number) {
  return fromProjectRow(db.prepare('SELECT id, title, description, technologies, code_url, demo_url, created_at FROM project WHERE id = ?').get(id) as ProjectRow | undefined);
}
export function listProjects(db: Database.Database) {
  const rows = db.prepare('SELECT id, title, description, technologies, code_url, demo_url, created_at FROM project ORDER BY id DESC').all() as ProjectRow[];
  return rows.map(row => fromProjectRow(row)!);
}
