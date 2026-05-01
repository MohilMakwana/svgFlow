// ===== Command Palette =====

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setCommandPaletteOpen, toggleTheme } from '@/features/ui/uiSlice';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Moon, Sun, Layers, Sparkles, Settings, FileCode, Play, Save } from 'lucide-react';

export default function CommandPalette() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector((s) => s.ui.isCommandPaletteOpen);
  const theme = useAppSelector((s) => s.ui.theme);

  const runCommand = (cmd) => {
    dispatch(setCommandPaletteOpen(false));
    cmd();
  };

  return (
    <CommandDialog open={open} onOpenChange={(val) => dispatch(setCommandPaletteOpen(val))}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Layers className="mr-2 h-4 w-4" />
            <span>Playground</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/presets'))}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Presets Library</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => dispatch(toggleTheme()))}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
            <span className="ml-auto text-xs text-muted-foreground text-[10px]">Ctrl+T</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
