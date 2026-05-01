// ===== Performance Panel =====

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setPerformanceData } from '@/features/performance/performanceSlice';
import { analyzeSvgPerformance } from '@/utils/performanceAnalyzer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const SEVERITY_STYLES = {
  high: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  medium: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  low: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};

export default function PerformancePanel() {
  const dispatch = useAppDispatch();
  const { modifiedCode, elements } = useAppSelector((s) => s.svg);
  const { score, warnings, stats } = useAppSelector((s) => s.performance);

  useEffect(() => {
    const result = analyzeSvgPerformance(modifiedCode, elements);
    dispatch(setPerformanceData(result));
  }, [modifiedCode, elements, dispatch]);

  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-destructive';

  return (
    <div className="flex flex-col h-full">
      {/* Score */}
      <div className="flex items-center justify-center gap-4 p-4 border-b border-border/30">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/30" />
            <circle
              cx="40" cy="40" r="34" fill="none" strokeWidth="5"
              className={scoreColor}
              stroke="currentColor"
              strokeDasharray={`${(score / 100) * 213.6} 213.6`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor}`}>{score}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{score >= 80 ? 'Great' : score >= 50 ? 'Fair' : 'Needs Work'}</p>
          <p className="text-xs text-muted-foreground">Performance Score</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 p-3 border-b border-border/30">
          <div className="text-center">
            <p className="text-lg font-bold">{stats.elementCount}</p>
            <p className="text-[10px] text-muted-foreground">Elements</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats.pathPoints || 0}</p>
            <p className="text-[10px] text-muted-foreground">Path Points</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats.fileSize ? `${(stats.fileSize / 1024).toFixed(1)}` : '0'}</p>
            <p className="text-[10px] text-muted-foreground">KB</p>
          </div>
        </div>
      )}

      {/* Warnings */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-2">
          {warnings.map((w, i) => {
            const style = SEVERITY_STYLES[w.severity] || SEVERITY_STYLES.low;
            const Icon = style.icon;
            return (
              <div key={i} className={`flex gap-2 p-2.5 rounded-lg ${style.bg}`}>
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.color}`} />
                <div>
                  <p className="text-xs font-medium">{w.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{w.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
