// ===== Presets Page =====

import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { applyPreset } from '@/features/animation/animationSlice';
import { presetAnimations, presetCategories } from '@/data/presetAnimations';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function PresetsPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  let filtered = presetAnimations;
  if (activeCategory !== 'all') {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
  }

  const handleApply = (preset) => {
    dispatch(applyPreset(preset.config));
    toast.success(`Copied "${preset.name}" preset configuration to your clipboard (simulated)`);
  };

  return (
    <div className="flex-1 overflow-auto bg-background/50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Animation Presets</h1>
          <p className="text-muted-foreground mt-2">
            Browse and apply pre-configured animations to your SVG elements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search presets..."
              className="pl-9 h-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {presetCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApply(preset)}
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-center"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {preset.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{preset.name}</h3>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {preset.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                <Zap className="h-3 w-3" />
                Click to apply
              </div>
            </button>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No presets found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
