// ===== Timeline Track =====

import React from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setActiveElement, removeAnimation } from '@/features/animation/animationSlice';
import { TIMING_DEFAULTS } from '@/utils/constants';
import { Trash2 } from 'lucide-react';

const TimelineTrack = React.memo(({ elementId, config, duration, isActive }) => {
  const dispatch = useAppDispatch();
  const timing = config?.timing || TIMING_DEFAULTS;
  
  // Guard against divide by zero if duration is 0
  const safeDuration = duration > 0 ? duration : 1;
  const startPct = ((timing.delay || 0) / safeDuration) * 100;
  const widthPct = ((timing.duration || 1) / safeDuration) * 100;

  return (
    <div
      onClick={() => dispatch(setActiveElement(elementId))}
      className={`group relative h-8 w-full rounded-lg flex items-center text-left cursor-pointer transition-colors border ${
        isActive 
          ? 'bg-primary/5 border-primary/20 shadow-sm' 
          : 'bg-transparent border-transparent hover:bg-muted/30'
      }`}
    >
      {/* Label */}
      <div className="w-[100px] shrink-0 flex items-center px-3 border-r border-border/20 z-10">
        <span className={`text-[11px] font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground/80'}`}>
          {elementId === '__global__' ? 'Global' : elementId}
        </span>
      </div>

      {/* Track Area */}
      <div className="flex-1 relative h-full group-hover:bg-muted/20 rounded-r-lg transition-colors overflow-hidden">
        {/* Clip Bar */}
        <div
          className={`absolute top-1.5 bottom-1.5 rounded-md flex items-center justify-center shadow-sm transition-all duration-300 border ${
            isActive 
              ? 'bg-gradient-to-r from-primary to-primary/80 border-primary/30' 
              : 'bg-primary/30 border-primary/20 backdrop-blur-sm'
          }`}
          style={{
            left: `${Math.min(startPct, 95)}%`,
            width: `${Math.min(widthPct, 100 - startPct)}%`,
          }}
        >
          <span className={`text-[9px] font-bold tracking-tight truncate px-1.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`}>
            {timing.duration}s
          </span>
        </div>
      </div>
      
      {/* Action Area */}
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeAnimation(elementId));
          }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm bg-background border border-border"
          title="Remove animation track"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
});

TimelineTrack.displayName = 'TimelineTrack';
export default TimelineTrack;
