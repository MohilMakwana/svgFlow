// ===== Presets Library =====

import { useState, useMemo } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { applyPreset } from '@/features/animation/animationSlice';
import { setPlaying } from '@/features/preview/previewSlice';
import { presetAnimations, presetCategories } from '@/data/presetAnimations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function PresetsLibrary() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    let items = presetAnimations;
    if (activeCategory !== 'all') {
      items = items.filter((p) => p.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }
    return items;
  }, [search, activeCategory]);

  const handleApply = (preset) => {
    dispatch(applyPreset(preset.config));
    dispatch(setPlaying(true));
    toast.success(`Applied "${preset.name}"`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pt-2 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search presets..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto">
        {presetCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          {filtered.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApply(preset)}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
            >
              <div className="text-2xl">{preset.icon}</div>
              <span className="text-xs font-medium">{preset.name}</span>
              <Badge variant="secondary" className="text-[9px] px-1.5">
                {preset.category}
              </Badge>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="h-3 w-3 text-primary" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
