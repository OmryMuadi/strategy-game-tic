import type { Board, Player, Position } from './types';

const winningLines: readonly (readonly Position[])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function getWinningLine(board: Board, player: Player) {
  return winningLines.find((line) => line.every((cell) => board[cell] === player));
}

export function isDrawn(board: Board): boolean {
  return !board.includes(null) && !getWinningLine(board, 'X') && !getWinningLine(board, 'O');
}
