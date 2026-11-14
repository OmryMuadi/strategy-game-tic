# Strategy Tic

A local two-player strategy game played on nine small tic-tac-toe boards.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

## Rules

- X starts every match, including after a restart, and may open on any square.
- Players alternate. The position of a played square sends the opponent to the small board in the same position.
- The first three-in-a-row on any small board wins the match immediately. Rows, columns, and diagonals count.
- A full small board without a winning line is drawn. A non-winning move is illegal if it sends the opponent to a drawn board, including a board drawn by that move.
- A winning move can point to a drawn board. If a non-winning move leaves the next player with no legal move, the match ends in a draw.

The pure TypeScript engine lives in `src/game`. The React hook delegates play and restart to the reducer. The board uses the engine's legal moves to decide which squares to enable. The app uses hash routing so the web build can be served from a static directory.

## Modes

Classic uses the rules above. Checkmate also blocks any non-winning move that would let the opponent win on their very next turn. If every otherwise legal move would give away that win, the opponent wins by checkmate. A position with no move under Classic rules is still a draw.

Choose Classic, Checkmate, or Instructions on the home page. Each game starts a new match. Restart keeps the selected mode. Use the EN/HE dropdown on the home page to change the language.
