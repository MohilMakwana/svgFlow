// ===== App-Wide Constants =====

export const APP_NAME = 'SvgFlow';
export const APP_VERSION = '2.0.0';

// ---- Animation Defaults ----
export const TRANSFORM_DEFAULTS = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

export const OPACITY_DEFAULTS = {
  from: 1,
  to: 1,
};

export const STROKE_DEFAULTS = {
  dasharray: '',
  dashoffset: 0,
  drawEffect: false,
};

export const FILL_DEFAULTS = {
  fromColor: '',
  toColor: '',
};

export const TIMING_DEFAULTS = {
  duration: 1,
  delay: 0,
  iterationCount: 'infinite',
  direction: 'normal',
  easing: 'ease',
  fillMode: 'forwards',
};

export const INTERACTION_DEFAULTS = {
  trigger: 'auto',
};

// ---- Slider Ranges ----
export const RANGES = {
  rotation:    { min: -360, max: 360, step: 1, unit: '°' },
  scaleX:      { min: 0, max: 3, step: 0.05, unit: 'x' },
  scaleY:      { min: 0, max: 3, step: 0.05, unit: 'x' },
  translateX:  { min: -200, max: 200, step: 1, unit: 'px' },
  translateY:  { min: -200, max: 200, step: 1, unit: 'px' },
  skewX:       { min: -45, max: 45, step: 1, unit: '°' },
  skewY:       { min: -45, max: 45, step: 1, unit: '°' },
  opacityFrom: { min: 0, max: 1, step: 0.01, unit: '' },
  opacityTo:   { min: 0, max: 1, step: 0.01, unit: '' },
  dashoffset:  { min: -500, max: 500, step: 1, unit: '' },
  duration:    { min: 0.1, max: 10, step: 0.1, unit: 's' },
  delay:       { min: 0, max: 5, step: 0.1, unit: 's' },
};

// ---- Easing Options ----
export const EASING_OPTIONS = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', label: 'Elastic' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring' },
  { value: 'cubic-bezier(0.22, 0.61, 0.36, 1)', label: 'Smooth' },
  { value: 'steps(4, end)', label: 'Steps (4)' },
  { value: 'steps(8, end)', label: 'Steps (8)' },
];

export const DIRECTION_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'alternate-reverse', label: 'Alt-Reverse' },
];

export const ITERATION_OPTIONS = [
  { value: '1', label: '1x' },
  { value: '2', label: '2x' },
  { value: '3', label: '3x' },
  { value: '5', label: '5x' },
  { value: 'infinite', label: '∞ Loop' },
];

export const TRIGGER_OPTIONS = [
  { value: 'auto', label: 'Auto Play', desc: 'Plays automatically' },
  { value: 'hover', label: 'On Hover', desc: 'Plays on mouse hover' },
  { value: 'click', label: 'On Click', desc: 'Plays on click' },
];

// ---- Performance Thresholds ----
export const PERF_THRESHOLDS = {
  maxElements: 50,
  maxPathPoints: 500,
  maxFilters: 3,
  maxGradients: 5,
  complexThreshold: 100,
};

// ---- Animatable SVG Elements ----
export const ANIMATABLE_ELEMENTS = [
  'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline',
  'rect', 'text', 'g', 'use', 'image', 'foreignObject',
];

// ---- Storage Keys ----
export const STORAGE_KEYS = {
  theme: 'svgml-theme',
  presets: 'svgml-presets',
  project: 'svgml-project',
  activeAiProvider: 'svgml-ai-provider',
  apiKey: 'svgml-api-key', // Used for Gemini (legacy compatibility)
  openaiKey: 'svgml-openai-key',
  anthropicKey: 'svgml-anthropic-key',
  groqKey: 'svgml-groq-key',
  favorites: 'svgml-favorites',
  recentProjects: 'svgml-recent',
};

// ---- Keyboard Shortcuts ----
export const SHORTCUTS = {
  togglePlay: { key: ' ', label: 'Space', desc: 'Play / Pause' },
  toggleTheme: { key: 'KeyT', label: 'T', desc: 'Toggle Theme', ctrl: true },
  commandPalette: { key: 'KeyK', label: 'K', desc: 'Command Palette', ctrl: true },
  save: { key: 'KeyS', label: 'S', desc: 'Save Project', ctrl: true },
  exportCode: { key: 'KeyE', label: 'E', desc: 'Export Code', ctrl: true },
  resetAnim: { key: 'KeyR', label: 'R', desc: 'Reset Animation' },
  zoomIn: { key: 'Equal', label: '+', desc: 'Zoom In', ctrl: true },
  zoomOut: { key: 'Minus', label: '-', desc: 'Zoom Out', ctrl: true },
};

// ---- Background Options ----
export const BG_OPTIONS = [
  { value: 'dark', label: 'Dark', color: '#0f0f14' },
  { value: 'light', label: 'Light', color: '#f5f5f7' },
  { value: 'grid', label: 'Grid', color: null },
  { value: 'transparent', label: 'Transparent', color: null },
];

// ---- Speed Options ----
export const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
