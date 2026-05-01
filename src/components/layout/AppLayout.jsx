// ===== App Layout =====

import { useAppSelector } from '@/app/hooks';
import Header from './Header';
import { Toaster } from '@/components/ui/sonner';

export default function AppLayout({ children }) {
  const { theme } = useAppSelector((s) => s.ui);

  return (
    <div className={`${theme} flex flex-col h-screen overflow-hidden bg-background text-foreground`}>
      <Header />
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
