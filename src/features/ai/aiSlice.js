import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { suggestAnimations, generateSvg, editSvg, analyzeSvgStructure } from '@/services/api/aiService';
import { setSvgCode, setModifiedCode, setElements, setParseError } from '@/features/svg/svgSlice';
import { clearAllAnimations } from '@/features/animation/animationSlice';
import { parseSvgCode } from '@/utils/svgParser';
import { toast } from 'sonner';

// ─── Thunks ───────────────────────────────────────────────────────────────────

/** Suggest animations for the current SVG */
export const suggestSvgAnimations = createAsyncThunk(
  'ai/suggestAnimations',
  async ({ svgCode, userPrompt = '' }, { getState, rejectWithValue }) => {
    try {
      const selectedId = getState().svg.selectedElementId;
      return await suggestAnimations(svgCode, userPrompt, selectedId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Generate a brand-new SVG from a text prompt */
export const generateSvgFromPrompt = createAsyncThunk(
  'ai/generateSvg',
  async (description, { dispatch, rejectWithValue }) => {
    try {
      const svgCode = await generateSvg(description);
      if (!svgCode) throw new Error('AI failed to return valid SVG');
      dispatch(clearAllAnimations());
      dispatch(setSvgCode(svgCode));
      const { elements, error } = parseSvgCode(svgCode);
      if (error) dispatch(setParseError(error));
      else { dispatch(setElements(elements)); dispatch(setParseError(null)); }
      toast.success('New SVG generated!');
      return svgCode;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Structurally edit the current SVG */
export const editSvgStructure = createAsyncThunk(
  'ai/editSvg',
  async ({ svgCode, instruction }, { getState, dispatch, rejectWithValue }) => {
    try {
      // Snapshot for undo
      const previousCode = getState().svg.modifiedCode;
      const selectedId = getState().svg.selectedElementId;
      
      const newSvgCode = await editSvg(svgCode, instruction, selectedId);
      if (!newSvgCode) throw new Error('AI returned empty SVG');
      
      dispatch(setModifiedCode(newSvgCode));
      const { elements, error } = parseSvgCode(newSvgCode);
      if (error) dispatch(setParseError(error));
      else { dispatch(setElements(elements)); dispatch(setParseError(null)); }
      
      toast.success('SVG updated!', {
        description: 'Click Undo to revert.',
        action: { label: 'Undo', onClick: () => dispatch(setModifiedCode(previousCode)) },
      });
      return newSvgCode;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Analyze SVG structure */
export const analyzeStructure = createAsyncThunk(
  'ai/analyzeStructure',
  async (svgCode, { rejectWithValue }) => {
    try {
      return await analyzeSvgStructure(svgCode);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  suggestions: [],
  analysis: null,
  isLoading: false,
  loadingMode: null, // 'animate' | 'generate' | 'edit' | 'analyze'
  error: null,
  lastIntent: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.suggestions = [];
      state.analysis = null;
      state.error = null;
      state.lastIntent = null;
    },
  },
  extraReducers: (builder) => {
    // ── suggestSvgAnimations ──
    builder
      .addCase(suggestSvgAnimations.pending, (state) => {
        state.isLoading = true;
        state.loadingMode = 'animate';
        state.error = null;
      })
      .addCase(suggestSvgAnimations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.suggestions = action.payload;
        state.lastIntent = 'animate';
      })
      .addCase(suggestSvgAnimations.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.error = action.payload || 'Animation suggestion failed';
      });

    // ── generateSvgFromPrompt ──
    builder
      .addCase(generateSvgFromPrompt.pending, (state) => {
        state.isLoading = true;
        state.loadingMode = 'generate';
        state.error = null;
      })
      .addCase(generateSvgFromPrompt.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.lastIntent = 'generate';
      })
      .addCase(generateSvgFromPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.error = action.payload || 'SVG generation failed';
      });

    // ── editSvgStructure ──
    builder
      .addCase(editSvgStructure.pending, (state) => {
        state.isLoading = true;
        state.loadingMode = 'edit';
        state.error = null;
      })
      .addCase(editSvgStructure.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.lastIntent = 'edit';
      })
      .addCase(editSvgStructure.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.error = action.payload || 'SVG editing failed';
      });

    // ── analyzeStructure ──
    builder
      .addCase(analyzeStructure.pending, (state) => {
        state.isLoading = true;
        state.loadingMode = 'analyze';
        state.error = null;
      })
      .addCase(analyzeStructure.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.analysis = action.payload;
        state.lastIntent = 'analyze';
      })
      .addCase(analyzeStructure.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingMode = null;
        state.error = action.payload || 'Analysis failed';
      });
  },
});

export const { clearSuggestions } = aiSlice.actions;
export default aiSlice.reducer;

// Legacy aliases for backward compatibility
export const analyzeSvg = suggestSvgAnimations;
