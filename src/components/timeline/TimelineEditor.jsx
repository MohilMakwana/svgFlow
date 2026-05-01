// ===== Timeline Editor =====

import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAllAnimations } from '@/features/animation/animationSlice';
import { toggleTimeline } from '@/features/timeline/timelineSlice';
import TimelineTrack from './TimelineTrack';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

export default function TimelineEditor() {
  const dispatch = useAppDispatch();
  const animations = useAppSelector(selectAllAnimations);
  const { isOpen, duration } = useAppSelector((s) => s.timeline);
  const isPlaying = useAppSelector((s) => s.preview.isPlaying);
  const speed = useAppSelector((s) => s.preview.speed);
  const activeElementId = useAppSelector((s) => s.animation.activeElementId);
  const animKey = useAppSelector((s) => s.preview.animKey);
  const loopEnabled = useAppSelector((s) => s.preview.loopEnabled);

  // Compute dynamic max duration based on animations
  const animValues = Object.values(animations);
  const dynamicDuration = animValues.length > 0
    ? Math.max(...animValues.map(a => (a?.timing?.delay || 0) + (a?.timing?.duration || 1)))
    : duration; // fallback to default timeline duration (5s) if no animations

  const localTimeRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef(null);
  const playheadRef = useRef(null);

  // Helper to update the DOM playhead directly without triggering React re-renders
  const updatePlayheadVisuals = (time) => {
    if (playheadRef.current && dynamicDuration > 0) {
      const pct = (time / dynamicDuration) * 100;
      playheadRef.current.style.left = `${pct}%`;
    }
  };

  // Reset timeline when animKey changes (e.g. Restart button clicked)
  useEffect(() => {
    localTimeRef.current = 0;
    updatePlayheadVisuals(0);
  }, [animKey, dynamicDuration]);

  // Playhead animation loop
  useEffect(() => {
    if (isPlaying) {
      // If we press play while at the end, restart the entire animation
      if (localTimeRef.current >= dynamicDuration && !loopEnabled) {
        dispatch({ type: 'preview/restartAnimation' });
        return;
      }

      lastTimeRef.current = performance.now();

      const animate = () => {
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        let nextTime = localTimeRef.current + delta * (speed || 1);

        if (nextTime >= dynamicDuration) {
          if (loopEnabled) {
            nextTime = 0; // Wrap around
            localTimeRef.current = nextTime;
            updatePlayheadVisuals(nextTime);
            rafRef.current = requestAnimationFrame(animate);
          } else {
            localTimeRef.current = dynamicDuration;
            updatePlayheadVisuals(dynamicDuration);
            dispatch({ type: 'preview/setPlaying', payload: false });
            // Do not request next frame
          }
        } else {
          localTimeRef.current = nextTime;
          updatePlayheadVisuals(nextTime);
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, dynamicDuration, speed, loopEnabled, dispatch, animKey]);

  const entries = Object.entries(animations);

  // Ruler marks (every 1 second)
  const marks = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= Math.ceil(dynamicDuration); i++) {
      arr.push(i);
    }
    return arr;
  }, [dynamicDuration]);

  return (
    <div className="border-t border-border/50 bg-card/90 backdrop-blur-md shrink-0 flex flex-col">
      {/* Header */}
      <button
        onClick={() => dispatch(toggleTimeline())}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/40 transition-colors border-b border-border/30 shadow-sm z-10"
      >
        <div className="flex items-center gap-2 text-primary">
          <Clock className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Timeline</span>
          {entries.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold tracking-tighter">
              {entries.length} TRACK{entries.length !== 1 ? 'S' : ''}
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Body */}
      {isOpen && (
        <div className="flex-1 relative overflow-hidden bg-background/30 flex flex-col min-h-0">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <Clock className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                No active animations
              </p>
            </div>
          ) : (
            <div className="relative pt-2 pb-4">
              {/* Ruler Header */}
              <div className="sticky top-0 h-6 border-b border-border/40 ml-[100px] mb-2 bg-card/80 backdrop-blur-sm z-10">
                {marks.map((sec) => (
                  <div
                    key={sec}
                    className="absolute top-0 bottom-0 flex flex-col items-center -ml-3 w-6"
                    style={{ left: `${(sec / dynamicDuration) * 100}%` }}
                  >
                    <span className="text-[9px] text-muted-foreground font-bold tracking-tighter pt-0.5">{sec}s</span>
                    <div className="mt-auto w-px h-1.5 bg-border/80" />
                  </div>
                ))}
              </div>

              {/* Tracks Container */}
              <div className="space-y-1 relative px-2">
                {entries.map(([id, config]) => (
                  <TimelineTrack
                    key={id}
                    elementId={id}
                    config={config}
                    duration={dynamicDuration}
                    isActive={activeElementId === id}
                  />
                ))}

                {/* DOM Playhead Line */}
                <div
                  ref={playheadRef}
                  className="absolute top-[-24px] bottom-0 w-px bg-red-500 z-20 transition-none ml-[92px]"
                  style={{ left: '0%' }}
                >
                  <div className="absolute top-0 -ml-[4.5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-red-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
