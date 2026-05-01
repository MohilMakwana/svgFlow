// ===== Animation Slice =====

import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  TRANSFORM_DEFAULTS,
  OPACITY_DEFAULTS,
  STROKE_DEFAULTS,
  TIMING_DEFAULTS,
  INTERACTION_DEFAULTS,
} from '@/utils/constants';

const createDefaultConfig = () => ({
  transform: { ...TRANSFORM_DEFAULTS },
  opacity: { ...OPACITY_DEFAULTS },
  stroke: { ...STROKE_DEFAULTS },
  timing: { ...TIMING_DEFAULTS },
  interaction: { ...INTERACTION_DEFAULTS },
});

const initialState = {
  elementAnimations: {},
  activeElementId: null,
};

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    setActiveElement(state, action) {
      state.activeElementId = action.payload;
      if (action.payload && !state.elementAnimations[action.payload]) {
        state.elementAnimations[action.payload] = createDefaultConfig();
      }
    },
    updateTransform(state, action) {
      const id = state.activeElementId || '__global__';
      if (!state.elementAnimations[id]) state.elementAnimations[id] = createDefaultConfig();
      Object.assign(state.elementAnimations[id].transform, action.payload);
    },
    updateOpacity(state, action) {
      const id = state.activeElementId || '__global__';
      if (!state.elementAnimations[id]) state.elementAnimations[id] = createDefaultConfig();
      Object.assign(state.elementAnimations[id].opacity, action.payload);
    },
    updateStroke(state, action) {
      const id = state.activeElementId || '__global__';
      if (!state.elementAnimations[id]) state.elementAnimations[id] = createDefaultConfig();
      Object.assign(state.elementAnimations[id].stroke, action.payload);
    },
    updateTiming(state, action) {
      const id = state.activeElementId || '__global__';
      if (!state.elementAnimations[id]) state.elementAnimations[id] = createDefaultConfig();
      Object.assign(state.elementAnimations[id].timing, action.payload);
    },
    updateInteraction(state, action) {
      const id = state.activeElementId || '__global__';
      if (!state.elementAnimations[id]) state.elementAnimations[id] = createDefaultConfig();
      Object.assign(state.elementAnimations[id].interaction, action.payload);
    },
    applyPreset(state, action) {
      const id = state.activeElementId || '__global__';
      state.elementAnimations[id] = {
        ...createDefaultConfig(),
        ...action.payload,
        transform: { ...TRANSFORM_DEFAULTS, ...(action.payload.transform || {}) },
        opacity: { ...OPACITY_DEFAULTS, ...(action.payload.opacity || {}) },
        stroke: { ...STROKE_DEFAULTS, ...(action.payload.stroke || {}) },
        timing: { ...TIMING_DEFAULTS, ...(action.payload.timing || {}) },
        interaction: { ...INTERACTION_DEFAULTS, ...(action.payload.interaction || {}) },
      };
    },
    resetAnimation(state) {
      const id = state.activeElementId || '__global__';
      state.elementAnimations[id] = createDefaultConfig();
    },
    clearAllAnimations(state) {
      state.elementAnimations = {};
      state.activeElementId = null;
    },
    removeAnimation(state, action) {
      const id = action.payload;
      if (state.elementAnimations[id]) {
        delete state.elementAnimations[id];
      }
      if (state.activeElementId === id) {
        state.activeElementId = null;
      }
    },
    loadAnimationState(state, action) {
      if (action.payload?.elementAnimations) {
        state.elementAnimations = action.payload.elementAnimations;
      }
    },
  },
});

export const {
  setActiveElement,
  updateTransform,
  updateOpacity,
  updateStroke,
  updateTiming,
  updateInteraction,
  applyPreset,
  resetAnimation,
  clearAllAnimations,
  removeAnimation,
  loadAnimationState,
} = animationSlice.actions;

export default animationSlice.reducer;

// ---- Stable default config for fallback ----
const DEFAULT_CONFIG = createDefaultConfig();

/**
 * Deep merge helper: merges stored config with defaults to ensure no missing fields
 */
function deepMerge(defaults, stored) {
  if (!stored) return { ...defaults };
  const result = {};
  for (const key of Object.keys(defaults)) {
    if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
      result[key] = { ...defaults[key], ...(stored[key] || {}) };
    } else {
      result[key] = stored[key] !== undefined ? stored[key] : defaults[key];
    }
  }
  return result;
}

// ---- Memoized Selectors ----
export const selectActiveConfig = createSelector(
  [(s) => s.animation.elementAnimations, (s) => s.animation.activeElementId],
  (anims, activeId) => {
    const id = activeId || '__global__';
    const stored = anims[id];
    if (!stored) return DEFAULT_CONFIG;
    return deepMerge(DEFAULT_CONFIG, stored);
  }
);

export const selectAllAnimations = (s) => s.animation.elementAnimations;
