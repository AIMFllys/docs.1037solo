import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { ImageModal } from '@/components/ui/image-modal';
import React from 'react';
import {
  Mail, Users, Bug, Lightbulb,
  HelpCircle, BookOpen, Zap, History, Bell, FileText
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const getIconForHeader = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('联系')) return <Mail className="w-5 h-5 mr-2 text-primary/80 inline-block align-text-bottom" />;
  if (t.includes('社群') || t.includes('社区')) return <Users className="w-5 h-5 mr-2 text-primary/80 inline-block align-text-bottom" />;
  if (t.includes('bug') || t.includes('报告')) return <Bug className="w-5 h-5 mr-2 text-destructive/80 inline-block align-text-bottom" />;
  if (t.includes('建议')) return <Lightbulb className="w-5 h-5 mr-2 text-yellow-500/80 inline-block align-text-bottom" />;
  if (t.includes('常见问题') || t.includes('faq') || t.includes('说明')) return <HelpCircle className="w-5 h-5 mr-2 text-primary/80 inline-block align-text-bottom" />;
  if (t.includes('概览') || t.includes('指南') || t.includes('前言')) return <BookOpen className="w-5 h-5 mr-2 text-primary/80 inline-block align-text-bottom" />;
  if (t.includes('功能') || t.includes('模块') || t.includes('特色')) return <Zap className="w-5 h-5 mr-2 text-yellow-500/80 inline-block align-text-bottom" />;
  if (t.includes('日志') || t.includes('更新') || t.includes('版本')) return <History className="w-5 h-5 mr-2 text-primary/80 inline-block align-text-bottom" />;
  if (t.includes('公告') || t.includes('注意')) return <Bell className="w-5 h-5 mr-2 text-red-500/80 inline-block align-text-bottom" />;
  return null;
};

// Custom slugify utility matching the one in DocPage.tsx
const slugifyText = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '');
};

const idCounts: Record<string, number> = {};
const generateUniqueId = (text: string) => {
  let baseId = slugifyText(text);
  if (!baseId) baseId = 'section';
  if (idCounts[baseId]) {
    const finalId = `${baseId}-${idCounts[baseId]}`;
    idCounts[baseId]++;
    return finalId;
  }
  idCounts[baseId] = 1;
  return baseId;
};

// Reset ID counts on every render to ensure consistent SSR/CSR IDs
let renderCycle = 0;

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Clear counts on render
  renderCycle++;
  Object.keys(idCounts).forEach(k => delete idCounts[k]);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-bold prose-headings:tracking-tight 
      prose-h1:text-4xl prose-h1:mb-8 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:bg-gradient-to-r prose-h1:from-foreground prose-h1:to-foreground/70
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-5
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-code:text-primary prose-code:bg-primary/10 prose-code:font-mono prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0
      prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-border/30
      prose-headings:scroll-m-28
      prose-hr:border-border/60 prose-hr:my-10
      prose-li:text-muted-foreground prose-li:-mt-2 prose-li:mb-2
      prose-table:w-full prose-table:table-auto prose-table:my-8 prose-table:border-collapse prose-table:text-sm
      prose-th:bg-muted/50 prose-th:font-semibold prose-th:text-foreground prose-th:p-3 prose-th:border prose-th:border-border/70 prose-th:text-left
      prose-td:p-3 prose-td:border prose-td:border-border/40 prose-td:align-middle prose-td:text-muted-foreground
    ">
      <ReactMarkdown
        key={`md-render-${renderCycle}`}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
        components={{
          h2({ node, children, ...props }: any) {
            const textContent = React.Children.toArray(children).join('').replace(/[*_~`]/g, '');
            const id = generateUniqueId(textContent);
            const icon = getIconForHeader(textContent);
            return (
              <h2 id={id} {...props} className="flex items-center group relative">
                {icon}
                {children}
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground/50 hover:text-primary absolute -left-6">
                  #
                </a>
              </h2>
            );
          },
          h3({ node, children, ...props }: any) {
            const textContent = React.Children.toArray(children).join('').replace(/[*_~`]/g, '');
            const id = generateUniqueId(textContent);
            return (
              <h3 id={id} {...props} className="flex items-center group relative">
                {children}
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground/50 hover:text-primary absolute -left-5 text-base">
                  #
                </a>
              </h3>
            );
          },
          h4({ node, children, ...props }: any) {
            const textContent = React.Children.toArray(children).join('').replace(/[*_~`]/g, '');
            const id = generateUniqueId(textContent);
            return <h4 id={id} {...props}>{children}</h4>;
          },
          a({ node, href, children, ...props }: any) {
            const isImageLink = href?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
            const isQrCode = typeof children?.[0] === 'string' && children[0].includes('二维码');

            if (isImageLink || isQrCode) {
              return (
                <ImageModal src={href} alt={String(children)}>
                  {children}
                </ImageModal>
              );
            }

            return (
              <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          table({ node, children, ...props }: any) {
            return (
              <div className="w-full overflow-x-auto rounded-xl border border-border/50 shadow-sm bg-card/30 backdrop-blur-sm my-8 relative">
                <table className="!my-0 !border-0" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          blockquote({ node, children, ...props }: any) {
            return (
              <blockquote className="border-l-4 border-primary/60 bg-primary/5 pl-4 pr-4 py-3 rounded-r-lg italic text-muted-foreground my-6 relative overflow-hidden" {...props}>
                <div className="absolute top-0 left-0 w-8 h-8 bg-primary/10 rounded-br-full blur-md" />
                {children}
              </blockquote>
            );
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative rounded-xl overflow-hidden border my-6 shadow-md bg-[#1e1e1e]">
                <div className="flex items-center px-4 py-2 bg-black/40 border-b border-white/10 backdrop-blur-md">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-medium text-white/50 tracking-wider uppercase">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1rem', borderRadius: 0, background: 'transparent' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={cn("font-mono text-sm px-1.5 py-0.5 rounded-md bg-muted text-primary/80 whitespace-pre-wrap break-words", className)} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}