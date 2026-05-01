// ===== Stroke Tab =====

import { useAppDispatch } from '@/app/hooks';
import { updateStroke } from '@/features/animation/animationSlice';
import SliderControl from './SliderControl';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RANGES } from '@/utils/constants';

export default function StrokeTab({ config }) {
  const dispatch = useAppDispatch();
  const s = config.stroke;

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-2">
        <Label className="text-xs">Dash Array</Label>
        <Input
          value={s.dasharray}
          onChange={(e) => dispatch(updateStroke({ dasharray: e.target.value }))}
          placeholder="e.g. 10 5 or 500"
          className="h-8 text-xs font-mono"
        />
      </div>

      <SliderControl
        label="Dash Offset"
        value={s.dashoffset}
        onChange={(v) => dispatch(updateStroke({ dashoffset: v }))}
        {...RANGES.dashoffset}
      />

      <div className="flex items-center justify-between pt-2">
        <Label className="text-xs text-muted-foreground">Draw-on Effect</Label>
        <Switch
          checked={s.drawEffect}
          onCheckedChange={(v) => dispatch(updateStroke({ drawEffect: v }))}
        />
      </div>
      {s.drawEffect && (
        <p className="text-[10px] text-muted-foreground bg-muted/50 rounded-lg p-2">
          Set dash array to path length and dash offset to animate the stroke drawing
        </p>
      )}
    </div>
  );
}
