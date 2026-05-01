// ===== Performance Slice =====

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 100,
  warnings: [],
  stats: null,
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setPerformanceData(state, action) {
      state.score = action.payload.score;
      state.warnings = action.payload.warnings;
      state.stats = action.payload.stats;
    },
  },
});

export const { setPerformanceData } = performanceSlice.actions;
export default performanceSlice.reducer;
