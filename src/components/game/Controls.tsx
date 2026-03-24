import { Difficulty } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Undo2, Eye, EyeOff, Users, Bot } from 'lucide-react';

interface ControlsProps {
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  showViz: boolean;
  onToggleViz: () => void;
  pvp: boolean;
  onTogglePvp: () => void;
}

const Controls = ({
  onRestart, onUndo, canUndo, difficulty, onDifficultyChange,
  showViz, onToggleViz, pvp, onTogglePvp
}: ControlsProps) => {
  return (
    <div className="glass-panel p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
      <Button onClick={onRestart} variant="outline" size="sm" className="gap-1.5 border-border/50">
        <RotateCcw className="w-3.5 h-3.5" /> Restart
      </Button>

      <Button onClick={onUndo} variant="outline" size="sm" disabled={!canUndo} className="gap-1.5 border-border/50">
        <Undo2 className="w-3.5 h-3.5" /> Undo
      </Button>

      <Button onClick={onTogglePvp} variant="outline" size="sm" className="gap-1.5 border-border/50">
        {pvp ? <Users className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        {pvp ? 'PvP' : 'vs AI'}
      </Button>

      {!pvp && (
        <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v as Difficulty)}>
          <SelectTrigger className="w-28 h-8 text-xs bg-secondary border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      )}

      {!pvp && (
        <Button onClick={onToggleViz} variant="outline" size="sm" className="gap-1.5 border-border/50">
          {showViz ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          AI Panel
        </Button>
      )}
    </div>
  );
};

export default Controls;
