import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { ModeToggle } from '@/components/mode-toggle';
import { useEffect } from 'react';

export default function DocsLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <Sidebar />

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img
            src="http://husteread.com/wp-content/uploads/2026/01/1037-SOLO-右侧1.png"
            alt="Logo"
            className="w-6 h-6 object-contain"
          />
          <span className="font-semibold tracking-tight text-sm">1037Solo-Docs</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile TOC button is rendered by DocPage.tsx as a portal target */}
          <div id="mobile-toc-trigger" />
          <ModeToggle showLabel={false} />
        </div>
      </header>

      <main className="md:pl-64 min-h-screen pb-20 md:pb-0 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-6 md:pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}