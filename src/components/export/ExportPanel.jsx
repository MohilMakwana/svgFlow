import { useMemo, useState, useRef, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectActiveConfig } from '@/features/animation/animationSlice';
import {
  generateCssKeyframes, generateTailwindClasses,
  generateFramerMotion, generateGsap, generatePlainCss,
} from '@/utils/animationGenerator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Copy, Download, Check, Code2, Wind, Box,
  Zap, FileCode, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const FORMATS = [
  { id: 'svg', label: 'SVG', icon: FileCode },
  { id: 'css', label: 'Keyframes', icon: Code2 },
  { id: 'tailwind', label: 'Tailwind', icon: Wind },
  { id: 'framer', label: 'Framer', icon: Box },
  { id: 'gsap', label: 'GSAP', icon: Zap },
  { id: 'plain', label: 'Plain CSS', icon: Code2 },
];

export default function ExportPanel() {
  const config = useAppSelector(selectActiveConfig);
  const [activeTab, setActiveTab] = useState('css');
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const modifiedCode = useAppSelector((s) => s.svg.modifiedCode);

  const generated = useMemo(() => {
    const css = generateCssKeyframes(config);
    let svgExport = modifiedCode;

    if (modifiedCode && modifiedCode.includes('<svg')) {
      svgExport = modifiedCode.replace(
        /(<svg[^>]*>)/i,
        `$1\n  <style>\n${css.replace(/^/gm, '    ')}\n  </style>\n`
      );
    }

    return {
      svg: svgExport || '<!-- Upload an SVG first -->',
      css,
      tailwind: generateTailwindClasses(config),
      framer: generateFramerMotion(config),
      gsap: generateGsap(config),
      plain: generatePlainCss(config),
    };
  }, [config, modifiedCode]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`${id.toUpperCase()} copied`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (code, format) => {
    const extMap = { framer: 'js', gsap: 'js', svg: 'svg' };
    const ext = extMap[format] || 'css';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animation.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-background/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
        <div className="px-3 py-2 border-b border-border/10 bg-card/20 relative">
          {/* Custom Tab Header with Arrows */}
          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg relative overflow-hidden group">
            {showLeftArrow && (
              <button
                onClick={() => scroll(-1)}
                className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-r from-muted to-transparent z-20 text-primary animate-in fade-in duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(f.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all shrink-0 ${activeTab === f.id
                    ? 'bg-background text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                  <f.icon className={`h-3 w-3 ${activeTab === f.id ? 'opacity-100' : 'opacity-50'}`} />
                  {f.label}
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-l from-muted to-transparent z-20 text-primary animate-in fade-in duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {FORMATS.map((f) => (
            <TabsContent key={f.id} value={f.id} className="absolute inset-0 mt-0 flex flex-col p-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex-1 flex flex-col rounded-xl border border-border/40 bg-card/50 overflow-hidden shadow-inner">
                {/* Code Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground ml-2">animation.{f.id === 'framer' || f.id === 'gsap' ? 'js' : f.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => handleCopy(f.id, generated[f.id])}
                    >
                      {copiedId === f.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => handleDownload(generated[f.id], f.id)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Code Body */}
                <ScrollArea className="flex-1">
                  <pre className="p-4 text-[11px] font-mono leading-relaxed text-foreground/90 selection:bg-primary/20">
                    {generated[f.id]}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
