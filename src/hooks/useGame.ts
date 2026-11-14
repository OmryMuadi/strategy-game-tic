import { useReducer } from 'react';
import { getLegalMoves } from '../game/engine';
import { createInitialGame } from '../game/initialState';
import { gameReducer } from '../game/reducer';
import type { GameMode, Move } from '../game/types';

export function useGame(mode: GameMode) {
  const [state, dispatch] = useReducer(gameReducer, mode, createInitialGame);
  return {
    state,
    legalMoves: getLegalMoves(state),
    play: (move: Move) => dispatch({ type: 'play', move }),
    restart: () => dispatch({ type: 'restart' }),
  };
}
