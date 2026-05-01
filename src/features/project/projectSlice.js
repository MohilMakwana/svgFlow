// ===== Project Slice =====

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'Untitled Project',
  savedAt: null,
  autoSaveEnabled: true,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName(state, action) {
      state.name = action.payload;
    },
    setSavedAt(state, action) {
      state.savedAt = action.payload;
    },
    setAutoSave(state, action) {
      state.autoSaveEnabled = action.payload;
    },
  },
});

export const { setProjectName, setSavedAt, setAutoSave } = projectSlice.actions;
export default projectSlice.reducer;
