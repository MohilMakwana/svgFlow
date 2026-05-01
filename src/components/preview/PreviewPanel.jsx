// ===== Preview Panel =====

import { useAppSelector } from '@/app/hooks';
import useAnimationEngine from '@/hooks/useAnimationEngine';
import PreviewToolbar from './PreviewToolbar';

export default function PreviewPanel() {
  const modifiedCode = useAppSelector((s) => s.svg.modifiedCode);
  const { background, showGrid, zoom, animKey } = useAppSelector((s) => s.preview);
  const animationCSS = useAnimationEngine();

  const isPlaying = useAppSelector((s) => s.preview.isPlaying);

  const bgClass = {
    dark: 'bg-[#0f0f14]',
    light: 'bg-[#f5f5f7]',
    grid: 'preview-grid bg-[#1a1a2e]',
    transparent: 'preview-grid bg-transparent',
  }[background] || 'bg-[#0f0f14]';

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0">
      <PreviewToolbar />

      {/* Preview Canvas */}
      <div className={`flex-1 flex items-center justify-center overflow-hidden relative ${bgClass} ${showGrid ? 'preview-grid' : ''}`}>
        {modifiedCode ? (
          <div
            key={animKey}
            className="svg-preview-container w-full h-full flex items-center justify-center p-8"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              '--play-state': isPlaying ? 'running' : 'paused'
            }}
          >
            {/* Inject animation CSS */}
            <style>{animationCSS}</style>

            {/* Render SVG */}
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full"
              style={{ maxWidth: '80%', maxHeight: '80%' }}
              dangerouslySetInnerHTML={{ __html: modifiedCode }}
            />
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Upload or paste an SVG to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
