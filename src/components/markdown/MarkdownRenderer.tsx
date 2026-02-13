import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { ImageModal } from '@/components/ui/image-modal';
import { 
  Mail, Users, Bug, Lightbulb, 
  HelpCircle, BookOpen, Zap, History, Bell, FileText
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Map keywords to Lucide icons
const getIconForHeader = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('联系')) return <Mail className="w-6 h-6 mr-2 text-primary inline-block align-text-bottom" />;
  if (t.includes('社群')) return <Users className="w-6 h-6 mr-2 text-primary inline-block align-text-bottom" />;
  if (t.includes('bug') || t.includes('报告')) return <Bug className="w-6 h-6 mr-2 text-destructive inline-block align-text-bottom" />;
  if (t.includes('建议')) return <Lightbulb className="w-6 h-6 mr-2 text-yellow-500 inline-block align-text-bottom" />;
  if (t.includes('常见问题') || t.includes('faq')) return <HelpCircle className="w-6 h-6 mr-2 text-primary inline-block align-text-bottom" />;
  if (t.includes('攻略') || t.includes('指南')) return <BookOpen className="w-6 h-6 mr-2 text-primary inline-block align-text-bottom" />;
  if (t.includes('功能')) return <Zap className="w-6 h-6 mr-2 text-yellow-500 inline-block align-text-bottom" />;
  if (t.includes('日志') || t.includes('更新')) return <History className="w-6 h-6 mr-2 text-primary inline-block align-text-bottom" />;
  if (t.includes('公告')) return <Bell className="w-6 h-6 mr-2 text-red-500 inline-block align-text-bottom" />;
  return null;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-semibold prose-headings:tracking-tight 
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:leading-relaxed prose-p:text-muted-foreground
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0
      prose-img:rounded-lg prose-img:shadow-md
      prose-headings:scroll-m-20
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={{
          // Auto-inject icons for H2 headers
          h2({ node, children, ...props }: any) {
             const text = String(children);
             const icon = getIconForHeader(text);
             return (
               <h2 {...props} className="flex items-center">
                 {icon}
                 {children}
               </h2>
             );
          },
          // Override 'a' tag to detect image links and use ImageModal
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
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative rounded-lg overflow-hidden border my-6 shadow-sm">
                 <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                    <span className="text-xs font-medium text-muted-foreground">{match[1]}</span>
                 </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0 }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={cn("font-mono text-sm", className)} {...props}>
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