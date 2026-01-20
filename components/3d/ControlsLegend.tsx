'use client';

import { Html } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function ControlsLegend() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Html 
      position={[-100, -100, 0]} 
      calculatePosition={() => [20, window.innerHeight - 20]} 
      style={{ pointerEvents: 'none' }}
    >
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        {!isOpen && isMobile ? (
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-zinc-400 hover:text-white transition-colors shadow-2xl"
          >
            <Info size={20} />
          </button>
        ) : (
          <div className="text-[10px] md:text-xs font-mono text-zinc-500 bg-black/80 backdrop-blur-md p-3 md:p-4 rounded-lg border border-white/10 shadow-2xl select-none relative max-w-[200px] md:max-w-none">
            {isMobile && (
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute -top-2 -right-2 p-1 bg-zinc-800 text-white rounded-full border border-white/10"
              >
                <X size={12} />
              </button>
            )}
            <div className="mb-2 text-zinc-300 font-bold border-b border-white/10 pb-1">CONTROLS</div>
            <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-1">
              <span>Rotate</span> <span className="text-zinc-300">LMB / Arrows</span>
              <span>Pan</span> <span className="text-zinc-300">RMB / Shift+Drag</span>
              <span>Zoom</span> <span className="text-zinc-300">Scroll / +/-</span>
              <div className="h-px bg-white/10 col-span-2 my-1"></div>
              <span>Top View</span> <span className="text-white bg-zinc-800 px-1 rounded">1</span>
              <span>Iso View</span> <span className="text-white bg-zinc-800 px-1 rounded">2</span>
              <span>Side View</span> <span className="text-white bg-zinc-800 px-1 rounded">3</span>
              <span>Reset</span> <span className="text-white bg-zinc-800 px-1 rounded">F</span>
              <span>Auto-Spin</span> <span className="text-white bg-zinc-800 px-1 rounded">R</span>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}
