import { positions, type GameMode, type GameState } from './types';

export function createInitialGame(mode: GameMode = 'classic'): GameState {
  return {
    mode,
    boards: positions.map(() => positions.map(() => null)),
    turn: 'X',
    requiredBoard: null,
    lastMove: null,
    result: { kind: 'playing' },
  };
}
