import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { expect, test } from 'vitest';
import { csrf, fixture, testPassword } from '../helpers.js';
import { getProfile, openDatabase } from '../../src/database.js';
import { createApp } from '../../src/app.js';
test('requires authentication, rejects forged writes, saves safely and invalidates logout', async () => {
  const f = await fixture();
  try {
    const before = getProfile(f.db);
    await request(f.app).post('/admin/presentation').type('form').send({ name: 'Intruder' }).expect(303);
    expect(getProfile(f.db)).toEqual(before);
    const token = await f.login();
    await f.agent.post('/admin/presentation').type('form').send({ ...before, _csrf: 'forged' }).expect(403);
    const updated = { name: 'Adriel', title: 'Fullstack developer', biography: '<script>alert("x")</script>\n\nA real introduction.' };
    await f.agent.post('/admin/presentation').type('form').send({ ...updated, _csrf: token }).expect(303);
    const page = await request(f.app).get('/').expect(200);
    expect(page.text).toContain('&lt;script&gt;'); expect(page.text).not.toContain('<script>alert');
    expect(getProfile(f.db)).toEqual(updated);
    const cookie = f.getAuthCookies();
    await f.agent.post('/admin/logout').type('form').send({ _csrf: token }).expect(303);
    await f.agent.get('/admin').expect(303);
    await request(f.app).get('/admin').set('Cookie', cookie).expect(303);
  } finally { f.db.close(); }
});
test('rotates the session on login, masks credentials and throttles repeated failures', async () => {
  const f = await fixture();
  try {
    const page = await f.agent.get('/admin/login'); const token = csrf(page.text);
    const login = await f.agent.post('/admin/login').type('form').send({ username: 'owner', password: testPassword, _csrf: token }).expect(303);
    expect(login.headers['set-cookie']).not.toEqual(page.headers['set-cookie']);
    expect((login.headers['set-cookie'] as unknown as string[])[0]).toContain('HttpOnly');
    expect((login.headers['set-cookie'] as unknown as string[])[0]).toContain('SameSite=Strict');
    const outsider = request.agent(f.app);
    const publicPage = await outsider.get('/admin/login');
    for (let i = 0; i < 10; i++) {
      const response = await outsider.post('/admin/login').type('form').send({ username: 'unknown', password: 'wrong', _csrf: csrf(publicPage.text) }).expect(401);
      expect(response.text).toContain('Username or password is incorrect.');
    }
    await outsider.post('/admin/login').type('form').send({ _csrf: csrf(publicPage.text) }).expect(429);
  } finally { f.db.close(); }
});
test('content and authenticated sessions survive reopening SQLite', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-integration-')); const filename = join(directory, 'db.sqlite');
  const f = await fixture(filename);
  let db: ReturnType<typeof openDatabase> | undefined;
  try {
    const loginPage = await f.agent.get('/admin/login');
    const login = await f.agent.post('/admin/login').type('form').send({ username: 'owner', password: testPassword, _csrf: csrf(loginPage.text) });
    const cookie = login.headers['set-cookie'] as unknown as string[];
    const admin = await f.agent.get('/admin');
    const updated = { name: 'Persistent Name', title: 'Engineer', biography: 'Stored across restarts.' };
    await f.agent.post('/admin/presentation').type('form').send({ ...updated, _csrf: csrf(admin.text) }).expect(303);
    f.db.close(); db = openDatabase(filename);
    const app = await createApp({ db, secret: 'test-only-session-secret-not-for-production' });
    expect(getProfile(db)).toEqual(updated);
    await request(app).get('/admin').set('Cookie', cookie).expect(200);
  } finally { if (f.db.open) f.db.close(); db?.close(); rmSync(directory, { recursive: true, force: true }); }
});
