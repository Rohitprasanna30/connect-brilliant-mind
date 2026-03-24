import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationalPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-panel overflow-hidden w-full max-w-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-neon-blue" />
          <span className="font-display text-xs sm:text-sm neon-text-blue">How Minimax Works</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-display text-xs text-foreground mb-1">Step 1: Game Tree Generation</h4>
                <p>The AI generates all possible future game states by simulating moves for both players, creating a tree of possibilities.</p>
              </div>

              <div>
                <h4 className="font-display text-xs text-foreground mb-1">Step 2: Evaluate Leaf Nodes</h4>
                <p>Terminal states are scored: +100 for AI 3-in-a-row, -100 for opponent 3-in-a-row, +100,000 for wins, -100,000 for losses.</p>
              </div>

              <div>
                <h4 className="font-display text-xs text-foreground mb-1">Step 3: Minimax Backpropagation</h4>
                <p>The AI <strong className="text-neon-yellow">maximizes</strong> its own score and <strong className="text-neon-red">minimizes</strong> the opponent's best outcome, alternating at each tree level.</p>
              </div>

              {/* Simple diagram */}
              <div className="glass-panel p-3 text-center text-xs">
                <div className="font-display text-foreground mb-2">Decision Tree Example</div>
                <div className="flex flex-col items-center gap-1">
                  <div className="px-2 py-1 rounded bg-neon-blue/20 border border-neon-blue/40 text-neon-blue">MAX (AI)</div>
                  <div className="w-px h-3 bg-border" />
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="px-2 py-1 rounded bg-neon-red/20 border border-neon-red/40 text-neon-red text-[10px]">MIN</div>
                      <div className="w-px h-2 bg-border" />
                      <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px]">+10</span>
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px]">-3</span>
                      </div>
                      <span className="text-[10px] mt-1 text-neon-red">picks -3</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="px-2 py-1 rounded bg-neon-red/20 border border-neon-red/40 text-neon-red text-[10px]">MIN</div>
                      <div className="w-px h-2 bg-border" />
                      <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px]">+7</span>
                        <span className="px-1.5 py-0.5 rounded bg-neon-green/20 border border-neon-green/40 text-[10px]">✂ pruned</span>
                      </div>
                      <span className="text-[10px] mt-1 text-neon-red">≤ +7</span>
                    </div>
                  </div>
                  <span className="text-[10px] mt-1 text-neon-blue">AI picks +7 branch → Best move!</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationalPanel;
