// ===== Redux Store =====

import { configureStore } from '@reduxjs/toolkit';
import svgReducer from '@/features/svg/svgSlice';
import animationReducer from '@/features/animation/animationSlice';
import previewReducer from '@/features/preview/previewSlice';
import timelineReducer from '@/features/timeline/timelineSlice';
import uiReducer from '@/features/ui/uiSlice';
import aiReducer from '@/features/ai/aiSlice';
import performanceReducer from '@/features/performance/performanceSlice';
import projectReducer from '@/features/project/projectSlice';
import { saveProject, loadProject } from '@/services/storage/projectStorage';

// Load preloaded state from localStorage
let preloadedState = loadProject();

if (preloadedState) {
  // Explicitly remove non-reducer keys to avoid Redux warnings
  delete preloadedState.savedAt;

  // Ensure we don't lose default preview values and force paused state on load
  if (preloadedState.preview) {
    preloadedState.preview = {
      ...preloadedState.preview,
      isPlaying: false,
      animKey: 0,
      speed: preloadedState.preview.speed || 1,
      loopEnabled: preloadedState.preview.loopEnabled !== undefined 
        ? preloadedState.preview.loopEnabled 
        : (localStorage.getItem('svgml_preview_loop') === 'true'),
    };
  }
}

export const store = configureStore({
  reducer: {
    svg: svgReducer,
    animation: animationReducer,
    preview: previewReducer,
    timeline: timelineReducer,
    ui: uiReducer,
    ai: aiReducer,
    performance: performanceReducer,
    project: projectReducer,
  },
  preloadedState: preloadedState || undefined,
  devTools: import.meta.env.DEV,
});

// Subscribe to store changes and save to localStorage
let timer;
store.subscribe(() => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const state = store.getState();
    saveProject({
      svg: state.svg,
      animation: state.animation,
      timeline: state.timeline,
      preview: {
        background: state.preview.background,
        showGrid: state.preview.showGrid,
        zoom: state.preview.zoom,
        speed: state.preview.speed,
        loopEnabled: state.preview.loopEnabled,
      },
    });
  }, 1000); // Debounce save
});
