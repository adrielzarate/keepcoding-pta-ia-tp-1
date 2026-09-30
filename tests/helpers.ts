import request from 'supertest';
import { openDatabase } from '../src/database.js';
import { createApp } from '../src/app.js';
import { hashPassword } from '../src/password.js';
export const testPassword = 'Only-for-isolated-tests-123!';
export function csrf(html: string) {
  const token = /name="_csrf" value="([^"]+)"/.exec(html)?.[1];
  if (!token) throw new Error('Missing CSRF token');
  return token;
}
export async function fixture(filename = ':memory:') {
  const db = openDatabase(filename);
  db.prepare('INSERT OR REPLACE INTO administrator VALUES (1, ?, ?)').run('owner', await hashPassword(testPassword));
  const app = await createApp({ db, secret: 'test-only-session-secret-not-for-production' });
  const agent = request.agent(app);
  let authCookies: string[] = [];
  async function login() {
    const page = await agent.get('/admin/login').expect(200);
    const response = await agent.post('/admin/login').type('form').send({ _csrf: csrf(page.text), username: 'owner', password: testPassword }).expect(303);
    authCookies = response.headers['set-cookie'] as unknown as string[];
    return csrf((await agent.get('/admin').expect(200)).text);
  }
  return { db, app, agent, login, getAuthCookies: () => authCookies };
}
