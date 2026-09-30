import { expect, test } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/password.js';
test('hashes with independent salts and verifies the correct password only', async () => {
  const password = 'A long test password!';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  expect(first).not.toBe(second);
  expect(first).not.toContain(password);
  expect(await verifyPassword(password, first)).toBe(true);
  expect(await verifyPassword('wrong password', first)).toBe(false);
  expect(await verifyPassword(password, 'malformed')).toBe(false);
});
test('rejects passwords outside the configured limits', async () => {
  await expect(hashPassword('short')).rejects.toThrow();
  await expect(hashPassword('a'.repeat(257))).rejects.toThrow();
});
