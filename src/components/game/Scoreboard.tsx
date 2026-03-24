import { Trophy, Minus } from 'lucide-react';

interface ScoreboardProps {
  scores: { player: number; ai: number; draws: number };
  pvp: boolean;
}

const Scoreboard = ({ scores, pvp }: ScoreboardProps) => {
  return (
    <div className="glass-panel p-3 flex items-center justify-center gap-4 sm:gap-6 text-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full disc-red" />
        <span className="text-muted-foreground">{pvp ? 'P1' : 'Player'}</span>
        <span className="font-display text-lg neon-text-red">{scores.player}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Minus className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Draw</span>
        <span className="font-display text-lg text-muted-foreground">{scores.draws}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full disc-yellow" />
        <span className="text-muted-foreground">{pvp ? 'P2' : 'AI'}</span>
        <span className="font-display text-lg neon-text-yellow">{scores.ai}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
