// @vitest-environment jsdom
import fc from 'fast-check';
import { expect, test } from 'vitest';
import { bindProjectForm } from '../../src/client/project.js';
function makeForm() {
  const form = document.createElement('form'); form.dataset.projectForm = '';
  for (const name of ['title', 'description', 'technologies', 'codeUrl', 'demoUrl']) {
    const field = document.createElement(name === 'description' || name === 'technologies' ? 'textarea' : 'input');
    field.name = name; field.value = name === 'codeUrl' || name === 'demoUrl' ? '' : 'Valid';
    form.append(field); const error = document.createElement('p'); error.dataset.error = name; form.append(error);
  }
  document.body.append(form); return form;
}
test('generated blank titles never submit and produce an associated text error', () => {
  fc.assert(fc.property(fc.array(fc.constantFrom(' ', '\t'), { maxLength: 20 }), blanks => {
    const form = makeForm(); const dispose = bindProjectForm(form);
    (form.elements.namedItem('title') as HTMLInputElement).value = blanks.join('');
    const submit = new SubmitEvent('submit', { cancelable: true }); form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
    expect(form.querySelector('[data-error="title"]')?.textContent).toBe('Title is required.');
    dispose(); form.remove();
  }));
});
test('generated HTTP and HTTPS links allow ordinary form submission', () => {
  fc.assert(fc.property(fc.webUrl(), url => {
    const form = makeForm(); const dispose = bindProjectForm(form);
    (form.elements.namedItem('codeUrl') as HTMLInputElement).value = url;
    const submit = new SubmitEvent('submit', { cancelable: true }); form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(false);
    dispose(); form.remove();
  }));
});
