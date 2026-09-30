import fc from 'fast-check';
fc.configureGlobal({ numRuns: 100, ...(process.env.FC_SEED ? { seed: Number(process.env.FC_SEED) } : {}), ...(process.env.FC_PATH ? { path: process.env.FC_PATH } : {}) });
