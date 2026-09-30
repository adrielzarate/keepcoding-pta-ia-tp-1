import { validateProfile, type Profile } from '../shared/profile.js';
export function bindPresentation(form: HTMLFormElement) {
  form.noValidate = true;
  const fields = ['name', 'title', 'biography'] as const;
  const update = () => {
    const values = Object.fromEntries(new FormData(form).entries());
    const result = validateProfile(values);
    for (const key of fields) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      const error = form.querySelector<HTMLElement>(`[data-error="${key}"]`);
      field.setAttribute('aria-invalid', String(Boolean(result.errors[key])));
      if (error) error.textContent = result.errors[key] ?? '';
    }
    return result;
  };
  const input = () => {
    const counter = form.querySelector<HTMLElement>('[data-biography-count]');
    const biography = form.elements.namedItem('biography') as HTMLTextAreaElement;
    if (counter) counter.textContent = `${biography.value.length} / ${biography.maxLength}`;
    const status = form.querySelector<HTMLElement>('[data-save-status]');
    if (status) status.textContent = 'Unsaved changes';
  };
  const submit = (event: SubmitEvent) => {
    const result = update();
    if (!result.valid) {
      event.preventDefault();
      const first = Object.keys(result.errors)[0] as keyof Profile;
      (form.elements.namedItem(first) as HTMLElement).focus();
    }
  };
  form.addEventListener('input', input);
  form.addEventListener('submit', submit);
  return () => { form.removeEventListener('input', input); form.removeEventListener('submit', submit); };
}
if (typeof document !== 'undefined') {
  const form = document.querySelector<HTMLFormElement>('[data-presentation-form]');
  if (form) bindPresentation(form);
}
