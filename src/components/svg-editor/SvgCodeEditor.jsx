// ===== SVG Code Editor =====

import { useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setModifiedCode, setElements, setParseError } from '@/features/svg/svgSlice';
import { parseSvgCode } from '@/utils/svgParser';
import { optimizeSvgCode } from '@/utils/svgOptimizer';
import { Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SvgCodeEditor() {
  const dispatch = useAppDispatch();
  const { modifiedCode, parseError } = useAppSelector((s) => s.svg);
  const theme = useAppSelector((s) => s.ui.theme);
  const debounceRef = useRef(null);

  const handleChange = useCallback((value) => {
    dispatch(setModifiedCode(value));

    // Debounced re-parse
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { elements, error } = parseSvgCode(value);
      if (error) {
        dispatch(setParseError(error));
      } else {
        dispatch(setElements(elements));
        dispatch(setParseError(null));
      }
    }, 400);
  }, [dispatch]);

  const handleOptimize = () => {
    if (!modifiedCode) return;
    const optimized = optimizeSvgCode(modifiedCode);
    dispatch(setModifiedCode(optimized));
    const { elements } = parseSvgCode(optimized);
    dispatch(setElements(elements));
    toast.success('SVG optimized');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card/20">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-muted/30">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">SVG Source</span>
        <button
          onClick={handleOptimize}
          disabled={!modifiedCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
        >
          <Wand2 className="h-3 w-3" />
          Optimize
        </button>
      </div>

      {parseError && (
        <div className="px-3 py-2 text-[10px] font-medium text-destructive bg-destructive/10 border-b border-destructive/20 animate-in fade-in slide-in-from-top-1">
          ⚠ {parseError}
        </div>
      )}

      <div className="flex-1 min-h-0 relative group">
        <CodeMirror
          value={modifiedCode}
          onChange={handleChange}
          extensions={[xml(), EditorView.lineWrapping]}
          theme={theme === 'dark' ? oneDark : undefined}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            bracketMatching: true,
            highlightActiveLine: true,
          }}
          className="h-full text-[13px] font-mono selection:bg-primary/30"
          style={{ height: '100%' }}
        />
        
        {/* Visual helper for scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
}
