export const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Position = (typeof positions)[number];
export type GameMode = 'classic' | 'checkmate';
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly Cell[];

export interface Move {
  readonly board: Position;
  readonly cell: Position;
}

export type GameResult =
  | { readonly kind: 'playing' }
  | { readonly kind: 'win'; readonly player: Player; readonly board: Position; readonly line: readonly Position[] }
  | { readonly kind: 'checkmate'; readonly player: Player }
  | { readonly kind: 'draw' };

export interface GameState {
  readonly mode: GameMode;
  readonly boards: readonly Board[];
  readonly turn: Player;
  readonly requiredBoard: Position | null;
  readonly lastMove: Move | null;
  readonly result: GameResult;
}
