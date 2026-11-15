import { expect, it } from 'vitest';
import { chooseBotMove } from './bot';
import { applyMove, isValidMove } from './engine';
import { createInitialGame } from './initialState';
import type { GameState } from './types';

it.each(['classic', 'checkmate'] as const)('chooses an immediate win in %s', (mode) => {
  const initial = createInitialGame(mode);
  const state: GameState = {
    ...initial,
    turn: 'O',
    requiredBoard: 0,
    boards: [['O', 'O', null, null, null, null, null, null, null], ...initial.boards.slice(1)],
  };
  expect(chooseBotMove(state)).toEqual({ board: 0, cell: 2 });
});

it('avoids sending X to a board where X can win immediately', () => {
  const initial = createInitialGame();
  const state: GameState = {
    ...initial,
    turn: 'O',
    requiredBoard: 1,
    boards: [['X', 'X', null, null, null, null, null, null, null], ...initial.boards.slice(1)],
  };
  const move = chooseBotMove(state)!;
  expect(isValidMove(state, move)).toBe(true);
  expect(move.cell).not.toBe(0);
});

it('skips human turns and finished matches', () => {
  const initial = createInitialGame();
  expect(chooseBotMove(initial)).toBeUndefined();
  expect(chooseBotMove({ ...initial, turn: 'O', result: { kind: 'draw' } })).toBeUndefined();
  const botTurn = applyMove(initial, { board: 0, cell: 0 });
  expect(chooseBotMove(botTurn)?.board).toBe(0);
});

