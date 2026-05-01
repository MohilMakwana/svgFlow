// ===== Opacity Tab =====

import { useAppDispatch } from '@/app/hooks';
import { updateOpacity } from '@/features/animation/animationSlice';
import SliderControl from './SliderControl';
import { RANGES } from '@/utils/constants';

export default function OpacityTab({ config }) {
  const dispatch = useAppDispatch();
  const o = config.opacity;

  return (
    <div className="space-y-4 p-1">
      <SliderControl label="From Opacity" value={o.from} onChange={(v) => dispatch(updateOpacity({ from: v }))} {...RANGES.opacityFrom} />
      <SliderControl label="To Opacity" value={o.to} onChange={(v) => dispatch(updateOpacity({ to: v }))} {...RANGES.opacityTo} />

      <div className="flex gap-3 mt-4">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full h-12 rounded-lg border border-border/30 flex items-center justify-center" style={{ opacity: o.from }}>
            <div className="w-8 h-8 rounded bg-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground">Start</span>
        </div>
        <div className="flex items-center text-muted-foreground text-xs">→</div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full h-12 rounded-lg border border-border/30 flex items-center justify-center" style={{ opacity: o.to }}>
            <div className="w-8 h-8 rounded bg-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground">End</span>
        </div>
      </div>
    </div>
  );
}
