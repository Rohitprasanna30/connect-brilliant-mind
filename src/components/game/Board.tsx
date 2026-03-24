import { motion } from 'framer-motion';
import { Board as BoardType, Player, ROWS, COLS } from '@/lib/gameLogic';

interface BoardProps {
  board: BoardType;
  winningCells: number[][] | null;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  currentPlayer: Player;
  lastMove: { row: number; col: number } | null;
}

const Board = ({ board, winningCells, onColumnClick, disabled, currentPlayer, lastMove }: BoardProps) => {
  const isWinning = (r: number, c: number) =>
    winningCells?.some(([wr, wc]) => wr === r && wc === c) ?? false;

  const isLastMove = (r: number, c: number) =>
    lastMove?.row === r && lastMove?.col === c;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Column hover indicators */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-2 sm:px-3">
        {Array.from({ length: COLS }, (_, c) => (
          <div key={c} className="flex justify-center h-6 sm:h-8">
            {!disabled && board[0][c] === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                  currentPlayer === 1 ? 'disc-red' : 'disc-yellow'
                } opacity-40`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="board-surface rounded-2xl p-2 sm:p-3">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => onColumnClick(c)}
                disabled={disabled || board[0][c] !== 0 ? false : disabled}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 board-cell flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
              >
                {board[r][c] !== 0 && (
                  <motion.div
                    initial={isLastMove(r, c) ? { y: -(r + 1) * 70, opacity: 0 } : { scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={isLastMove(r, c)
                      ? { type: 'spring', damping: 12, stiffness: 200, duration: 0.4 }
                      : { duration: 0.15 }
                    }
                    className={`w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full ${
                      board[r][c] === 1 ? 'disc-red' : 'disc-yellow'
                    } ${isWinning(r, c) ? 'winning' : ''}`}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
