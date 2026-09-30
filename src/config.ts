import { resolve } from 'node:path';
export function readConfig() {
  const production = process.env.NODE_ENV === 'production';
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Set SESSION_SECRET to at least 32 random characters. See .env.example.');
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  const proxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
  if (!Number.isInteger(proxyHops) || proxyHops < 0) throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
  return { secret, production, port, proxyHops, host: process.env.HOST ?? '127.0.0.1', dbPath: resolve(process.env.DATABASE_PATH ?? 'data/portfolio.sqlite') };
}
