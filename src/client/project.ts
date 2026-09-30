import { normalizeProject, type Project } from '../shared/project.js';
export function bindProjectForm(form: HTMLFormElement) {
  form.noValidate = true;
  const update = () => {
    const values = Object.fromEntries(new FormData(form).entries());
    const result = normalizeProject(values);
    for (const key of ['title', 'description', 'technologies', 'codeUrl', 'demoUrl'] as const) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      const error = form.querySelector<HTMLElement>(`[data-error="${key}"]`);
      field.setAttribute('aria-invalid', String(Boolean(result.errors[key])));
      if (error) error.textContent = result.errors[key] ?? '';
    }
    return result;
  };
  const submit = (event: SubmitEvent) => {
    const result = update();
    if (!result.valid) {
      event.preventDefault();
      const first = Object.keys(result.errors)[0] as keyof Project;
      (form.elements.namedItem(first) as HTMLElement).focus();
    }
  };
  form.addEventListener('submit', submit);
  return () => form.removeEventListener('submit', submit);
}
if (typeof document !== 'undefined') {
  const form = document.querySelector<HTMLFormElement>('[data-project-form]');
  if (form) bindProjectForm(form);
}
