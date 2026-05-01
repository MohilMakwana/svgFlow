// ===== SliderControl =====
// Safe wrapper that handles both array and number values from shadcn Slider

import { Slider } from '@/components/ui/slider';

export default function SliderControl({ label, value, onChange, min, max, step, unit = '' }) {
  const displayValue = typeof value === 'number' ? value : Number(value) || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="text-xs font-mono text-foreground tabular-nums">
          {Number.isInteger(displayValue) ? displayValue : displayValue.toFixed(2)}{unit}
        </span>
      </div>
      <Slider
        value={[displayValue]}
        onValueChange={(arr) => onChange(Array.isArray(arr) ? arr[0] : arr)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}
