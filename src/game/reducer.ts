import { applyMove } from './engine';
import { createInitialGame } from './initialState';
import type { GameMode, GameState, Move } from './types';

export type GameAction =
  | { type: 'play'; move: Move }
  | { type: 'restart' }
  | { type: 'changeMode'; mode: GameMode };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'play': return applyMove(state, action.move);
    case 'restart': return createInitialGame(state.mode);
    case 'changeMode': return action.mode === state.mode ? state : createInitialGame(action.mode);
  }
}
