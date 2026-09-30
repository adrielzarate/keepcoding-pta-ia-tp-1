import { context } from 'esbuild';
import { spawn } from 'node:child_process';
const bundle = await context({ entryPoints: ['src/client/presentation.ts', 'src/client/project.ts'], bundle: true, format: 'esm', outdir: 'public', entryNames: '[name]', sourcemap: false });
await bundle.watch();
const server = spawn(process.execPath, ['--env-file=.env', '--import', 'tsx', '--watch', 'src/server.ts'], { stdio: 'inherit' });
server.on('exit', async code => { await bundle.dispose(); process.exitCode = code ?? 0; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
