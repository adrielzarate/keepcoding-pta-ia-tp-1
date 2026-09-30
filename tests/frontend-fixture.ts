export function makeForm() {
  const form = document.createElement('form');
  for (const [key, max] of [['name', 100], ['title', 160], ['biography', 5000]] as const) {
    const field = document.createElement(key === 'biography' ? 'textarea' : 'input');
    field.name = key; field.maxLength = max; field.value = 'Example'; form.append(field);
    const error = document.createElement('p'); error.dataset.error = key; form.append(error);
  }
  const counter = document.createElement('span'); counter.dataset.biographyCount = ''; form.append(counter);
  const status = document.createElement('span'); status.dataset.saveStatus = ''; form.append(status);
  document.body.append(form);
  return form;
}
