// ===== Preview Toolbar =====

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  togglePlay, setSpeed, setBackground, toggleGrid,
  zoomIn, zoomOut, restartAnimation, toggleLoop
} from '@/features/preview/previewSlice';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Grid3x3, Repeat } from 'lucide-react';
import { SPEED_OPTIONS, BG_OPTIONS } from '@/utils/constants';

export default function PreviewToolbar() {
  const dispatch = useAppDispatch();
  const { isPlaying, speed, background, showGrid, zoom, loopEnabled } = useAppSelector((s) => s.preview);

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-card/50">
      {/* Playback */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger render={
            <button
              onClick={() => dispatch(togglePlay())}
              className={`p-1.5 rounded-md transition-colors ${
                isPlaying ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          } />
          <TooltipContent>Play / Pause (Space)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(restartAnimation())} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          } />
          <TooltipContent>Restart</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button 
              onClick={() => dispatch(toggleLoop())} 
              className={`p-1.5 rounded-md transition-colors ${
                loopEnabled ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Repeat className="h-3.5 w-3.5" />
            </button>
          } />
          <TooltipContent>{loopEnabled ? 'Loop Enabled' : 'Play Once'}</TooltipContent>
        </Tooltip>

        <Select value={String(speed || 1)} onValueChange={(v) => dispatch(setSpeed(Number(v)))}>
          <SelectTrigger className="h-7 w-16 text-[10px] border-0 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPEED_OPTIONS.map((s) => (
              <SelectItem key={s} value={String(s)} className="text-xs">{s}x</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-1">
        {BG_OPTIONS.map((opt) => (
          <Tooltip key={opt.value}>
            <TooltipTrigger render={
              <button
                onClick={() => dispatch(setBackground(opt.value))}
                className={`w-5 h-5 rounded border transition-all ${
                  background === opt.value ? 'border-primary ring-1 ring-primary/30' : 'border-border/50'
                } ${opt.value === 'transparent' ? 'preview-grid' : ''}`}
                style={opt.color ? { backgroundColor: opt.color } : undefined}
              />
            } />
            <TooltipContent>{opt.label}</TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-4 bg-border/30 mx-1" />

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(toggleGrid())} className={`p-1.5 rounded-md transition-colors ${showGrid ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <Grid3x3 className="h-3.5 w-3.5" />
            </button>
          } />
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(zoomOut())} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
          } />
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <span className="text-[10px] font-mono text-muted-foreground w-8 text-center">{Math.round(zoom * 100)}%</span>

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(zoomIn())} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          } />
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
