export const projectLimits = {
  title: 120,
  description: 3000,
  technology: 50,
  technologies: 20,
  url: 2048,
} as const;
export type Project = {
  title: string;
  description: string;
  technologies: string[];
  codeUrl: string | null;
  demoUrl: string | null;
};
export type ProjectErrors = Partial<Record<keyof Project, string>>;
const labels = { title: 'Title', description: 'Description', technologies: 'Technologies', codeUrl: 'Code link', demoUrl: 'Demo link' };
// eslint-disable-next-line no-control-regex -- Reject non-text control characters in user input.
const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
function stringField(input: Record<string, unknown>, key: 'title' | 'description', errors: ProjectErrors): string {
  const raw = input[key];
  if (typeof raw !== 'string') { errors[key] = `${labels[key]} is required.`; return ''; }
  const value = raw.replace(/\r\n?/g, '\n').trim();
  if (!value) errors[key] = `${labels[key]} is required.`;
  else if (value.length > projectLimits[key]) errors[key] = `${labels[key]} must be ${projectLimits[key]} characters or fewer.`;
  else if (controlCharacters.test(value)) errors[key] = `${labels[key]} contains unsupported characters.`;
  else if (key === 'title' && value.includes('\n')) errors[key] = 'Title must be on one line.';
  return value;
}
function normalizeTechnologies(raw: unknown, errors: ProjectErrors): string[] {
  if (typeof raw !== 'string' && !Array.isArray(raw)) { errors.technologies = 'Enter at least one technology.'; return []; }
  const entries: unknown[] = typeof raw === 'string' ? raw.split(/\r\n?|\n/u) : raw;
  const values: string[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    if (typeof entry !== 'string') { errors.technologies = 'Each technology must be text.'; continue; }
    const value = entry.trim();
    if (!value) continue;
    if (value.includes('\n') || controlCharacters.test(value)) { errors.technologies = 'Each technology must be on one line and contain supported characters.'; continue; }
    if (value.length > projectLimits.technology) { errors.technologies = `Each technology must be ${projectLimits.technology} characters or fewer.`; continue; }
    if (!seen.has(value)) { values.push(value); seen.add(value); }
  }
  if (!values.length) errors.technologies ??= 'Enter at least one technology.';
  if (values.length > projectLimits.technologies) errors.technologies = `Enter ${projectLimits.technologies} technologies or fewer.`;
  return values;
}
function normalizeLink(raw: unknown, key: 'codeUrl' | 'demoUrl', errors: ProjectErrors): string | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'string') { errors[key] = `${labels[key]} must be a link.`; return null; }
  const value = raw.trim();
  if (!value) return null;
  if (value.length > projectLimits.url || controlCharacters.test(value)) { errors[key] = `${labels[key]} must be ${projectLimits.url} characters or fewer.`; return null; }
  try {
    const url = new URL(value);
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname || url.username || url.password) throw new Error('Unsafe link');
    return value;
  } catch {
    errors[key] = 'Enter an absolute HTTP or HTTPS link.';
    return null;
  }
}
export function normalizeProject(input: unknown): { value: Project; errors: ProjectErrors; valid: boolean } {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const errors: ProjectErrors = {};
  const value: Project = {
    title: stringField(source, 'title', errors),
    description: stringField(source, 'description', errors),
    technologies: normalizeTechnologies(source.technologies, errors),
    codeUrl: normalizeLink(source.codeUrl, 'codeUrl', errors),
    demoUrl: normalizeLink(source.demoUrl, 'demoUrl', errors),
  };
  return { value, errors, valid: Object.keys(errors).length === 0 };
}
