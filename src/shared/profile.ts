export const limits = { name: 100, title: 160, biography: 5000 } as const;
export type Profile = { name: string; title: string; biography: string };
export type ProfileErrors = Partial<Record<keyof Profile, string>>;
const labels = { name: 'Name', title: 'Professional title', biography: 'Biography' };
export function validateProfile(input: unknown): { value: Profile; errors: ProfileErrors; valid: boolean } {
  const source = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const value: Profile = { name: '', title: '', biography: '' };
  const errors: ProfileErrors = {};
  for (const key of Object.keys(limits) as (keyof Profile)[]) {
    const raw = source[key];
    if (typeof raw !== 'string') { errors[key] = `${labels[key]} is required.`; continue; }
    value[key] = raw.replace(/\r\n?/g, '\n').trim();
    if (!value[key]) errors[key] = `${labels[key]} is required.`;
    else if (value[key].length > limits[key]) errors[key] = `${labels[key]} must be ${limits[key]} characters or fewer.`;
    // Only ordinary whitespace controls are allowed; all content remains plain text.
    // eslint-disable-next-line no-control-regex -- Deliberately reject non-text control characters.
    else if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(value[key])) errors[key] = `${labels[key]} contains unsupported characters.`;
    else if (key !== 'biography' && /\n/.test(value[key])) errors[key] = `${labels[key]} must be on one line.`;
  }
  return { value, errors, valid: Object.keys(errors).length === 0 };
}
