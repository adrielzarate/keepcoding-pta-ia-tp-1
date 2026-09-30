import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const binary = process.env.OPENGREP_BIN || (existsSync('.tools/opengrep') ? '.tools/opengrep' : 'opengrep');
const result = spawnSync(binary, ['scan', '--config', 'security/rules.yml', '--error', '--disable-version-check', '--no-git-ignore', 'src', 'scripts', 'views'], { stdio: 'inherit', env: { ...process.env, OPENGREP_SEND_METRICS: 'off' } });
if (result.error) console.error('OpenGrep unavailable. Run pnpm security:install or set OPENGREP_BIN.');
process.exitCode = result.error ? 1 : (result.status ?? 1);
