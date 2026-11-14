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

it('opens each destination from the landing page', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><App /></MemoryRouter>);

  for (const mode of ['Classic', 'Checkmate']) {
    await user.click(screen.getByRole('link', { name: mode }));
    expect(screen.getByText(mode)).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Player X to move');
    expect(screen.queryByRole('combobox')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Back to home' }));
  }

  await user.click(screen.getByRole('link', { name: 'Instructions' }));
  expect(screen.getByRole('heading', { name: 'Instructions' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Classic' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Checkmate' })).toBeTruthy();
  expect(screen.queryByRole('combobox')).toBeNull();
});

it('remembers Hebrew and applies it to the game and instructions', async () => {
  const user = userEvent.setup();
  const app = <MemoryRouter><App /></MemoryRouter>;
  const view = render(app);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'he');

  view.unmount();
  render(app);
  expect(screen.getByRole<HTMLSelectElement>('combobox', { name: 'שפה' }).value).toBe('he');
  expect(document.documentElement.lang).toBe('he');
  expect(document.documentElement.dir).toBe('rtl');
  expect(screen.getByRole('main').getAttribute('dir')).toBe('ltr');
  expect(screen.getByText('משחק אסטרטגיה לשני שחקנים על תשעה לוחות מקושרים.').getAttribute('dir')).toBe('rtl');

  await user.click(screen.getByRole('link', { name: 'קלאסי' }));
  expect(screen.getByRole('status').textContent).toContain('תור השחקן X');
  expect(screen.getByRole('group', { name: 'לוח המשחק' }).getAttribute('dir')).toBe('ltr');
  await user.click(screen.getByRole('button', { name: 'חזרה לדף הבית' }));

  await user.click(screen.getByRole('link', { name: 'הוראות משחק' }));
  expect(screen.getByRole('heading', { name: 'הוראות משחק' })).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'חזרה לדף הבית' }));
  await user.selectOptions(screen.getByRole('combobox', { name: 'שפה' }), 'en');
  expect(document.documentElement.dir).toBe('ltr');
  expect(screen.getByRole('link', { name: 'Classic' })).toBeTruthy();
});

