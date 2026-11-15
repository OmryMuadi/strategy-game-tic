import { useCallback, useLayoutEffect, useReducer } from 'react';
import { chooseBotMove } from '../game/bot';
import { getLegalMoves } from '../game/engine';
import { createInitialGame } from '../game/initialState';
import { gameReducer } from '../game/reducer';
import type { GameMode, Move } from '../game/types';

export function useGame(mode: GameMode, solo: boolean) {
  const [state, dispatch] = useReducer(gameReducer, mode, createInitialGame);
  const botTurn = solo && state.turn === 'O' && state.result.kind === 'playing';

  useLayoutEffect(() => {
    if (!botTurn) return;
    const timer = window.setTimeout(() => {
      const move = chooseBotMove(state);
      if (move) dispatch({ type: 'play', move });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [botTurn, state]);

  const play = useCallback((move: Move) => {
    if (!botTurn) dispatch({ type: 'play', move });
  }, [botTurn]);

  return {
    state,
    botTurn,
    legalMoves: botTurn ? [] : getLegalMoves(state),
    play,
    restart: () => dispatch({ type: 'restart' }),
  };
}
