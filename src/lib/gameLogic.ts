export const ROWS = 6;
export const COLS = 7;
export type Player = 1 | 2;
export type Cell = 0 | Player;
export type Board = Cell[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MoveEvaluation {
  column: number;
  score: number;
  valid: boolean;
}

export interface AIStats {
  nodesExplored: number;
  depth: number;
  columnScores: MoveEvaluation[];
  bestMove: number;
  thinking: boolean;
}

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export function getValidColumns(board: Board): number[] {
  return Array.from({ length: COLS }, (_, i) => i).filter(c => board[0][c] === 0);
}

export function dropDisc(board: Board, col: number, player: Player): { newBoard: Board; row: number } | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      const newBoard = cloneBoard(board);
      newBoard[r][col] = player;
      return { newBoard, row: r };
    }
  }
  return null;
}

export function checkWin(board: Board, player: Player): number[][] | null {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      for (const [dr, dc] of dirs) {
        const cells: number[][] = [];
        let valid = true;
        for (let i = 0; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) {
            valid = false; break;
          }
          cells.push([nr, nc]);
        }
        if (valid) return cells;
      }
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board[0].every(c => c !== 0);
}

function countWindow(window: Cell[], player: Player, opponent: Player): number {
  const p = window.filter(c => c === player).length;
  const o = window.filter(c => c === opponent).length;
  const e = window.filter(c => c === 0).length;
  if (p === 4) return 100;
  if (o === 4) return -100;
  if (p === 3 && e === 1) return 10;
  if (o === 3 && e === 1) return -10;
  if (p === 2 && e === 2) return 3;
  if (o === 2 && e === 2) return -3;
  return 0;
}

export function evaluate(board: Board, aiPlayer: Player): number {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;
  let score = 0;

  // Center column preference
  const centerCol = Math.floor(COLS / 2);
  const centerCount = board.reduce((acc, row) => acc + (row[centerCol] === aiPlayer ? 1 : 0), 0);
  score += centerCount * 4;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += countWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], aiPlayer, opponent);
    }
  }
  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      score += countWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], aiPlayer, opponent);
    }
  }
  // Diagonals
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += countWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], aiPlayer, opponent);
    }
  }
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += countWindow([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]], aiPlayer, opponent);
    }
  }
  return score;
}

function isTerminal(board: Board): boolean {
  return !!checkWin(board, 1) || !!checkWin(board, 2) || isDraw(board);
}

let nodesExplored = 0;

function minimax(
  board: Board, depth: number, alpha: number, beta: number,
  maximizing: boolean, aiPlayer: Player
): number {
  nodesExplored++;
  const opponent: Player = aiPlayer === 1 ? 2 : 1;

  if (depth === 0 || isTerminal(board)) {
    if (checkWin(board, aiPlayer)) return 100000 + depth;
    if (checkWin(board, opponent)) return -100000 - depth;
    if (isDraw(board)) return 0;
    return evaluate(board, aiPlayer);
  }

  const validCols = getValidColumns(board);

  if (maximizing) {
    let maxEval = -Infinity;
    for (const col of validCols) {
      const result = dropDisc(board, col, aiPlayer);
      if (!result) continue;
      const ev = minimax(result.newBoard, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const col of validCols) {
      const result = dropDisc(board, col, opponent);
      if (!result) continue;
      const ev = minimax(result.newBoard, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getAIMove(board: Board, difficulty: Difficulty, aiPlayer: Player = 2): AIStats {
  const validCols = getValidColumns(board);
  nodesExplored = 0;

  if (difficulty === 'easy') {
    const col = validCols[Math.floor(Math.random() * validCols.length)];
    return {
      nodesExplored: 1,
      depth: 0,
      columnScores: validCols.map(c => ({ column: c, score: 0, valid: true })),
      bestMove: col,
      thinking: false,
    };
  }

  const depth = difficulty === 'medium' ? 3 : 5;
  const scores: MoveEvaluation[] = [];

  let bestScore = -Infinity;
  let bestCol = validCols[0];

  for (const col of validCols) {
    const result = dropDisc(board, col, aiPlayer);
    if (!result) {
      scores.push({ column: col, score: -Infinity, valid: false });
      continue;
    }
    const score = minimax(result.newBoard, depth - 1, -Infinity, Infinity, false, aiPlayer);
    scores.push({ column: col, score, valid: true });
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return {
    nodesExplored,
    depth,
    columnScores: scores,
    bestMove: bestCol,
    thinking: false,
  };
}
