// ===== Timing Tab =====

import { useAppDispatch } from '@/app/hooks';
import { updateTiming } from '@/features/animation/animationSlice';
import SliderControl from './SliderControl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RANGES, EASING_OPTIONS, DIRECTION_OPTIONS, ITERATION_OPTIONS } from '@/utils/constants';

export default function TimingTab({ config }) {
  const dispatch = useAppDispatch();
  const t = config.timing;

  const update = (key, value) => dispatch(updateTiming({ [key]: value }));

  return (
    <div className="space-y-4 p-1">
      <SliderControl label="Duration" value={t.duration} onChange={(v) => update('duration', v)} {...RANGES.duration} />
      <SliderControl label="Delay" value={t.delay} onChange={(v) => update('delay', v)} {...RANGES.delay} />

      <div className="space-y-2">
        <Label className="text-xs">Easing</Label>
        <Select value={t.easing} onValueChange={(v) => update('easing', v)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EASING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Direction</Label>
        <Select value={t.direction} onValueChange={(v) => update('direction', v)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIRECTION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Iterations</Label>
        <Select value={String(t.iterationCount)} onValueChange={(v) => update('iterationCount', v)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITERATION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
