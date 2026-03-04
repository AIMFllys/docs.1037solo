import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useLocation } from 'react-router-dom';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronUp, List, X } from 'lucide-react';

// Import content files
import faq from '@/content/faq.md?raw';
import guide from '@/content/guide.md?raw';
import features from '@/content/features.md?raw';
import changelog from '@/content/changelog.md?raw';
import announcements from '@/content/announcements.md?raw';
import feedback from '@/content/feedback.md?raw';
import rules from '@/content/rules.md?raw';

const docsMap: Record<string, string> = {
  faq,
  guide,
  features,
  changelog,
  announcements,
  feedback,
  rules
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function DocPage() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [content, setContent] = useState('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '');
  };

  // Find the portal target for mobile TOC button
  useEffect(() => {
    const el = document.getElementById('mobile-toc-trigger');
    setPortalTarget(el);
  }, []);

  useEffect(() => {
    if (slug && docsMap[slug]) {
      const markdownContent = docsMap[slug];
      setContent(markdownContent);

      const lines = markdownContent.split('\n');
      const extractedToc: TocItem[] = [];
      const idCounts: Record<string, number> = {};

      lines.forEach(line => {
        const match = line.match(/^(#{2,3})\s+(.+)/);
        if (match) {
          const level = match[1].length;
          const text = match[2].trim();
          let baseId = slugify(text);
          if (!baseId) baseId = 'section';

          let finalId = baseId;
          if (idCounts[baseId]) {
            finalId = `${baseId}-${idCounts[baseId]}`;
            idCounts[baseId]++;
          } else {
            idCounts[baseId] = 1;
          }

          extractedToc.push({
            id: finalId,
            text: text.replace(/[*_~`]/g, ''),
            level
          });
        }
      });
      setToc(extractedToc);
      setActiveId(extractedToc.length > 0 ? extractedToc[0].id : '');
    } else {
      setContent('# 404 Not Found\nRequested document does not exist.');
      setToc([]);
    }
    setMobileTocOpen(false);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(scrollPosition > 600);

      if (toc.length === 0) return;

      const headingElements = toc.map(item => document.getElementById(item.id)).filter(Boolean);
      let currentActiveId = toc[0].id;

      for (const element of headingElements) {
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight / 3) {
          currentActiveId = element.id;
        } else {
          break;
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  // Lock body scroll when mobile TOC is open
  useEffect(() => {
    if (mobileTocOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileTocOpen]);

  const scrollToSection = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `${pathname}#${id}`);
      setActiveId(id);
      setMobileTocOpen(false);
    }
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile TOC trigger button (rendered via portal into the mobile header)
  const mobileTocButton = toc.length > 0 && portalTarget
    ? createPortal(
      <button
        onClick={() => setMobileTocOpen(true)}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        title="本页目录"
        aria-label="打开本页目录"
      >
        <List className="w-[18px] h-[18px]" />
      </button>,
      portalTarget
    )
    : null;

  return (
    <div className="relative flex gap-8 animate-in fade-in duration-500">

      {/* Reading progress bar - top fixed */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-[100]">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 transition-all duration-300 ease-out shadow-sm shadow-blue-500/30"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Portal: mobile TOC button is rendered into mobile header */}
      {mobileTocButton}

      {/* Mobile TOC Overlay */}
      {mobileTocOpen && (
        <div className="xl:hidden fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileTocOpen(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          />

          {/* Drawer - slides in from the right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[78%] max-w-[340px] bg-background border-l border-border/40 shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-semibold text-sm tracking-wide">本页目录</h3>
              </div>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="关闭目录"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reading progress in drawer */}
            <div className="px-5 pt-3 pb-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground/60 mb-1.5">
                <span>阅读进度</span>
                <span className="font-mono tabular-nums">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>

            {/* TOC List */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
              {toc.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(item.id, e)}
                    className={cn(
                      "group relative flex items-center py-2.5 px-3 transition-all duration-200 rounded-lg text-[13px]",
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60 active:bg-muted",
                      item.level === 3 ? "pl-7 text-[12px]" : "pl-3"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-md" />
                    )}
                    {item.level === 3 && (
                      <ChevronRight className={cn(
                        "w-3 h-3 mr-1.5 shrink-0 transition-all",
                        isActive ? "opacity-100 text-blue-500" : "opacity-30"
                      )} />
                    )}
                    <span className="line-clamp-2 leading-snug">{item.text}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pb-32">
        <div className={cn(
          "w-full max-w-4xl pt-4 lg:pt-6",
          slug === 'changelog' && "changelog-timeline"
        )}>
          <MarkdownRenderer content={content} />
        </div>
      </div>

      {/* Right Sidebar - Table of Contents (Desktop only) */}
      {toc.length > 0 && (
        <aside className="hidden xl:block w-64 2xl:w-72 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-5 border-l border-border/30 py-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">

            <h4 className="font-semibold text-xs mb-5 text-muted-foreground/60 tracking-[0.15em] uppercase flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5 animate-pulse" />
              本页目录
            </h4>

            <nav className="flex flex-col space-y-0.5 text-[13px]">
              {toc.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(item.id, e)}
                    className={cn(
                      "group relative flex items-center py-1.5 transition-all duration-200 rounded-md",
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-muted-foreground/70 hover:text-foreground/90",
                      item.level === 3 ? "pl-6 text-[12px]" : "pl-2"
                    )}
                  >
                    {isActive && (
                      <span className="absolute -left-[21px] w-[2px] h-4 bg-blue-500 rounded-r-md transition-all" />
                    )}
                    {item.level === 3 && (
                      <ChevronRight className={cn(
                        "w-3 h-3 mr-1 opacity-0 -ml-2 transition-all shrink-0",
                        isActive ? "opacity-100 text-blue-500" : "group-hover:opacity-50"
                      )} />
                    )}
                    <span className="line-clamp-1">{item.text}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* Back to top floating button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md border border-border/30 flex items-center justify-center text-foreground/60 hover:text-foreground transition-all duration-300 shadow-lg z-50"
          title="回到顶部"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}