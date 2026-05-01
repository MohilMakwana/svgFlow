// ===== Timeline Slice =====

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: true,
  duration: 5,
  zoom: 1,
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    toggleTimeline(state) {
      state.isOpen = !state.isOpen;
    },
    setTimelineDuration(state, action) {
      state.duration = action.payload;
    },
    setTimelineZoom(state, action) {
      state.zoom = Math.max(0.5, Math.min(4, action.payload));
    },
  },
});

export const { toggleTimeline, setTimelineDuration, setTimelineZoom } = timelineSlice.actions;
export default timelineSlice.reducer;
