// ===== Keyboard Shortcuts Hook =====

import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { togglePlay } from '@/features/preview/previewSlice';
import { toggleTheme, toggleCommandPalette, toggleLeftPanel, toggleRightPanel } from '@/features/ui/uiSlice';

export default function useKeyboardShortcuts() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (e) => {
      // Don't fire in inputs or code editor
      const tag = e.target.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      const isCodeMirror = e.target.closest('.cm-editor');
      if (isEditable || isCodeMirror) return;

      // Space = Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(togglePlay());
      }

      // Ctrl+[ = Toggle left panel
      if (e.ctrlKey && e.code === 'BracketLeft') {
        e.preventDefault();
        dispatch(toggleLeftPanel());
      }

      // Ctrl+] = Toggle right panel
      if (e.ctrlKey && e.code === 'BracketRight') {
        e.preventDefault();
        dispatch(toggleRightPanel());
      }

      // Ctrl+T = Toggle theme
      if (e.ctrlKey && e.code === 'KeyT') {
        e.preventDefault();
        dispatch(toggleTheme());
      }

      // Ctrl+K = Command palette
      if (e.ctrlKey && e.code === 'KeyK') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);
}
