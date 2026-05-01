// ===== Animation Engine Hook =====
// Core hook that generates CSS from Redux animation state

import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectAllAnimations } from '@/features/animation/animationSlice';
import {
  TRANSFORM_DEFAULTS,
  OPACITY_DEFAULTS,
  STROKE_DEFAULTS,
  TIMING_DEFAULTS,
  INTERACTION_DEFAULTS,
} from '@/utils/constants';

const DEFAULTS = {
  transform: TRANSFORM_DEFAULTS,
  opacity: OPACITY_DEFAULTS,
  stroke: STROKE_DEFAULTS,
  timing: TIMING_DEFAULTS,
  interaction: INTERACTION_DEFAULTS,
};

function safeGet(config, section, key) {
  return config?.[section]?.[key] ?? DEFAULTS[section]?.[key];
}

function buildTransform(t) {
  const parts = [];
  const tx = t?.translateX || 0;
  const ty = t?.translateY || 0;
  if (tx || ty) parts.push(`translate(${tx}px, ${ty}px)`);
  if (t?.rotation) parts.push(`rotate(${t.rotation}deg)`);
  const sx = t?.scaleX ?? 1;
  const sy = t?.scaleY ?? 1;
  if (sx !== 1 || sy !== 1) parts.push(`scale(${sx}, ${sy})`);
  if (t?.skewX) parts.push(`skewX(${t.skewX}deg)`);
  if (t?.skewY) parts.push(`skewY(${t.skewY}deg)`);
  return parts.length ? parts.join(' ') : 'none';
}

/**
 * Generates a complete CSS string for all configured animations
 * @param {boolean} isPlaying - whether animations should be running
 * @param {number} speed - playback speed multiplier
 * @returns {string} CSS to inject into preview
 */
export default function useAnimationEngine() {
  const animations = useAppSelector(selectAllAnimations);
  const isPlaying = useAppSelector((s) => s.preview.isPlaying);
  const speed = useAppSelector((s) => s.preview.speed);
  const animKey = useAppSelector((s) => s.preview.animKey);
  const loopEnabled = useAppSelector((s) => s.preview.loopEnabled);

  const css = useMemo(() => {
    let output = '';
    const entries = Object.entries(animations);
    if (entries.length === 0) return '';

    for (const [elementId, config] of entries) {
      const t = config?.transform || DEFAULTS.transform;
      const o = config?.opacity || DEFAULTS.opacity;
      const s = config?.stroke || DEFAULTS.stroke;
      const timing = config?.timing || DEFAULTS.timing;
      const trigger = config?.interaction?.trigger || 'auto';

      const isGlobal = elementId === '__global__';
      const animName = `anim-${elementId.replace(/[^a-zA-Z0-9-_]/g, '')}`;
      const duration = (timing.duration || 1) / speed;
      const transformStr = buildTransform(t);

      // Check if anything is actually animated
      const hasTransform = transformStr !== 'none';
      const hasOpacity = o.from !== o.to;
      const hasStroke = s.dashoffset || s.drawEffect;
      if (!hasTransform && !hasOpacity && !hasStroke) continue;

      // Generate @keyframes
      output += `@keyframes ${animName} {\n`;
      output += `  0% {\n`;
      output += `    transform: none;\n`;
      output += `    opacity: ${o.from};\n`;
      if (hasStroke) output += `    stroke-dashoffset: ${s.dashoffset || 500};\n`;
      output += `  }\n`;
      output += `  100% {\n`;
      output += `    transform: ${transformStr};\n`;
      output += `    opacity: ${o.to};\n`;
      if (hasStroke) output += `    stroke-dashoffset: 0;\n`;
      output += `  }\n`;
      output += `}\n`;

      // Build selector
      const baseSelector = isGlobal ? '.svg-preview-container svg' : `#${elementId}`;
      const iterations = loopEnabled ? (timing.iterationCount || 'infinite') : '1';
      const animValue = `${animName} ${duration}s ${timing.easing || 'ease'} ${timing.delay || 0}s ${iterations} ${timing.direction || 'normal'} ${timing.fillMode || 'forwards'}`;

      if (trigger === 'hover') {
        output += `${baseSelector}:hover {\n`;
        output += `  animation: ${animValue};\n`;
        output += `}\n`;
      } else if (trigger === 'click') {
        output += `${baseSelector}.is-animating {\n`;
        output += `  animation: ${animValue};\n`;
        output += `}\n`;
      } else {
        // Auto
        output += `${baseSelector} {\n`;
        output += `  animation: ${animValue};\n`;
        output += `  animation-play-state: var(--play-state, running);\n`;
        output += `}\n`;
      }

      // Stroke dasharray setup
      if (hasStroke && s.dasharray) {
        output += `${baseSelector} {\n`;
        output += `  stroke-dasharray: ${s.dasharray};\n`;
        output += `}\n`;
      }
    }

    return output;
  }, [animations, speed, animKey, loopEnabled]);

  return css;
}
