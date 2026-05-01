// ===== Header =====

import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  Sun, Moon, Keyboard, Search, Save,
  Sparkles, Layers, Settings, Share2,
  PanelLeft, PanelRight
} from 'lucide-react';
import { toggleTheme, toggleCommandPalette, toggleLeftPanel, toggleRightPanel } from '@/features/ui/uiSlice';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { saveProject } from '@/services/storage/projectStorage';

export default function Header() {
  const dispatch = useAppDispatch();
  const { theme, leftPanelOpen, rightPanelOpen } = useAppSelector((s) => s.ui);
  const svgCode = useAppSelector((s) => s.svg.modifiedCode);
  const animations = useAppSelector((s) => s.animation.elementAnimations);
  const location = useLocation();

  const handleSave = () => {
    saveProject({ svgCode, animations, savedAt: Date.now() });
    toast.success('Project saved');
  };

  const handleShare = () => {
    try {
      const data = JSON.stringify({ svgCode, animations });
      const encoded = btoa(encodeURIComponent(data));
      const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Project too large to share via URL');
    }
  };

  const navItems = [
    { to: '/', label: 'Playground', icon: Layers },
    { to: '/presets', label: 'Presets', icon: Sparkles },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border/50 bg-card/80 backdrop-blur-lg z-50">
      {/* Left Side: Logo + Nav + Left Toggle */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger render={
            <button
              onClick={() => dispatch(toggleLeftPanel())}
              className={`p-1.5 rounded-md transition-colors hidden lg:flex ${leftPanelOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          } />
          <TooltipContent>{leftPanelOpen ? 'Hide' : 'Show'} Left Panel (Ctrl+[)</TooltipContent>
        </Tooltip>

        <Link to="/" className="flex items-center gap-2.5 group ml-1">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all group-hover:scale-105">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold tracking-tight leading-none text-foreground">
              Svg<span className="text-primary font-medium">Flow</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Motion Studio
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 ml-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${location.pathname === to
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <span className="hidden md:inline">{label}</span>
              <Icon className="h-3.5 w-3.5 md:hidden" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(toggleCommandPalette())} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
            </button>
          } />
          <TooltipContent>Command Palette (Ctrl+K)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={handleSave} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Save className="h-4 w-4" />
            </button>
          } />
          <TooltipContent>Save Project (Ctrl+S)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={handleShare} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          } />
          <TooltipContent>Share Project</TooltipContent>
        </Tooltip> */}

        <div className="w-px h-5 bg-border/50 mx-1" />

        <Tooltip>
          <TooltipTrigger render={
            <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          } />
          <TooltipContent>Toggle Theme (Ctrl+T)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={
            <button
              onClick={() => dispatch(toggleRightPanel())}
              className={`p-1.5 rounded-md transition-colors hidden lg:flex ml-1 ${rightPanelOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <PanelRight className="h-4 w-4" />
            </button>
          } />
          <TooltipContent>{rightPanelOpen ? 'Hide' : 'Show'} Right Panel (Ctrl+])</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
