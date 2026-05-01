// ===== Preset Storage Service =====

import { STORAGE_KEYS } from '@/utils/constants';

export function loadPresets() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.presets);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePreset(preset) {
  try {
    const presets = loadPresets();
    presets.push({ ...preset, id: `custom-${Date.now()}`, createdAt: Date.now() });
    localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(presets));
    return presets;
  } catch {
    return [];
  }
}

export function deletePreset(id) {
  try {
    const presets = loadPresets().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(presets));
    return presets;
  } catch {
    return [];
  }
}

export function exportPresetsToJson(presets) {
  const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'svgml-presets.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function loadFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.favorites);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}
