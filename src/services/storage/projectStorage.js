// ===== Project Storage Service =====

import { STORAGE_KEYS } from '@/utils/constants';

export function saveProject(projectData) {
  try {
    const data = { ...projectData, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEYS.project, JSON.stringify(data));
    return data.savedAt;
  } catch {
    return null;
  }
}

export function loadProject() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.project);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function exportProjectToJson(projectData) {
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `svgml-project-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearProjectData() {
  localStorage.removeItem(STORAGE_KEYS.project);
}
