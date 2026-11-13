// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { GamePage } from './GamePage';

afterEach(cleanup);

function square(board: number, cell: number) {
  return screen.getByRole<HTMLButtonElement>('button', {
    name: `Board ${board}, square ${cell}, empty`,
  });
}

it('routes a local match, displays the winner, and starts a new match', async () => {
  const user = userEvent.setup();
  render(<GamePage />);
  expect(screen.getByRole('status').textContent).toContain('Player X to move');

  await user.click(square(1, 2));
  expect(screen.getByRole('status').textContent).toContain('Player O to move');
  expect(square(3, 1).disabled).toBe(true);
  expect(document.activeElement).toBe(square(2, 1));

  await user.keyboard('{Enter}');
  await user.click(square(1, 3));
  await user.click(square(3, 1));
  await user.click(square(1, 1));
  expect(screen.getByRole('status').textContent).toContain('Player X wins');
  expect(square(2, 2).disabled).toBe(true);

  const playAgain = screen.getByRole('button', { name: 'Play again' });
  expect(document.activeElement).toBe(playAgain);
  await user.click(playAgain);
  expect(screen.getByRole('status').textContent).toContain('Player X to move');
  expect(square(1, 2).disabled).toBe(false);
});

it('starts a new match when changing mode and disables the unsafe move from the screenshot', async () => {
  const user = userEvent.setup();
  render(<GamePage />);
  await user.click(square(1, 1));

  const checkmate = screen.getByRole('button', { name: 'Checkmate' });
  await user.click(checkmate);
  expect(checkmate.getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('status').textContent).toContain('Player X to move');

  await user.click(square(1, 1));
  await user.click(square(1, 9));
  await user.click(square(9, 1));
  await user.click(square(1, 8));
  expect(square(8, 1).disabled).toBe(true);
  expect(square(8, 2).disabled).toBe(false);

  await user.click(screen.getByRole('button', { name: 'Restart' }));
  expect(checkmate.getAttribute('aria-pressed')).toBe('true');
  expect(square(8, 1).disabled).toBe(false);
});

