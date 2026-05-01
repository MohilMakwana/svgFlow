// ===== Sample SVG Picker =====

import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setSvgCode, setElements } from '@/features/svg/svgSlice';
import { clearAllAnimations } from '@/features/animation/animationSlice';
import { parseSvgCode, injectElementIds } from '@/utils/svgParser';
import { sampleSvgs, sampleCategories } from '@/data/sampleSvgs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function SampleSvgPicker() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? sampleSvgs
    : sampleSvgs.filter((s) => s.category === filter);

  const handleSelect = (sample) => {
    const modified = injectElementIds(sample.code);
    dispatch(setSvgCode(modified));
    const { elements } = parseSvgCode(modified);
    dispatch(setElements(elements));
    dispatch(clearAllAnimations());
    toast.success(`Loaded "${sample.name}"`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
          <Sparkles className="h-3.5 w-3.5" />
          Browse Samples
        </button>
      } />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sample SVGs</DialogTitle>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4">
          {sampleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
          {filtered.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelect(sample)}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div
                className="w-full aspect-square rounded-lg bg-muted/50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform"
                dangerouslySetInnerHTML={{ __html: sample.code }}
              />
              <span className="text-xs font-medium">{sample.name}</span>
              <Badge variant="secondary" className="text-[10px]">
                {sample.category}
              </Badge>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
