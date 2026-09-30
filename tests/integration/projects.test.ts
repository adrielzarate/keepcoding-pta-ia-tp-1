import request from 'supertest';
import { expect, test } from 'vitest';
import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { csrf, fixture } from '../helpers.js';
import { createProject, getProject, openDatabase } from '../../src/database.js';
const valid = { title: 'Portfolio app', description: 'A small portfolio.', technologies: 'TypeScript\nSQLite', codeUrl: '', demoUrl: '' };
test('migrates to projects without losing the existing presentation or administrator', async () => {
  const db = new Database(':memory:');
  db.exec('CREATE TABLE profile (id INTEGER PRIMARY KEY CHECK(id = 1), name TEXT NOT NULL, title TEXT NOT NULL, biography TEXT NOT NULL); CREATE TABLE administrator (id INTEGER PRIMARY KEY CHECK(id = 1), username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL); PRAGMA user_version = 1;');
  db.prepare('INSERT INTO profile VALUES (1, ?, ?, ?)').run('Existing Owner', 'Fullstack developer', 'Existing biography.');
  try {
    db.prepare('INSERT INTO administrator VALUES (1, ?, ?)').run('owner', 'existing-hash');
    const before = db.prepare('SELECT * FROM profile').get();
    const { migrateDatabase } = await import('../../src/database.js');
    migrateDatabase(db);
    migrateDatabase(db);
    expect(db.pragma('user_version', { simple: true })).toBe(2);
    expect(db.prepare('SELECT * FROM profile').get()).toEqual(before);
    expect(db.prepare('SELECT * FROM administrator').get()).toMatchObject({ username: 'owner', password_hash: 'existing-hash' });
    expect(db.prepare('SELECT * FROM project').all()).toEqual([]);
  } finally { db.close(); }
});
test('project data survives closing and reopening the SQLite database', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-project-reopen-'));
  const filename = join(directory, 'portfolio.sqlite');
  const value = { title: 'Persistent project', description: 'Stored across an app restart.', technologies: ['TypeScript', 'SQLite'], codeUrl: null, demoUrl: null };
  try {
    const first = openDatabase(filename);
    const id = createProject(first, value);
    first.close();
    const reopened = openDatabase(filename);
    try { expect(getProject(reopened, id)).toMatchObject({ id, ...value }); }
    finally { reopened.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('protects project list, details and creation; valid creation redirects and persists normalized fields', async () => {
  const f = await fixture();
  try {
    await request(f.app).get('/admin/projects').expect(303).expect('Location', '/admin/login');
    await request(f.app).get('/admin/projects/new').expect(303).expect('Location', '/admin/login');
    await request(f.app).post('/admin/projects').type('form').send(valid).expect(303);
    await f.login();
    await f.agent.post('/admin/projects').type('form').send(valid).expect(403);
    const empty = await f.agent.get('/admin/projects').expect(200);
    const protectedToken = csrf(empty.text);
    const created = await f.agent.post('/admin/projects').type('form').send({ ...valid, title: ' Portfolio app ', technologies: ' TypeScript \nSQLite\nTypeScript ', codeUrl: '', demoUrl: '', _csrf: protectedToken }).expect(303);
    expect(created.headers.location).toMatch(/^\/admin\/projects\/\d+$/);
    const detail = await f.agent.get(String(created.headers.location)).expect(200);
    expect(detail.text).toContain('Portfolio app');
    expect(detail.text).toContain('TypeScript');
    expect(detail.text).toContain('SQLite');
    expect(detail.text).toContain('No code link provided');
    expect(f.db.prepare('SELECT title, description, technologies, code_url, demo_url FROM project').get()).toEqual({ title: 'Portfolio app', description: 'A small portfolio.', technologies: '["TypeScript","SQLite"]', code_url: null, demo_url: null });
    const list = await f.agent.get('/admin/projects').expect(200);
    expect(list.text).toContain('Portfolio app');
    expect(list.text).toContain(String(created.headers.location));
  } finally { f.db.close(); }
});
test('invalid posts preserve all existing projects and show field-specific errors', async () => {
  const f = await fixture();
  try {
    await f.login();
    const form = await f.agent.get('/admin/projects/new').expect(200);
    const token = csrf(form.text);
    await f.agent.post('/admin/projects').type('form').send({ ...valid, _csrf: token }).expect(303);
    const before = f.db.prepare('SELECT id, title, description, technologies, code_url, demo_url FROM project').all();
    const bad = await f.agent.post('/admin/projects').type('form').send({ ...valid, title: ' ', codeUrl: 'javascript:alert(1)', _csrf: token }).expect(422);
    expect(bad.text).toContain('Title is required.');
    expect(bad.text).toContain('Enter an absolute HTTP or HTTPS link.');
    expect(f.db.prepare('SELECT id, title, description, technologies, code_url, demo_url FROM project').all()).toEqual(before);
  } finally { f.db.close(); }
});
test('renders project content safely and unknown project IDs do not reveal records', async () => {
  const f = await fixture();
  try {
    await f.login();
    const form = await f.agent.get('/admin/projects/new');
    const response = await f.agent.post('/admin/projects').type('form').send({ title: '<script>alert(1)</script>', description: '<img src=x onerror=alert(1)>', technologies: 'TypeScript', codeUrl: 'https://example.com/repo', demoUrl: 'https://example.com/demo', _csrf: csrf(form.text) }).expect(303);
    const page = await f.agent.get(String(response.headers.location)).expect(200);
    expect(page.text).toContain('&lt;script&gt;');
    expect(page.text).toContain('&lt;img');
    expect(page.text).not.toContain('<script>alert(1)</script>');
    await f.agent.get('/admin/projects/999999').expect(404);
  } finally { f.db.close(); }
});
test('public routes never expose private projects', async () => {
  const f = await fixture();
  try {
    await f.login();
    const form = await f.agent.get('/admin/projects/new');
    await f.agent.post('/admin/projects').type('form').send({ ...valid, _csrf: csrf(form.text) }).expect(303);
    const publicPage = await request(f.app).get('/').expect(200);
    expect(publicPage.text).not.toContain('Portfolio app');
  } finally { f.db.close(); }
});
