import { openDatabase } from './database.js';
import { createApp } from './app.js';
import { readConfig } from './config.js';
const config = readConfig();
const db = openDatabase(config.dbPath);
const app = await createApp({ db, ...config });
const server = app.listen(config.port, config.host, () => console.log(`Portfolio: http://${config.host}:${config.port}`));
function stop() { server.close(() => { db.close(); process.exitCode = 0; }); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
