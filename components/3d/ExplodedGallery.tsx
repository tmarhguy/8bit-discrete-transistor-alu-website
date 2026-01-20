'use client';

import { models, ModelConfig } from '@/lib/data/models';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Minus, 
  Plus, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  X, 
  Maximize2,
  Info
} from 'lucide-react';

export default function ExplodedGallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedModel = models.find(m => m.name === selectedId);

  return (
    <div className="w-full h-full relative bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* HEADER / INTRO */}
      <div className="absolute top-0 left-0 right-0 p-8 z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Component Gallery</h2>
          <p className="text-zinc-400 max-w-xl text-sm">
            Explore the discrete components that power the 8-bit architecture. 
            Select any module to inspect its layout and specifications in detail.
          </p>
        </motion.div>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {models.map((model) => (
            <Card 
              key={model.name} 
              model={model} 
              isSelected={selectedId === model.name}
              onClick={() => setSelectedId(model.name)}
            />
          ))}
        </motion.div>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {selectedId && selectedModel && (
          <Modal 
            model={selectedModel} 
            onClose={() => setSelectedId(null)}
            onNext={() => {
              const currentIndex = models.findIndex(m => m.name === selectedId);
              const nextIndex = (currentIndex + 1) % models.length;
              setSelectedId(models[nextIndex].name);
            }}
            onPrev={() => {
              const currentIndex = models.findIndex(m => m.name === selectedId);
              const prevIndex = (currentIndex - 1 + models.length) % models.length;
              setSelectedId(models[prevIndex].name);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENTS
// ------------------------------------------------------------------

function Card({ model, isSelected, onClick }: { model: ModelConfig, isSelected: boolean, onClick: () => void }) {
  return (
    <motion.div
      layoutId={`card-${model.name}`}
      onClick={onClick}
      className={`
        relative aspect-[4/3] rounded-2xl cursor-pointer group
        bg-white/[0.02] border border-white/5 hover:border-amber-500/30
        hover:bg-amber-500/[0.02] transition-colors overflow-hidden
      `}
      whileHover={{ y: -5 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
      
      <div className="absolute inset-0 p-6 flex items-center justify-center">
        <motion.img 
          layoutId={`image-${model.name}`}
          src={model.imagePath} 
          alt={model.name}
          className="w-full h-full object-contain filter drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <motion.h3 
          layoutId={`title-${model.name}`}
          className="text-sm font-bold text-zinc-200 truncate font-mono"
        >
          {model.name}
        </motion.h3>
      </div>
    </motion.div>
  );
}

function Modal({ model, onClose, onNext, onPrev }: { 
  model: ModelConfig, 
  onClose: () => void,
  onNext: () => void,
  onPrev: () => void
}) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom when model changes
  useEffect(() => {
    setZoom(1);
  }, [model]);

  // Zoom Controls
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.max(0.5, Math.min(3, z + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${model.name}`}
        className="w-full max-w-5xl h-[90vh] md:h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full border border-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* LEFT: INTERACTIVE IMAGE AREA */}
        <div 
          className="relative flex-1 h-1/2 md:h-full bg-grid-pattern overflow-hidden cursor-grab active:cursor-grabbing border-b md:border-b-0 md:border-r border-white/10"
          onWheel={handleWheel}
          ref={containerRef}
        >
           {/* Custom Grid Background for technical feel */}
           <div className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                  backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
                  backgroundSize: '20px 20px' 
                }} 
           />

           <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-md border border-white/10 text-xs text-zinc-400 font-mono">
                ZM: {(zoom * 100).toFixed(0)}%
              </div>
           </div>

           <motion.div
             drag="x"
             dragConstraints={{ left: 0, right: 0 }}
             dragElastic={0.2}
             onDragEnd={(e, { offset, velocity }) => {
               const swipe = offset.x * velocity.x;
               const swipeConfidenceThreshold = 10000;
               if (swipe < -swipeConfidenceThreshold) {
                 onNext();
               } else if (swipe > swipeConfidenceThreshold) {
                 onPrev();
               }
             }}
             className="w-full h-full flex items-center justify-center p-12 cursor-grab active:cursor-grabbing"
             style={{ scale: zoom }}
           >
             <motion.img 
               layoutId={`image-${model.name}`}
               src={model.imagePath} 
               alt={model.name}
               className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none"
               draggable={false}
             />
           </motion.div>

           {/* ZOOM HUD */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 z-30">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                className="hover:text-amber-400 transition-colors"
              >
                <Minus size={16} />
              </button>
              <div className="w-px h-3 bg-white/20" />
              <button 
                onClick={() => setZoom(1)}
                className="hover:text-amber-400 transition-colors"
              >
                <RefreshCw size={14} />
              </button>
              <div className="w-px h-3 bg-white/20" />
              <button 
                onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                className="hover:text-amber-400 transition-colors"
              >
                <Plus size={16} />
              </button>
           </div>
        </div>

        {/* RIGHT: DETAILS PANEL */}
        <div className="w-full md:w-[350px] bg-[#0F0F0F] p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="mb-4 md:mb-6">
            <motion.h3 
              layoutId={`title-${model.name}`}
              className="text-xl md:text-2xl font-bold text-white font-mono mb-2"
            >
              {model.name}
            </motion.h3>
            <div className="h-1 w-20 bg-amber-500 rounded-full" />
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">
                <Info size={14} /> Description
              </h4>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {model.description}
              </p>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
               <h4 className="text-xs font-bold text-amber-500 mb-2 uppercase">Technical Specs</h4>
               <ul className="text-xs text-amber-200/70 space-y-1 font-mono">
                 <li>• 8-Bit Data Width</li>
                 <li>• TTL Compatible</li>
                 <li>• Modular PCB Design</li>
               </ul>
            </div>
          </div>

          <div className="mt-6 md:mt-auto pt-4 md:pt-8 pb-4 md:pb-0">
            <button 
              onClick={onClose}
              className="w-full py-2.5 md:py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Close Viewer
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
