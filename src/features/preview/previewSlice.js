// ===== Preview Slice =====

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  speed: 1,
  background: 'dark',
  showGrid: false,
  zoom: 1,
  loopEnabled: localStorage.getItem('svgml_preview_loop') === 'true',
  animKey: 0,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setSpeed(state, action) {
      state.speed = action.payload || 1;
    },
    setBackground(state, action) {
      state.background = action.payload;
    },
    toggleGrid(state) {
      state.showGrid = !state.showGrid;
    },
    setZoom(state, action) {
      state.zoom = Math.max(0.25, Math.min(3, action.payload));
    },
    zoomIn(state) {
      state.zoom = Math.min(3, state.zoom + 0.25);
    },
    zoomOut(state) {
      state.zoom = Math.max(0.25, state.zoom - 0.25);
    },
    restartAnimation(state) {
      state.animKey += 1;
      state.isPlaying = true;
    },
    toggleLoop(state) {
      state.loopEnabled = !state.loopEnabled;
      localStorage.setItem('svgml_preview_loop', state.loopEnabled);
    },
  },
});

export const {
  togglePlay,
  setPlaying,
  setSpeed,
  setBackground,
  toggleGrid,
  setZoom,
  zoomIn,
  zoomOut,
  restartAnimation,
  toggleLoop,
} = previewSlice.actions;

export default previewSlice.reducer;
