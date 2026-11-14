// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
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
  render(<MemoryRouter><GamePage mode="classic" /></MemoryRouter>);
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

it('blocks unsafe moves in Checkmate and keeps the mode on restart', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><GamePage mode="checkmate" /></MemoryRouter>);

  await user.click(square(1, 1));
  await user.click(square(1, 9));
  await user.click(square(9, 1));
  await user.click(square(1, 8));
  expect(square(8, 1).disabled).toBe(true);
  expect(square(8, 2).disabled).toBe(false);

  await user.click(screen.getByRole('button', { name: 'Restart' }));
  expect(screen.getByText('Checkmate')).toBeTruthy();
  expect(square(8, 1).disabled).toBe(false);
});

