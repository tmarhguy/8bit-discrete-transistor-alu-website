'use client';

import { useState, Suspense } from 'react';
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

  const toggleMode = () => {
    const nextMode = mode === '2D_EXPLODED' ? '3D_ASSEMBLED' : '2D_EXPLODED';
    setMode(nextMode);
    if (nextMode === '3D_ASSEMBLED') setHasLoaded3D(true);
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

      {/* Content Area */}
      <div className="relative w-full h-full">
        
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
             {/* We pass specific props to InteractiveScene to ensure it acts as the "Assembled" view */}
             {/* Note: In the future, we can pass isExploded={false} explicitly if we add that prop */}
             <InteractiveScene 
               selectedModel={null}
               onModelSelect={() => {}} 
               showGrid={true}
               showStats={false} // Cleaner for default
             />
          </div>
        )}

      </div>
    </div>
  );
}
