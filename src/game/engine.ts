import { getWinningLine, isDrawn } from './rules';
import { positions, type Board, type GameState, type Move, type Player } from './types';

function boardAfterMove(state: GameState, move: Move): Board {
  return state.boards[move.board].map((cell, index) => index === move.cell ? state.turn : cell);
}

function evaluateClassicMove(state: GameState, move: Move) {
  if (state.result.kind !== 'playing' ||
      !positions.includes(move.board) || !positions.includes(move.cell) ||
      (state.requiredBoard !== null && move.board !== state.requiredBoard) ||
      state.boards[move.board][move.cell] !== null) {
    return null;
  }

  const board = boardAfterMove(state, move);
  const line = getWinningLine(board, state.turn);
  const destination = move.board === move.cell ? board : state.boards[move.cell];
  if (!line && isDrawn(destination)) return null;

  return { board, line, destination };
}

function opponentOf(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

function evaluateMove(state: GameState, move: Move) {
  const evaluated = evaluateClassicMove(state, move);
  if (!evaluated || state.mode === 'classic' || evaluated.line) return evaluated;

  const opponent = opponentOf(state.turn);
  const givesImmediateWin = positions.some((cell) =>
    evaluated.destination[cell] === null && getWinningLine(
      evaluated.destination.map((mark, index) => index === cell ? opponent : mark),
      opponent,
    ),
  );
  return givesImmediateWin ? null : evaluated;
}

export function isValidMove(state: GameState, move: Move): boolean {
  return evaluateMove(state, move) !== null;
}

function candidateMoves(state: GameState): Move[] {
  const boards = state.requiredBoard === null ? positions : [state.requiredBoard];
  return boards.flatMap((board) =>
    positions.map((cell) => ({ board, cell })),
  );
}

export function getLegalMoves(state: GameState): Move[] {
  return candidateMoves(state).filter((move) => isValidMove(state, move));
}

export function applyMove(state: GameState, move: Move): GameState {
  const evaluated = evaluateMove(state, move);
  if (!evaluated) return state;

  const boards = state.boards.map((board, index) => index === move.board ? evaluated.board : board);
  const lastMove = { ...move };
  if (evaluated.line) {
    return {
      ...state, boards, lastMove, requiredBoard: null,
      result: { kind: 'win', player: state.turn, board: move.board, line: evaluated.line },
    };
  }

  const next: GameState = {
    ...state, boards, lastMove, requiredBoard: move.cell,
    turn: opponentOf(state.turn),
  };
  if (getLegalMoves(next).length) return next;
  if (next.mode === 'checkmate' && candidateMoves(next).some((move) => evaluateClassicMove(next, move))) {
    return { ...next, result: { kind: 'checkmate', player: state.turn } };
  }
  return { ...next, result: { kind: 'draw' } };
}

export function getGameResult(state: GameState) {
  return state.result;
}
