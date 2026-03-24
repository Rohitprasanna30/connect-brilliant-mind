import { AIStats } from '@/lib/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Target, Zap } from 'lucide-react';

interface VisualizationPanelProps {
  stats: AIStats | null;
  visible: boolean;
}

const VisualizationPanel = ({ stats, visible }: VisualizationPanelProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-panel p-4 sm:p-5 w-full max-w-xs space-y-4"
    >
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-neon-blue" />
        <h3 className="font-display text-sm sm:text-base neon-text-blue">AI Decision Process</h3>
      </div>

      <AnimatePresence mode="wait">
        {stats?.thinking ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Activity className="w-4 h-4 text-neon-yellow" />
              </motion.div>
              <span>AI is thinking...</span>
            </div>
            <p className="text-xs text-muted-foreground italic">
              "Maximizing winning chances while minimizing opponent advantage..."
            </p>
            {/* Mini decision tree */}
            <div className="flex flex-col items-center gap-1 py-2">
              <div className="w-6 h-6 rounded-full border-2 border-neon-yellow flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-2 rounded-full bg-neon-yellow"
                />
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/50" />
                    <div className="w-px h-2 bg-border" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full border border-muted-foreground/30" />
                      <div className="w-2 h-2 rounded-full border border-muted-foreground/30" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : stats ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-panel p-2 text-center">
                <div className="text-muted-foreground">Depth</div>
                <div className="font-display text-sm neon-text-yellow">{stats.depth}</div>
              </div>
              <div className="glass-panel p-2 text-center">
                <div className="text-muted-foreground">Nodes</div>
                <div className="font-display text-sm neon-text-yellow">{stats.nodesExplored.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Target className="w-3 h-3" /> Column Scores
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const entry = stats.columnScores.find(s => s.column === i);
                  const isBest = stats.bestMove === i;
                  return (
                    <div
                      key={i}
                      className={`text-center p-1 rounded text-xs ${
                        isBest
                          ? 'bg-neon-green/20 border border-neon-green/50'
                          : entry?.valid
                          ? 'bg-secondary'
                          : 'bg-secondary/30 opacity-40'
                      }`}
                    >
                      <div className="text-muted-foreground text-[10px]">{i + 1}</div>
                      <div className={`font-mono text-[10px] ${isBest ? 'text-neon-green font-bold' : ''}`}>
                        {entry?.valid ? (entry.score > 9999 ? '∞' : entry.score < -9999 ? '-∞' : entry.score) : '×'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="w-3 h-3 text-neon-green" />
              <span>Best move: <strong className="neon-text-yellow">Column {stats.bestMove + 1}</strong></span>
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-muted-foreground">Make a move to see AI analysis.</p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VisualizationPanel;
