// ===== SVG Slice =====

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rawCode: '',
  modifiedCode: '',
  elements: [],
  selectedElementId: null,
  isValid: true,
  parseError: null,
};

const svgSlice = createSlice({
  name: 'svg',
  initialState,
  reducers: {
    setSvgCode(state, action) {
      state.rawCode = action.payload;
      state.modifiedCode = action.payload;
      state.parseError = null;
      state.isValid = true;
    },
    setModifiedCode(state, action) {
      state.modifiedCode = action.payload;
    },
    setElements(state, action) {
      state.elements = action.payload;
    },
    selectElement(state, action) {
      state.selectedElementId = action.payload;
    },
    setParseError(state, action) {
      state.parseError = action.payload;
      state.isValid = !action.payload;
    },
    clearSvg(state) {
      state.rawCode = '';
      state.modifiedCode = '';
      state.elements = [];
      state.selectedElementId = null;
      state.parseError = null;
      state.isValid = true;
    },
  },
});

export const {
  setSvgCode,
  setModifiedCode,
  setElements,
  selectElement,
  setParseError,
  clearSvg,
} = svgSlice.actions;

export default svgSlice.reducer;
