// ===== Transform Tab =====

import { useAppDispatch } from '@/app/hooks';
import { updateTransform } from '@/features/animation/animationSlice';
import SliderControl from './SliderControl';
import { RANGES } from '@/utils/constants';

export default function TransformTab({ config }) {
  const dispatch = useAppDispatch();
  const t = config.transform;

  const update = (key, value) => dispatch(updateTransform({ [key]: value }));

  return (
    <div className="space-y-4 p-1">
      <SliderControl label="Rotation" value={t.rotation} onChange={(v) => update('rotation', v)} {...RANGES.rotation} />
      <SliderControl label="Scale X" value={t.scaleX} onChange={(v) => update('scaleX', v)} {...RANGES.scaleX} />
      <SliderControl label="Scale Y" value={t.scaleY} onChange={(v) => update('scaleY', v)} {...RANGES.scaleY} />
      <SliderControl label="Translate X" value={t.translateX} onChange={(v) => update('translateX', v)} {...RANGES.translateX} />
      <SliderControl label="Translate Y" value={t.translateY} onChange={(v) => update('translateY', v)} {...RANGES.translateY} />
      <SliderControl label="Skew X" value={t.skewX} onChange={(v) => update('skewX', v)} {...RANGES.skewX} />
      <SliderControl label="Skew Y" value={t.skewY} onChange={(v) => update('skewY', v)} {...RANGES.skewY} />
    </div>
  );
}
