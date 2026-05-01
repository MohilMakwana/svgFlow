// ===== Settings Page =====

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setTheme } from '@/features/ui/uiSlice';
import { STORAGE_KEYS } from '@/utils/constants';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Key, Moon, Sun, Monitor, Save, Trash2, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  const [provider, setProvider] = useState(() => localStorage.getItem(STORAGE_KEYS.activeAiProvider) || 'openai');
  const [keys, setKeys] = useState(() => ({
    openai: localStorage.getItem(STORAGE_KEYS.openaiKey) || '',
    anthropic: localStorage.getItem(STORAGE_KEYS.anthropicKey) || '',
    groq: localStorage.getItem(STORAGE_KEYS.groqKey) || '',
  }));

  const handleSaveApiKeys = () => {
    localStorage.setItem(STORAGE_KEYS.activeAiProvider, provider);

    if (keys.openai) localStorage.setItem(STORAGE_KEYS.openaiKey, keys.openai.trim());
    else localStorage.removeItem(STORAGE_KEYS.openaiKey);

    if (keys.anthropic) localStorage.setItem(STORAGE_KEYS.anthropicKey, keys.anthropic.trim());
    else localStorage.removeItem(STORAGE_KEYS.anthropicKey);

    if (keys.groq) localStorage.setItem(STORAGE_KEYS.groqKey, keys.groq.trim());
    else localStorage.removeItem(STORAGE_KEYS.groqKey);

    toast.success('AI Settings saved successfully');
  };

  const handleClearData = () => {
    localStorage.clear();
    setKeys({ openai: '', anthropic: '', groq: '' });
    toast.success('All local data cleared');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="flex-1 overflow-auto bg-background/50 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your preferences and API configurations.
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Settings */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Configuration</h3>
                <p className="text-sm text-muted-foreground">Select your preferred AI provider for suggestions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Active Provider</Label>
                  <select
                    className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value="openai">OpenAI (gpt-4o)</option>
                    <option value="anthropic">Anthropic (claude-3-5-sonnet)</option>
                    <option value="groq">Groq (llama-3.3-70b-versatile)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>API Key for {provider.charAt(0).toUpperCase() + provider.slice(1)}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={keys[provider]}
                      onChange={(e) => setKeys({ ...keys, [provider]: e.target.value })}
                      placeholder="Enter API Key..."
                      className="font-mono"
                    />
                    <Button onClick={handleSaveApiKeys} className="gap-2 shrink-0">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-600 dark:text-amber-500">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Security Note</p>
                  <p>Your API key is stored locally in your browser's localStorage.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize the application UI</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => dispatch(setTheme('light'))}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'
                  }`}
              >
                <Sun className="h-8 w-8" />
                <span className="font-medium">Light Mode</span>
              </button>
              <button
                onClick={() => dispatch(setTheme('dark'))}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'
                  }`}
              >
                <Moon className="h-8 w-8" />
                <span className="font-medium">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Management</h3>
                <p className="text-sm text-muted-foreground">Clear local app data</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div>
                <p className="font-medium text-sm">Clear Local Storage</p>
                <p className="text-xs text-muted-foreground mt-1">Deletes API key, settings, and saved projects.</p>
              </div>
              <Button variant="destructive" onClick={handleClearData} size="sm">
                Clear All Data
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
