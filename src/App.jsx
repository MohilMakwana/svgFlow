import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import PlaygroundPage from '@/pages/PlaygroundPage';
import PresetsPage from '@/pages/PresetsPage';
import SettingsPage from '@/pages/SettingsPage';
import CommandPalette from '@/components/common/CommandPalette';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';
import { useAppSelector } from '@/app/hooks';

function App() {
  // Global hooks
  useKeyboardShortcuts();
  
  // Theme sync
  const theme = useAppSelector((s) => s.ui.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<PlaygroundPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
      <CommandPalette />
    </>
  );
}

export default App;
