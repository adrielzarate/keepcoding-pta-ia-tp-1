import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { openDatabase } from '../src/database.js';
const filename = resolve(process.env.DATABASE_PATH ?? 'data/portfolio.sqlite');
if (!existsSync(filename)) throw new Error('Database does not exist; refusing to create an empty backup.');
const destination = resolve(process.argv[2] ?? `backups/portfolio-${Date.now()}.sqlite`);
if (existsSync(destination)) throw new Error('Backup destination already exists. Choose a new filename.');
mkdirSync(dirname(destination), { recursive: true, mode: 0o700 });
const db = openDatabase(filename);
try { await db.backup(destination); console.log(`Backup saved: ${destination}`); }
finally { db.close(); }
