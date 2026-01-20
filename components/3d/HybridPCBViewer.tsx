'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Box, Maximize2, Minimize2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ExplodedGallery from './ExplodedGallery';

// Lazy Load 3D Scene (Heavy)
const InteractiveScene = dynamic(() => import('./InteractiveScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/90">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-green-500 font-mono text-sm animate-pulse">Initializing WebGL Context...</p>
      </div>
    </div>
  ),
});

interface HybridPCBViewerProps {
  initialMode?: '2D_EXPLODED' | '3D_ASSEMBLED';
}

export default function HybridPCBViewer({ initialMode = '2D_EXPLODED' }: HybridPCBViewerProps) {
  const [mode, setMode] = useState<'2D_EXPLODED' | '3D_ASSEMBLED'>(initialMode);
  // We keep the 3D scene mounted once loaded to avoid re-initialization cost if user toggles back and forth
  const [hasLoaded3D, setHasLoaded3D] = useState(mode === '3D_ASSEMBLED');
  const [showTouchHints, setShowTouchHints] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and show touch hints
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
      if (mobile && mode === '3D_ASSEMBLED') {
        setShowTouchHints(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mode]);

  // Auto-fade touch hints after 3 seconds
  useEffect(() => {
    if (showTouchHints) {
      const timer = setTimeout(() => setShowTouchHints(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTouchHints]);

  // Hide hints on first interaction
  const handleFirstInteraction = () => {
    if (showTouchHints) setShowTouchHints(false);
  };

  const toggleMode = () => {
    const nextMode = mode === '2D_EXPLODED' ? '3D_ASSEMBLED' : '2D_EXPLODED';
    setMode(nextMode);
    if (nextMode === '3D_ASSEMBLED') {
      setHasLoaded3D(true);
      if (isMobile) setShowTouchHints(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      
      {/* View Toggle (Floating Island) */}
      <div className="absolute top-20 md:top-6 left-1/2 -translate-x-1/2 z-50 glass glass-border rounded-full p-1 flex items-center gap-1 shadow-2xl scale-90 md:scale-100">
        <button
          onClick={() => setMode('2D_EXPLODED')}
          className={`
            px-4 py-2 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2
            ${mode === '2D_EXPLODED' 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'}
          `}
        >
          <Layers className="w-4 h-4" />
          EXPLODED (2D)
        </button>
        <button
          onClick={() => {
            setMode('3D_ASSEMBLED');
            setHasLoaded3D(true);
            if (isMobile) setShowTouchHints(true);
          }}
          className={`
            px-4 py-2 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2
            ${mode === '3D_ASSEMBLED' 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'}
          `}
        >
          <Box className="w-4 h-4" />
          ASSEMBLED (3D)
        </button>
      </div>

      {/* Mobile Touch Hints Overlay */}
      <AnimatePresence>
        {showTouchHints && mode === '3D_ASSEMBLED' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 bg-black/70 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
              <span className="text-xs text-white/90 font-medium font-sans">1-Finger Rotate</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/90 font-medium font-sans">Hold + Drag Pan</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/90 font-medium font-sans">Pinch Zoom</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authenticity Badge */}
      <div className="absolute bottom-6 right-6 z-30 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-zinc-400 border border-white/5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="font-mono tracking-wider font-semibold">PHYSICALLY ACCURATE</span>
             </div>
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="relative w-full h-full"
        onTouchStart={handleFirstInteraction}
        onMouseDown={handleFirstInteraction}
      >
        
        {/* 2D Layer */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${mode === '2D_EXPLODED' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
        >
           <ExplodedGallery />
        </div>

        {/* 3D Layer (Optimized: Off-screen or Hidden but kept alive) */}
        {hasLoaded3D && (
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${mode === '3D_ASSEMBLED' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
          >
             {/* Aspect Ratio Container for CLS Prevention on Mobile */}
             <div className="w-full h-full md:aspect-auto aspect-[16/10]">
               {/* We pass specific props to InteractiveScene to ensure it acts as the "Assembled" view */}
               <InteractiveScene 
                 selectedModel={null}
                 onModelSelect={() => {}} 
                 showGrid={true}
                 showStats={false} // Cleaner for default
               />
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

