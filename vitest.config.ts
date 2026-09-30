import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/{unit,pbt,integration}/**/*.test.ts'], setupFiles: ['tests/setup.ts'], testTimeout: 15000 } });
