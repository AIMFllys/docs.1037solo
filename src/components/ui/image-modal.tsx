import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageModalProps {
  src: string;
  alt?: string;
  children: React.ReactNode;
  className?: string;
}

export function ImageModal({ src, alt, children, className }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <span 
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={cn(
          "cursor-pointer inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4 transition-colors group",
          className
        )}
      >
        <ImageIcon className="w-4 h-4" />
        {children}
      </span>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative bg-card border shadow-2xl rounded-3xl overflow-hidden max-w-lg w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
                  <h3 className="font-semibold text-sm truncate pr-4">
                    {alt || 'Image Preview'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <a 
                      href={src} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                      title="Open original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Container */}
                <div className="p-6 flex items-center justify-center bg-muted/10 min-h-[300px]">
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[70vh] rounded-lg shadow-sm object-contain"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
