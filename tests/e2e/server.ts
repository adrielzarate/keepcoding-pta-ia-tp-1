import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fixture } from '../helpers.js';
const directory = mkdtempSync(join(tmpdir(), 'portfolio-e2e-'));
const f = await fixture(join(directory, 'test.sqlite'));
const server = f.app.listen(3107, '127.0.0.1');
const stop = () => server.close(() => { f.db.close(); rmSync(directory, { recursive: true, force: true }); });
process.on('SIGTERM', stop); process.on('SIGINT', stop);
