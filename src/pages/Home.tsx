import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden font-sans">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle showLabel={false} />
      </div>

      {/* Background Gradient Blob */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="z-10 text-center px-4 max-w-2xl animate-in fade-in zoom-in duration-700">
        <div className="mb-8 flex justify-center">
          <div className="bg-primary/5 p-6 rounded-3xl ring-1 ring-primary/10 shadow-sm backdrop-blur-sm">
             <img 
               src="http://husteread.com/wp-content/uploads/2026/01/1037-SOLO-右侧1.png" 
               alt="1037Solo Logo" 
               className="w-20 h-20 object-contain"
             />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500">
          1037Solo-Docs
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-light">
          你的高校生活 AI 领航员
          <br />
          聚合全网学术资源，让学习更简单，让探索更自由
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/docs/faq"
            className="group flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            开始阅读
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
             href="https://1037solo.com"
             className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium transition-all hover:bg-secondary/80 hover:scale-105 active:scale-95"
          >
            访问官网
          </a>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-muted-foreground/60">
        © 2026 1037Solo Team. Designed with ❤️.
      </footer>
    </div>
  );
}