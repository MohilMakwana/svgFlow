// ===== UI Slice =====

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/utils/constants';

const savedTheme = typeof window !== 'undefined'
  ? localStorage.getItem(STORAGE_KEYS.theme)
  : null;

const initialState = {
  theme: savedTheme || 'dark',
  leftPanelOpen: true,
  rightPanelOpen: true,
  isCommandPaletteOpen: false,
  showShortcuts: false,
  activeLeftTab: 'upload',
  activeRightTab: 'controls',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.theme, action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    },
    toggleLeftPanel(state) {
      state.leftPanelOpen = !state.leftPanelOpen;
    },
    toggleRightPanel(state) {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setCommandPaletteOpen(state, action) {
      state.isCommandPaletteOpen = action.payload;
    },
    toggleCommandPalette(state) {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    toggleShortcuts(state) {
      state.showShortcuts = !state.showShortcuts;
    },
    setActiveLeftTab(state, action) {
      state.activeLeftTab = action.payload;
    },
    setActiveRightTab(state, action) {
      state.activeRightTab = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  toggleLeftPanel,
  toggleRightPanel,
  setCommandPaletteOpen,
  toggleCommandPalette,
  toggleShortcuts,
  setActiveLeftTab,
  setActiveRightTab,
} = uiSlice.actions;

export default uiSlice.reducer;
