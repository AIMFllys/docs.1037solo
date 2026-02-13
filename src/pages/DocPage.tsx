import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

// Import content files
import faq from '@/content/faq.md?raw';
import guide from '@/content/guide.md?raw';
import features from '@/content/features.md?raw';
import changelog from '@/content/changelog.md?raw';
import announcements from '@/content/announcements.md?raw';
import feedback from '@/content/feedback.md?raw';

const docsMap: Record<string, string> = {
  faq,
  guide,
  features,
  changelog,
  announcements,
  feedback
};

export default function DocPage() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [toc, setToc] = useState<{ id: string; text: string; year: string; date: string }[]>([]);

  useEffect(() => {
    if (slug && docsMap[slug]) {
      setContent(docsMap[slug]);
      
      // Parse headers for announcements page only
      if (slug === 'announcements') {
        const headers = docsMap[slug]
          .split('\n')
          .filter(line => line.startsWith('## '))
          .map(line => {
            const text = line.replace('## ', '').trim();
            // Simple extraction of Year and Date parts assuming format "YYYY年M月D日"
            // We can just take the first 4 chars as year
            const year = text.substring(0, 4);
            // The rest is the date part, e.g., "2月10日"
            const date = text.substring(5);
            
            return {
              id: text.toLowerCase().replace(/\s+/g, '-'),
              text,
              year,
              date
            };
          });
        setToc(headers);
      } else {
        setToc([]);
      }
    } else {
      setContent('# 404 Not Found\nRequested document does not exist.');
      setToc([]);
    }
  }, [slug]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height + padding
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (slug === 'announcements' && toc.length > 0) {
    return (
      <div className="flex flex-col lg:flex-row animate-in fade-in duration-500">
        {/* Secondary Navigation for Announcements */}
        {/* Mobile: Standard relative layout */}
        <aside className="lg:hidden w-full mb-8">
          <div className="relative border-l border-border/50 ml-3 space-y-6 py-2">
            {toc.map((item, index) => (
              <div key={item.id} className="relative pl-4 group">
                {/* Timeline Dot */}
                <div 
                  className={cn(
                    "absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background transition-all duration-300",
                    index === 0 
                      ? "bg-primary scale-110 shadow-[0_0_0_4px_rgba(var(--primary),0.2)]" 
                      : "bg-muted-foreground/30 group-hover:bg-primary/70"
                  )}
                />
                <button onClick={() => scrollToSection(item.id)} className="text-left w-full">
                   <span className="text-xs font-bold font-mono text-primary mr-2">{item.year}</span>
                   <span className="text-sm font-medium">{item.date}</span>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Desktop: Fixed layout hugging the sidebar */}
        <aside className="hidden lg:block fixed left-[16rem] top-0 bottom-0 w-48 z-10 pointer-events-none">
          <div className="h-full w-full pl-6 pt-28 pointer-events-auto">
             <div className="relative h-full border-l border-border/50 ml-3">
                <div className="space-y-6 py-2">
                  {toc.map((item, index) => (
                    <div key={item.id} className="relative pl-4 group">
                       {/* Timeline Dot */}
                       <div 
                          className={cn(
                            "absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background transition-all duration-300",
                            index === 0 
                              ? "bg-primary scale-110 shadow-[0_0_0_4px_rgba(var(--primary),0.2)]" 
                              : "bg-muted-foreground/30 group-hover:bg-primary/70"
                          )}
                       />
                       
                       <button
                          onClick={() => scrollToSection(item.id)}
                          className="text-left w-full group-hover:translate-x-1 transition-transform duration-200"
                       >
                          <div className={cn(
                            "text-xs font-bold font-mono mb-0.5 transition-colors",
                            index === 0 ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )}>
                            {item.year}
                          </div>
                          <div className={cn(
                            "text-sm font-medium transition-colors",
                            index === 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}>
                             {item.date}
                          </div>
                       </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 lg:pl-16">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <MarkdownRenderer content={content} />
    </div>
  );
}