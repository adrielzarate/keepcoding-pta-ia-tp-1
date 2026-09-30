// @vitest-environment jsdom
import fc from 'fast-check';
import { expect, test } from 'vitest';
import { bindPresentation } from '../../src/client/presentation.js';
import { makeForm } from '../frontend-fixture.js';
test('arbitrary blank names never submit or become HTML in an error message', () => {
  fc.assert(fc.property(fc.array(fc.constantFrom(' ', '\t'), { minLength: 0, maxLength: 100 }), spaces => {
    const form = makeForm(); const dispose = bindPresentation(form);
    (form.elements.namedItem('name') as HTMLInputElement).value = spaces.join('');
    const event = new SubmitEvent('submit', { cancelable: true }); form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(form.querySelector('[data-error="name"]')?.textContent).toBe('Name is required.');
    expect(form.querySelector('[data-error="name"]')?.children.length).toBe(0);
    dispose(); form.remove();
  }));
});
test('valid generated names permit ordinary browser submission', () => {
  fc.assert(fc.property(fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZé'), { minLength: 1, maxLength: 100 }), chars => {
    const form = makeForm(); const dispose = bindPresentation(form);
    (form.elements.namedItem('name') as HTMLInputElement).value = chars.join('');
    const event = new SubmitEvent('submit', { cancelable: true }); form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    dispose(); form.remove();
  }));
});
