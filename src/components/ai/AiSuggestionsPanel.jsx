import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  suggestSvgAnimations,
  generateSvgFromPrompt,
  editSvgStructure,
  analyzeStructure,
  clearSuggestions,
} from '@/features/ai/aiSlice';
import { applyPreset } from '@/features/animation/animationSlice';
import { setPlaying } from '@/features/preview/previewSlice';
import { isAiConfigured, getActiveAiConfig, classifyIntent } from '@/services/api/aiService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles, Wand2, Key, Loader2, Zap, Send,
  MessageSquare, Trash2, Info, ArrowRight,
  Pencil, Search, ImagePlus, BarChart2, RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Intent metadata for UI hints
const INTENT_META = {
  animate: { label: 'Suggest Animations', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  generate: { label: 'Generate New SVG', icon: ImagePlus, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  edit: { label: 'Edit Structure', icon: Pencil, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  analyze: { label: 'Analyze SVG', icon: BarChart2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
};

const LOADING_LABELS = {
  animate: 'Crafting animations...',
  generate: 'Illustrating SVG...',
  edit: 'Editing structure...',
  analyze: 'Analyzing SVG...',
};

const EXAMPLE_PROMPTS = [
  { text: 'Draw a glowing neon rocket', intent: 'generate' },
  { text: 'Add a small star to the top-right corner', intent: 'edit' },
  { text: 'Remove the background rectangle', intent: 'edit' },
  { text: 'Make it spin and pulse smoothly', intent: 'animate' },
  { text: 'Analyze this SVG structure', intent: 'analyze' },
];

export default function AiCopilotPanel() {
  const dispatch = useAppDispatch();
  const svgCode = useAppSelector((s) => s.svg.modifiedCode);
  const selectedElementId = useAppSelector((s) => s.svg.selectedElementId);
  const { suggestions, analysis, isLoading, loadingMode, error, lastIntent } = useAppSelector((s) => s.ai);
  const hasKey = isAiConfigured();
  const { provider } = getActiveAiConfig();

  const [prompt, setPrompt] = useState('');
  const [detectedIntent, setDetectedIntent] = useState(null);
  const scrollRef = useRef(null);

  // Detect intent as user types
  useEffect(() => {
    if (!prompt.trim()) { setDetectedIntent(null); return; }
    const intent = classifyIntent(prompt, !!svgCode);
    setDetectedIntent(intent);
  }, [prompt, svgCode]);

  // Auto-scroll results
  useEffect(() => {
    if (scrollRef.current && (suggestions.length > 0 || analysis)) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [suggestions, analysis]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed && !svgCode) { toast.error('Type a prompt or upload an SVG first'); return; }
    const intent = classifyIntent(trimmed, !!svgCode);
    dispatch(clearSuggestions());
    executeIntent(intent, trimmed);
    setPrompt('');
  };

  const executeIntent = (intent, text) => {
    switch (intent) {
      case 'generate':
        dispatch(generateSvgFromPrompt(text || 'a beautiful abstract design'));
        break;
      case 'edit':
        if (!svgCode) { toast.error('Upload an SVG first to edit it'); return; }
        dispatch(editSvgStructure({ svgCode, instruction: text }));
        break;
      case 'analyze':
        if (!svgCode) { toast.error('Upload an SVG first to analyze it'); return; }
        dispatch(analyzeStructure(svgCode));
        break;
      case 'animate':
      default:
        if (!svgCode) { toast.error('Upload an SVG first to suggest animations'); return; }
        dispatch(suggestSvgAnimations({ svgCode, userPrompt: text }));
        break;
    }
  };

  const handleApply = (suggestion) => {
    dispatch(applyPreset(suggestion.config));
    dispatch(setPlaying(true));
    toast.success(`Applied "${suggestion.name}"`);
  };

  const handleExampleClick = (example) => {
    setPrompt(example.text);
  };

  // ── Not Configured ──────────────────────────────────────────────────────────
  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center h-full bg-muted/5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative p-4 rounded-2xl bg-card border border-border shadow-sm">
            <Key className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-tight">AI Copilot Locked</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
            Add your <span className="font-bold text-foreground">{provider?.toUpperCase()}</span> API key in Settings to unlock the full AI studio.
          </p>
        </div>
        <Link to="/settings">
          <Button size="sm" className="gap-2 rounded-full px-5 shadow-lg shadow-primary/20">
            Configure Key <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background/50 border-l border-border/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-card/30 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground">AI Copilot</h3>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
              {provider?.toUpperCase()} · 4 Modes
            </span>
          </div>
        </div>
        {(suggestions.length > 0 || analysis) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => dispatch(clearSuggestions())}
            title="Clear results"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Results area */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollRef} className="p-4 space-y-4">

          {/* Empty state */}
          {suggestions.length === 0 && !analysis && !isLoading && !error && (
            <div className="space-y-5">
              {/* Mode pills */}
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(INTENT_META).map(([key, m]) => (
                  <div key={key} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-tight ${m.bg} ${m.color}`}>
                    <m.icon className="h-3 w-3 shrink-0" />
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Example prompts */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-0.5">Try asking...</p>
                {EXAMPLE_PROMPTS.map((ex, i) => {
                  const meta = INTENT_META[ex.intent];
                  return (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(ex)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-border/30 bg-card/20 hover:bg-card/60 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <meta.icon className={`h-3 w-3 shrink-0 ${meta.color}`} />
                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                          {ex.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                <Loader2 className="h-6 w-6 animate-spin text-primary relative" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                {LOADING_LABELS[loadingMode] || 'Processing...'}
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-destructive/5 text-destructive text-[10px] border border-destructive/20 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold mb-0.5">Error</p>
                <p className="leading-relaxed opacity-80">{error}</p>
              </div>
            </div>
          )}

          {/* Analysis result */}
          {analysis && !isLoading && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <BarChart2 className="h-3 w-3" /> SVG Analysis
              </div>
              <div className="p-3 rounded-xl border border-border/40 bg-card/40 space-y-3">
                <p className="text-[10px] text-foreground/90 leading-relaxed">{analysis.summary}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted/40 border border-border/30 font-bold text-muted-foreground uppercase">
                    {analysis.complexity}
                  </span>
                  {analysis.elementCount && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted/40 border border-border/30 font-bold text-muted-foreground">
                      {analysis.elementCount} elements
                    </span>
                  )}
                  {analysis.colors?.map((c, i) => (
                    <span key={i} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <span className="w-3 h-3 rounded-full border border-border/30 inline-block" style={{ backgroundColor: c }} />
                      {c}
                    </span>
                  ))}
                </div>
                {analysis.suggestions?.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border/20">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Suggestions</p>
                    {analysis.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Regenerate Button */}
          {(suggestions.length > 0 || analysis) && !isLoading && (
            <div className="flex justify-center pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1.5 text-[9px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary transition-all rounded-full px-4 border border-transparent hover:border-primary/10 hover:bg-primary/5"
                onClick={() => executeIntent(lastIntent, '')}
              >
                <RotateCcw className="h-3 w-3" />
                Retry Last Action
              </Button>
            </div>
          )}

          {/* Animation suggestion cards */}
          {suggestions.length > 0 && !isLoading && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <Wand2 className="h-3 w-3" /> {suggestions.length} Animations
              </div>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="group relative p-3.5 rounded-xl border border-border/40 bg-card/40 hover:bg-card/60 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-primary/10 text-primary shrink-0">
                          <Zap className="h-3 w-3" />
                        </div>
                        <h4 className="text-[11px] font-bold text-foreground truncate uppercase tracking-tight">{s.name}</h4>
                      </div>
                      {s.description && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{s.description}</p>
                      )}
                      {s.reasoning && (
                        <div className="mt-2 pt-2 border-t border-border/20">
                          <p className="text-[9px] text-muted-foreground/70 italic leading-relaxed">{s.reasoning}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg px-3 gap-1.5 text-[10px] font-bold shadow-sm shrink-0 self-start"
                      onClick={() => handleApply(s)}
                    >
                      <Zap className="h-3 w-3" /> Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-3 border-t border-border/30 bg-card/30 backdrop-blur-md space-y-2 shrink-0">
        {/* Intent indicator pill */}
        {detectedIntent && INTENT_META[detectedIntent] && (() => {
          const m = INTENT_META[detectedIntent];
          return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wide w-fit ${m.bg} ${m.color} animate-in fade-in duration-200`}>
              <m.icon className="h-3 w-3" />
              {m.label}
            </div>
          );
        })()}

        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder={
              svgCode
                ? 'E.g., "Remove background", "Add a star", "Make it spin"...'
                : 'E.g., "Draw a glowing neon rocket"...'
            }
            rows={2}
            className="w-full resize-none text-[11px] bg-background/50 border-border/40 rounded-xl pr-10 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all placeholder:text-muted-foreground/40 font-medium leading-relaxed py-2.5 px-3"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className={`absolute right-1.5 bottom-1.5 h-7 w-7 rounded-lg transition-all shadow-md active:scale-95 ${!prompt.trim() ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </form>

        {/* Selection Context Indicator */}
        {selectedElementId && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 text-[9px] text-primary animate-in fade-in zoom-in-95">
            <Info className="h-3 w-3" />
            <span>AI context active for: <span className="font-bold">#{selectedElementId}</span></span>
          </div>
        )}

        {/* Quick action buttons */}
        {!isLoading && svgCode && !prompt && (
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              className="flex-1 h-7 gap-1.5 text-[9px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              onClick={() => executeIntent('animate', '')}
            >
              <Sparkles className="h-3 w-3" /> Auto-Animate
            </Button>
            <Button
              variant="ghost"
              className="flex-1 h-7 gap-1.5 text-[9px] font-bold uppercase tracking-tight text-muted-foreground hover:text-green-400 hover:bg-green-500/5 rounded-lg transition-all"
              onClick={() => executeIntent('analyze', '')}
            >
              <Search className="h-3 w-3" /> Analyze
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
