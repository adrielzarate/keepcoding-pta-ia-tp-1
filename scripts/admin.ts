import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { resolve } from 'node:path';
import { openDatabase } from '../src/database.js';
import { hashPassword } from '../src/password.js';
let muted = false;
const output = new Writable({ write(chunk, _encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); } });
const rl = createInterface({ input: process.stdin, output, terminal: true });
try {
  const username = (await rl.question('Administrator username: ')).trim();
  if (!/^[a-zA-Z0-9._-]{3,100}$/.test(username)) throw new Error('Use 3–100 letters, numbers, dots, hyphens or underscores.');
  process.stdout.write('Password (12–256 characters, hidden): ');
  muted = true;
  const password = await rl.question('');
  muted = false;
  process.stdout.write('\nConfirm password: ');
  muted = true;
  const confirmation = await rl.question('');
  muted = false;
  process.stdout.write('\n');
  if (password !== confirmation) throw new Error('Passwords do not match.');
  const hash = await hashPassword(password);
  const db = openDatabase(resolve(process.env.DATABASE_PATH ?? 'data/portfolio.sqlite'));
  try {
    db.transaction(() => {
      db.prepare('INSERT INTO administrator (id, username, password_hash) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET username = excluded.username, password_hash = excluded.password_hash').run(username, hash);
      const sessionsExist = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'sessions'").get();
      if (sessionsExist) db.exec('DELETE FROM sessions');
    })();
  } finally { db.close(); }
  console.log('Administrator saved. Existing sessions have been revoked.');
} catch (error) { console.error(error instanceof Error ? error.message : 'Unable to save administrator.'); process.exitCode = 1; }
finally { rl.close(); }
