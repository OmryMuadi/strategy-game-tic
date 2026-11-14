import { applyMove } from './engine';
import { createInitialGame } from './initialState';
import type { GameState, Move } from './types';

export type GameAction =
  | { type: 'play'; move: Move }
  | { type: 'restart' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'play': return applyMove(state, action.move);
    case 'restart': return createInitialGame(state.mode);
  }
}
