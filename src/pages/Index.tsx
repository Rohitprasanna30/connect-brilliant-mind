import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createBoard, dropDisc, checkWin, isDraw, getAIMove,
  Board as BoardType, Player, Difficulty, AIStats
} from '@/lib/gameLogic';
import { playDropSound, playWinSound, playDrawSound } from '@/lib/soundEffects';
import Board from '@/components/game/Board';
import VisualizationPanel from '@/components/game/VisualizationPanel';
import Controls from '@/components/game/Controls';
import Scoreboard from '@/components/game/Scoreboard';
import EducationalPanel from '@/components/game/EducationalPanel';
import { Sparkles } from 'lucide-react';

interface HistoryEntry {
  board: BoardType;
  player: Player;
}

const Index = () => {
  const [board, setBoard] = useState<BoardType>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winningCells, setWinningCells] = useState<number[][] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [pvp, setPvp] = useState(false);
  const [showViz, setShowViz] = useState(true);
  const [aiStats, setAiStats] = useState<AIStats | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
  const [statusText, setStatusText] = useState('Your turn — drop a red disc!');
  const aiThinking = useRef(false);

  const handleColumnClick = useCallback((col: number) => {
    if (gameOver || aiThinking.current) return;
    if (!pvp && currentPlayer === 2) return;

    const result = dropDisc(board, col, currentPlayer);
    if (!result) return;

    playDropSound();
    setHistory(prev => [...prev, { board, player: currentPlayer }]);
    setBoard(result.newBoard);
    setLastMove({ row: result.row, col });

    const win = checkWin(result.newBoard, currentPlayer);
    if (win) {
      setWinningCells(win);
      setGameOver(true);
      setWinner(currentPlayer);
      playWinSound();
      if (currentPlayer === 1) {
        setScores(s => ({ ...s, player: s.player + 1 }));
        setStatusText(pvp ? 'Player 1 (Red) wins! 🎉' : 'You win! 🎉');
      } else {
        setScores(s => ({ ...s, ai: s.ai + 1 }));
        setStatusText(pvp ? 'Player 2 (Yellow) wins! 🎉' : 'AI wins! 🤖');
      }
      return;
    }

    if (isDraw(result.newBoard)) {
      setGameOver(true);
      setScores(s => ({ ...s, draws: s.draws + 1 }));
      playDrawSound();
      setStatusText("It's a draw! 🤝");
      return;
    }

    const next: Player = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(next);

    if (!pvp && next === 2) {
      setStatusText('AI is thinking...');
    } else {
      setStatusText(pvp
        ? `Player ${next} (${next === 1 ? 'Red' : 'Yellow'}) — your turn!`
        : 'Your turn — drop a red disc!');
    }
  }, [board, currentPlayer, gameOver, pvp]);

  // AI move
  useEffect(() => {
    if (pvp || currentPlayer !== 2 || gameOver) return;
    aiThinking.current = true;
    setAiStats({ nodesExplored: 0, depth: 0, columnScores: [], bestMove: -1, thinking: true });

    const delay = 800 + Math.random() * 400;
    const timeout = setTimeout(() => {
      const stats = getAIMove(board, difficulty);
      setAiStats(stats);

      const result = dropDisc(board, stats.bestMove, 2);
      if (!result) { aiThinking.current = false; return; }

      playDropSound();
      setHistory(prev => [...prev, { board, player: 2 }]);
      setBoard(result.newBoard);
      setLastMove({ row: result.row, col: stats.bestMove });

      const win = checkWin(result.newBoard, 2);
      if (win) {
        setWinningCells(win);
        setGameOver(true);
        setWinner(2);
        playWinSound();
        setScores(s => ({ ...s, ai: s.ai + 1 }));
        setStatusText('AI wins! 🤖');
      } else if (isDraw(result.newBoard)) {
        setGameOver(true);
        setScores(s => ({ ...s, draws: s.draws + 1 }));
        playDrawSound();
        setStatusText("It's a draw! 🤝");
      } else {
        setCurrentPlayer(1);
        setStatusText('Your turn — drop a red disc!');
      }
      aiThinking.current = false;
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentPlayer, pvp, gameOver, board, difficulty]);

  const handleRestart = () => {
    setBoard(createBoard());
    setCurrentPlayer(1);
    setWinningCells(null);
    setGameOver(false);
    setWinner(null);
    setHistory([]);
    setLastMove(null);
    setAiStats(null);
    setStatusText('Your turn — drop a red disc!');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    // In AI mode, undo two moves (player + AI)
    const steps = !pvp && history.length >= 2 ? 2 : 1;
    const target = history[history.length - steps];
    setBoard(target.board);
    setCurrentPlayer(target.player);
    setHistory(prev => prev.slice(0, -steps));
    setWinningCells(null);
    setGameOver(false);
    setWinner(null);
    setLastMove(null);
    setStatusText(pvp
      ? `Player ${target.player} (${target.player === 1 ? 'Red' : 'Yellow'}) — your turn!`
      : 'Your turn — drop a red disc!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-4 sm:py-6 px-3 sm:px-4 gap-4 sm:gap-5">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wider neon-text-yellow flex items-center gap-2 justify-center">
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
          CONNECT 4
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Minimax AI
        </p>
      </motion.div>

      {/* Scoreboard */}
      <Scoreboard scores={scores} pvp={pvp} />

      {/* Controls */}
      <Controls
        onRestart={handleRestart}
        onUndo={handleUndo}
        canUndo={history.length > 0 && !aiThinking.current}
        difficulty={difficulty}
        onDifficultyChange={(d) => { setDifficulty(d); handleRestart(); }}
        showViz={showViz}
        onToggleViz={() => setShowViz(v => !v)}
        pvp={pvp}
        onTogglePvp={() => { setPvp(p => !p); handleRestart(); }}
      />

      {/* Status */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className={`font-display text-xs sm:text-sm tracking-wide ${
            winner === 1 ? 'neon-text-red' : winner === 2 ? 'neon-text-yellow' : 'text-foreground'
          }`}
        >
          {statusText}
        </motion.div>
      </AnimatePresence>

      {/* Main area: Board + Viz Panel */}
      <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Board
            board={board}
            winningCells={winningCells}
            onColumnClick={handleColumnClick}
            disabled={gameOver || aiThinking.current}
            currentPlayer={currentPlayer}
            lastMove={lastMove}
          />
        </motion.div>

        {!pvp && (
          <AnimatePresence>
            {showViz && <VisualizationPanel stats={aiStats} visible={showViz} />}
          </AnimatePresence>
        )}
      </div>

      {/* Educational Panel */}
      <EducationalPanel />
    </div>
  );
};

export default Index;
