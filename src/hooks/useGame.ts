import { useReducer } from 'react';
import { getLegalMoves } from '../game/engine';
import { createInitialGame } from '../game/initialState';
import { gameReducer } from '../game/reducer';
import type { GameMode, Move } from '../game/types';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGame);
  return {
    state,
    legalMoves: getLegalMoves(state),
    play: (move: Move) => dispatch({ type: 'play', move }),
    changeMode: (mode: GameMode) => dispatch({ type: 'changeMode', mode }),
    restart: () => dispatch({ type: 'restart' }),
  };
}
