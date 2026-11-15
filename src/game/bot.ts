import { applyMove, getLegalMoves } from './engine';
import type { GameState, Move } from './types';

export function chooseBotMove(state: GameState): Move | undefined {
  if (state.turn !== 'O' || state.result.kind !== 'playing') return undefined;

  let bestMove: Move | undefined;
  let bestScore = -Infinity;

  for (const move of getLegalMoves(state)) {
    const next = applyMove(state, move);
    if (next.result.kind === 'win' || next.result.kind === 'checkmate') return move;

    // Prefer a safe reply to a draw, and a draw to handing X an immediate win.
    const replies = getLegalMoves(next);
    const givesAwayWin = replies.some((reply) => {
      const { result } = applyMove(next, reply);
      return result.kind === 'win' || result.kind === 'checkmate';
    });
    const score = givesAwayWin ? -1 : next.result.kind === 'draw' ? 0 : 10 - replies.length;
    if (score > bestScore) {
      bestMove = move;
      bestScore = score;
    }
  }

  return bestMove;
}

