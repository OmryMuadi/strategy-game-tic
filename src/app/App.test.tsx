// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';
import { App } from './App';

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
});

it('switches to Hebrew during a match, remembers the preference, and switches back', async () => {
  const user = userEvent.setup();
  const app = <MemoryRouter><App /></MemoryRouter>;
  const view = render(app);
  await user.click(screen.getByRole('button', { name: 'Board 1, square 2, empty' }));
  await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'he');

  expect(document.documentElement.lang).toBe('he');
  expect(document.documentElement.dir).toBe('rtl');
  expect(screen.getByRole('status').textContent).toContain('תור השחקן O');
  expect(screen.getByRole('group', { name: 'לוח המשחק' }).getAttribute('dir')).toBe('ltr');
  expect(screen.getByRole<HTMLButtonElement>('button', { name: 'לוח 2, משבצת 1, ריקה' }).disabled).toBe(false);

  view.unmount();
  render(app);
  expect(screen.getByRole<HTMLSelectElement>('combobox', { name: 'שפה' }).value).toBe('he');
  expect(screen.getByRole('status').textContent).toContain('תור השחקן X');

  await user.selectOptions(screen.getByRole('combobox', { name: 'שפה' }), 'en');
  expect(document.documentElement.lang).toBe('en');
  expect(document.documentElement.dir).toBe('ltr');
  expect(screen.getByRole('status').textContent).toContain('Player X to move');
});

