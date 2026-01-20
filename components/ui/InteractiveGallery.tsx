'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface InteractiveGalleryProps {
  images: string[];
  title: string;
  poster?: string;
}

import { getCaptionFromUrl } from '@/lib/utils/media';

export default function InteractiveGallery({ images, title, poster }: InteractiveGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => (prev + newDirection + images.length) % images.length);
  }, [images.length]);

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key.toLowerCase() === 'f') setIsFullscreen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] bg-black/95 p-4 sm:p-8 flex flex-col lg:flex-row gap-4'
          : 'flex flex-col lg:flex-row gap-4 h-[500px] w-full bg-black/20 rounded-xl p-4 border border-white/10 backdrop-blur-sm'
      }`}
    >
      
      {/* Main Viewer Area */}
      <div className="relative flex-1 h-full rounded-lg overflow-hidden bg-black/40 group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1
              },
              exit: (direction: number) => ({
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full"
          >
            {images[activeIndex].match(/\.(mp4|webm)(\?.*)?$/i) ? (
              <video
                src={images[activeIndex]}
                poster={(() => {
                  if (poster && activeIndex === 0) return poster;
                  // Look for the next available non-video image in the array to use as a poster
                  for (let i = 1; i < images.length; i++) {
                    const nextIdx = (activeIndex + i) % images.length;
                    if (!images[nextIdx].match(/\.(mp4|webm)(\?.*)?$/i)) {
                      return images[nextIdx];
                    }
                  }
                  return poster;
                })()}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={images[activeIndex]}
                alt={`${title} - Image ${activeIndex + 1}`}
                fill
                className="object-contain pointer-events-none"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Caption Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
          <p className="text-white text-lg font-medium text-center">
            {getCaptionFromUrl(images[activeIndex])}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-mono">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Toggle & Controls Hint */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
           <div className="hidden sm:flex px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/70 text-[10px] uppercase tracking-wider font-medium">
              {isFullscreen ? 'ESC to Exit' : 'F for Fullscreen'}
           </div>
           <button
             onClick={() => setIsFullscreen(!isFullscreen)}
             className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
             aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
           >
             {isFullscreen ? (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             ) : (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
               </svg>
             )}
           </button>
        </div>

        {/* Navigation Controls (Visible on Hover/Touch) */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          onClick={() => paginate(-1)}
        >
          ←
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          onClick={() => paginate(1)}
        >
          →
        </button>
      </div>

      {/* Vertical Thumbnail Column */}
      <div className={`hidden lg:flex flex-col gap-2 ${isFullscreen ? 'w-32' : 'w-24'} h-full overflow-y-auto pr-2 scrollbar-hide`}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > activeIndex ? 1 : -1);
              setActiveIndex(idx);
            }}
            className={`relative w-full aspect-square shrink-0 rounded-md overflow-hidden transition-all duration-300 ${
              activeIndex === idx 
                ? 'ring-2 ring-accent scale-100 opacity-100' 
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            {img.match(/\.(mp4|webm)(\?.*)?$/i) ? (
              <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
                {poster || (idx === 0 && images.length > 1) ? (
                   <Image 
                     src={poster || images[1]} 
                     alt="Video Poster" 
                     fill 
                     className="object-cover opacity-50"
                   />
                ) : null}
                <span className="text-white text-xs relative z-10">▶</span>
              </div>
            ) : (
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Thumbnail Row */}
      <div className="flex lg:hidden gap-2 h-16 w-full overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > activeIndex ? 1 : -1);
              setActiveIndex(idx);
            }}
            className={`relative h-full aspect-square shrink-0 rounded-md overflow-hidden transition-all ${
              activeIndex === idx ? 'ring-2 ring-accent opacity-100' : 'opacity-60'
            }`}
          >
            {img.match(/\.(mp4|webm)(\?.*)?$/i) ? (
              <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
                {poster || (idx === 0 && images.length > 1) ? (
                   <Image 
                     src={poster || images[1]} 
                     alt="Video Poster" 
                     fill 
                     className="object-cover opacity-50"
                   />
                ) : null}
                <span className="text-white text-[10px] relative z-10">▶</span>
              </div>
            ) : (
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
