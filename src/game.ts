export const BOARD_SIZE = 15;

export type Stone = "black" | "white";
export type Cell = Stone | null;
export type Board = Cell[];
export type GameResult = { kind: "playing" } | { kind: "victory"; winner: Stone } | { kind: "draw" };

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const;

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => null);
}

export function placeStone(board: Board, index: number, stone: Stone): Board {
  if (board[index]) {
    return board;
  }

  const nextBoard = [...board];
  nextBoard[index] = stone;
  return nextBoard;
}

export function getGameResult(board: Board): GameResult {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const stone = board[toIndex(row, column)];

      if (!stone) {
        continue;
      }

      for (const [rowStep, columnStep] of DIRECTIONS) {
        if (countLine(board, row, column, rowStep, columnStep, stone) >= 5) {
          return { kind: "victory", winner: stone };
        }
      }
    }
  }

  if (board.every(Boolean)) {
    return { kind: "draw" };
  }

  return { kind: "playing" };
}

export function chooseComputerMove(board: Board): number | null {
  const legalMoves = getLegalMoves(board);

  for (const move of legalMoves) {
    const result = getGameResult(placeStone(board, move, "white"));

    if (result.kind === "victory" && result.winner === "white") {
      return move;
    }
  }

  for (const move of legalMoves) {
    const result = getGameResult(placeStone(board, move, "black"));

    if (result.kind === "victory" && result.winner === "black") {
      return move;
    }
  }

  return legalMoves.reduce<number | null>((bestMove, move) => {
    if (bestMove === null) {
      return move;
    }

    return scoreMove(board, move) > scoreMove(board, bestMove) ? move : bestMove;
  }, null);
}

function getLegalMoves(board: Board) {
  return board.flatMap((cell, index) => (cell ? [] : [index]));
}

function scoreMove(board: Board, move: number) {
  const [row, column] = fromIndex(move);
  let score = 0;

  for (const [rowStep, columnStep] of DIRECTIONS) {
    const ownLine =
      countContiguous(board, row + rowStep, column + columnStep, rowStep, columnStep, "white") +
      countContiguous(board, row - rowStep, column - columnStep, -rowStep, -columnStep, "white");
    const opponentLine =
      countContiguous(board, row + rowStep, column + columnStep, rowStep, columnStep, "black") +
      countContiguous(board, row - rowStep, column - columnStep, -rowStep, -columnStep, "black");

    score += ownLine * 12;
    score += opponentLine * 10;
  }

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      const neighborRow = row + rowOffset;
      const neighborColumn = column + columnOffset;

      if (isOnBoard(neighborRow, neighborColumn) && board[toIndex(neighborRow, neighborColumn)]) {
        score += 3;
      }
    }
  }

  return score;
}

function countContiguous(
  board: Board,
  row: number,
  column: number,
  rowStep: number,
  columnStep: number,
  stone: Stone,
) {
  let count = 0;
  let currentRow = row;
  let currentColumn = column;

  while (isOnBoard(currentRow, currentColumn) && board[toIndex(currentRow, currentColumn)] === stone) {
    count += 1;
    currentRow += rowStep;
    currentColumn += columnStep;
  }

  return count;
}

function countLine(
  board: Board,
  row: number,
  column: number,
  rowStep: number,
  columnStep: number,
  stone: Stone,
) {
  let count = 0;
  let currentRow = row;
  let currentColumn = column;

  while (isOnBoard(currentRow, currentColumn) && board[toIndex(currentRow, currentColumn)] === stone) {
    count += 1;
    currentRow += rowStep;
    currentColumn += columnStep;
  }

  return count;
}

function isOnBoard(row: number, column: number) {
  return row >= 0 && row < BOARD_SIZE && column >= 0 && column < BOARD_SIZE;
}

function toIndex(row: number, column: number) {
  return row * BOARD_SIZE + column;
}

function fromIndex(index: number) {
  return [Math.floor(index / BOARD_SIZE), index % BOARD_SIZE] as const;
}
