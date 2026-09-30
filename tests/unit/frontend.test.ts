// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { bindPresentation } from '../../src/client/presentation.js';
import { makeForm } from '../frontend-fixture.js';
afterEach(() => { document.body.replaceChildren(); });
test('invalid input prevents submission and focuses the first error', () => {
  const form = makeForm(); bindPresentation(form);
  (form.elements.namedItem('name') as HTMLInputElement).value = '  ';
  const event = new SubmitEvent('submit', { cancelable: true });
  form.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(form.elements.namedItem('name'));
  expect(form.querySelector('[data-error="name"]')?.textContent).toBe('Name is required.');
});
test('typing updates character count and unsaved status', () => {
  const form = makeForm(); bindPresentation(form);
  (form.elements.namedItem('biography') as HTMLTextAreaElement).value = 'Hello';
  form.dispatchEvent(new Event('input'));
  expect(form.querySelector('[data-biography-count]')?.textContent).toBe('5 / 5000');
  expect(form.querySelector('[data-save-status]')?.textContent).toBe('Unsaved changes');
});
