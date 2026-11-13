import { describe, expect, it } from 'vitest';
import { applyMove, getGameResult, getLegalMoves, isValidMove } from './engine';
import { createInitialGame } from './initialState';
import { gameReducer } from './reducer';
import { isDrawn } from './rules';
import type { Board, GameState, Position } from './types';

const drawnBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

function withBoards(overrides: Partial<Record<Position, Board>>, changes: Partial<GameState> = {}): GameState {
  const initial = createInitialGame();
  return {
    ...initial,
    ...changes,
    boards: initial.boards.map((board, index) => overrides[index as Position] ?? board),
  };
}

describe('moves and results', () => {
  it('starts with X and allows all 81 opening moves', () => {
    const state = createInitialGame();
    expect(state.turn).toBe('X');
    expect(getLegalMoves(state)).toHaveLength(81);
  });

  it('routes the opponent, alternates turns, and updates only the played board', () => {
    const initial = createInitialGame();
    const next = applyMove(initial, { board: 3, cell: 7 });
    expect(next.turn).toBe('O');
    expect(next.requiredBoard).toBe(7);
    expect(next.boards[3][7]).toBe('X');
    expect(initial.boards[3][7]).toBeNull();
    expect(next.boards[7]).toBe(initial.boards[7]);
    expect(getLegalMoves(next)).toHaveLength(9);
    expect(getLegalMoves(next).every((move) => move.board === 7)).toBe(true);
    expect(applyMove(next, { board: 7, cell: 3 }).turn).toBe('X');
  });

  it('rejects occupied, misrouted, and out-of-range moves', () => {
    const state = applyMove(createInitialGame(), { board: 0, cell: 0 });
    expect(applyMove(state, { board: 0, cell: 0 })).toBe(state);
    expect(applyMove(state, { board: 1, cell: 0 })).toBe(state);
    expect(applyMove(state, { board: 0, cell: 9 as Position })).toBe(state);
  });

  it.each([[0, 1, 2], [0, 3, 6], [0, 4, 8], [2, 4, 6]])(
    'wins immediately with a line at %i, %i, %i',
    (first, second, last) => {
      const board = createInitialGame().boards[0].map((cell, index) =>
        index === first || index === second ? 'X' : cell,
      );
      const finished = applyMove(withBoards({ 0: board }), { board: 0, cell: last as Position });
      expect(getGameResult(finished)).toEqual({ kind: 'win', player: 'X', board: 0, line: [first, second, last] });
      expect(getLegalMoves(finished)).toEqual([]);
      expect(applyMove(finished, { board: 3, cell: 3 })).toBe(finished);
    },
  );

  it('blocks moves to drawn boards but allows a winning move to point to one', () => {
    const state = withBoards({ 0: ['O', 'O', null, null, null, null, null, null, null], 2: drawnBoard }, { turn: 'O' });
    expect(isValidMove(state, { board: 1, cell: 2 })).toBe(false);
    expect(isValidMove(state, { board: 2, cell: 1 })).toBe(false);
    expect(getGameResult(applyMove(state, { board: 0, cell: 2 }))).toMatchObject({ kind: 'win', player: 'O' });
  });

  it('closes a drawn board when the destination is open', () => {
    const board = drawnBoard.map((cell, index) => index === 1 ? null : cell);
    const next = applyMove(withBoards({ 0: board }, { turn: 'O' }), { board: 0, cell: 1 });
    expect(isDrawn(next.boards[0])).toBe(true);
    expect(next.requiredBoard).toBe(1);
    expect(next.result.kind).toBe('playing');
  });

  it('rejects a move that draws its own destination', () => {
    const board = drawnBoard.map((cell, index) => index === 0 ? null : cell);
    const state = withBoards({ 0: board });
    expect(applyMove(state, { board: 0, cell: 0 })).toBe(state);
  });

  it('ends in a draw when the opponent has no legal move', () => {
    const board = drawnBoard.map((cell, index) => index === 1 ? null : cell);
    const state = withBoards({ 0: board, 1: drawnBoard }, { requiredBoard: 2 });
    const next = applyMove(state, { board: 2, cell: 0 });
    expect(next.result.kind).toBe('draw');
    expect(getLegalMoves(next)).toEqual([]);
    expect(applyMove(next, { board: 0, cell: 1 })).toBe(next);
    expect(gameReducer(next, { type: 'restart' })).toEqual(createInitialGame());
  });
});

describe('Checkmate mode', () => {
  it('blocks the move from the screenshot while Classic allows it', () => {
    const opening = [
      { board: 0, cell: 0 }, { board: 0, cell: 8 },
      { board: 8, cell: 0 }, { board: 0, cell: 7 },
    ] as const;
    const classic = opening.reduce(applyMove, createInitialGame());
    const checkmate = opening.reduce(applyMove, createInitialGame('checkmate'));
    const unsafeMove = { board: 7, cell: 0 } as const;

    const afterUnsafeMove = applyMove(classic, unsafeMove);
    expect(afterUnsafeMove.requiredBoard).toBe(0);
    expect(getGameResult(applyMove(afterUnsafeMove, { board: 0, cell: 6 })))
      .toMatchObject({ kind: 'win', player: 'O' });
    expect(checkmate.requiredBoard).toBe(7);
    expect(applyMove(checkmate, unsafeMove)).toBe(checkmate);
    expect(getLegalMoves(checkmate)).toHaveLength(8);
  });

  it('allows a winning move even if its destination also contains a threat', () => {
    const state = withBoards({
      0: ['X', 'X', null, null, null, null, null, null, null],
      2: ['O', 'O', null, null, null, null, null, null, null],
    }, { mode: 'checkmate' });
    expect(getGameResult(applyMove(state, { board: 0, cell: 2 })))
      .toMatchObject({ kind: 'win', player: 'X' });
  });

  it('allows a move back to the same board when the placement blocks the threat', () => {
    const state = withBoards({
      0: [null, 'O', 'O', null, null, null, null, null, null],
    }, { mode: 'checkmate', requiredBoard: 0 });
    expect(isValidMove(state, { board: 0, cell: 0 })).toBe(true);
  });

  it('awards checkmate when all otherwise legal replies give away an immediate win', () => {
    const nearlyDrawn = drawnBoard.map((cell, index) => index === 0 ? null : cell);
    const state = withBoards({
      0: ['O', 'O', null, null, null, null, null, null, null],
      7: nearlyDrawn,
    }, { mode: 'checkmate', turn: 'O', requiredBoard: 6 });
    const next = applyMove(state, { board: 6, cell: 7 });
    expect(getGameResult(next)).toEqual({ kind: 'checkmate', player: 'O' });
    expect(getLegalMoves(next)).toEqual([]);
    expect(gameReducer(next, { type: 'restart' })).toEqual(createInitialGame('checkmate'));
  });

  it('still draws when there are no moves under Classic rules', () => {
    const board = drawnBoard.map((cell, index) => index === 1 ? null : cell);
    const state = withBoards({ 0: board, 1: drawnBoard }, { mode: 'checkmate', requiredBoard: 2 });
    expect(getGameResult(applyMove(state, { board: 2, cell: 0 }))).toEqual({ kind: 'draw' });
  });
});

