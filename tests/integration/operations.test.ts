import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { openDatabase, getProfile, saveProfile } from '../../src/database.js';
import { verifyPassword } from '../../src/password.js';
import { SqliteSessionStore } from '../../src/session-store.js';
function run(script: string, database: string, args: string[] = [], respond?: (output: string, send: (text: string) => void) => void) {
  return new Promise<{ code: number | null; output: string }>((resolve, reject) => {
    const child = spawn(process.execPath, ['--import', 'tsx', script, ...args], { env: { ...process.env, DATABASE_PATH: database }, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (data: Buffer) => { const text = data.toString(); output += text; respond?.(text, input => child.stdin.write(input)); });
    child.stderr.on('data', (data: Buffer) => { output += data.toString(); });
    child.on('error', reject);
    child.on('close', code => resolve({ code, output }));
  });
}
test('administrator setup stores only a hash and revokes existing sessions', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-admin-')); const filename = join(directory, 'db.sqlite');
  const password = 'Private test password 123!';
  const db = openDatabase(filename); new SqliteSessionStore(db);
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run('old-session', '{}', Date.now() + 60000);
  try {
    const result = await run('scripts/admin.ts', filename, [], (output, send) => {
      if (output.includes('Administrator username:')) send('owner\n');
      if (output.includes('hidden):')) send(password + '\n');
      if (output.includes('Confirm password:')) send(password + '\n');
    });
    expect(result.code).toBe(0); expect(result.output).not.toContain(password);
    const admin = db.prepare('SELECT username, password_hash FROM administrator').get() as { username: string; password_hash: string };
    expect(admin.username).toBe('owner'); expect(await verifyPassword(password, admin.password_hash)).toBe(true);
    expect(db.prepare('SELECT * FROM sessions').all()).toHaveLength(0);
  } finally { db.close(); rmSync(directory, { recursive: true, force: true }); }
});
test('online backup can be reopened and refuses to overwrite an existing copy', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-backup-')); const filename = join(directory, 'db.sqlite'); const target = join(directory, 'copy.sqlite');
  const db = openDatabase(filename);
  try {
    const profile = { name: 'Backup owner', title: 'Developer', biography: 'Persisted in a live database.' };
    saveProfile(db, profile);
    expect((await run('scripts/backup.ts', filename, [target])).code).toBe(0);
    const restored = openDatabase(target);
    try { expect(getProfile(restored)).toEqual(profile); } finally { restored.close(); }
    expect((await run('scripts/backup.ts', filename, [target])).code).toBe(1);
  } finally { db.close(); rmSync(directory, { recursive: true, force: true }); }
});
