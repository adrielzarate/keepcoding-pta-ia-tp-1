import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
try {
  const template = await readFile('.env.example', 'utf8');
  await writeFile('.env', template.replace('SESSION_SECRET=', `SESSION_SECRET=${randomBytes(48).toString('hex')}`), { flag: 'wx', mode: 0o600 });
  console.log('Created .env with a random session secret. Next: pnpm admin:setup.');
} catch (error) {
  if (error.code === 'EEXIST') console.log('.env already exists; left unchanged.');
  else throw error;
}
