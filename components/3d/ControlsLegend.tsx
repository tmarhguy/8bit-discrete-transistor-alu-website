'use client';

import { Html } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { Info, X, Mouse, Hand, Move, ScanSearch, Rotate3d, Command } from 'lucide-react';

export default function ControlsLegend() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
      // Auto-collapse on mobile initially to save space
      if (mobile) setIsOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Html 
      position={[-100, -100, 0]} 
      calculatePosition={() => [20, window.innerHeight - 20]} 
      style={{ pointerEvents: 'none', width: '100vw', height: '100vh' }}
      zIndexRange={[100, 0]}
    >
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-black/60 transition-all shadow-lg hover:shadow-xl hover:border-white/20"
          >
            <Info size={16} />
            <span className="text-xs font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all whitespace-nowrap">
              Controls
            </span>
          </button>
        ) : (
          <div className="relative overflow-hidden bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Command size={14} className="text-zinc-400" />
                <span className="text-xs font-bold text-zinc-100 tracking-wide">CONTROLS</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 min-w-[240px]">
              {isMobile ? (
                // Mobile Controls
                <div className="space-y-3">
                  <ControlItem 
                    icon={<Hand size={14} />} 
                    label="Rotate" 
                    value="1 Finger Drag" 
                  />
                  <ControlItem 
                    icon={<Move size={14} />} 
                    label="Pan" 
                    value="Hold + Drag" 
                  />
                  <ControlItem 
                    icon={<ScanSearch size={14} />} 
                    label="Zoom" 
                    value="Pinch" 
                  />
                  <div className="h-px bg-white/10 my-2" />
                  <ControlItem 
                    label="Auto-Rotate" 
                    value="2-Finger Tap" 
                    compact 
                  />
                  <ControlItem 
                    label="Reset View" 
                    value="Triple Tap" 
                    compact 
                  />
                </div>
              ) : (
                // Desktop Controls
                <div className="space-y-3">
                  <ControlItem 
                    icon={<Mouse size={14} />} 
                    label="Rotate" 
                    value="Left Click" 
                  />
                  <ControlItem 
                    icon={<Move size={14} />} 
                    label="Pan" 
                    value="Right Click" 
                  />
                  <ControlItem 
                    icon={<ScanSearch size={14} />} 
                    label="Zoom" 
                    value="Scroll" 
                  />
                  <div className="h-px bg-white/10 my-2" />
                  <div className="grid grid-cols-2 gap-2">
                     <KeyShortcut keyLabel="1" description="Top" />
                     <KeyShortcut keyLabel="2" description="Iso" />
                     <KeyShortcut keyLabel="3" description="Side" />
                     <KeyShortcut keyLabel="SPACE" description="Auto-Spin" />
                     <KeyShortcut keyLabel="F" description="Reset" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}

// Helper Components
function ControlItem({ icon, label, value, compact = false }: { icon?: React.ReactNode, label: string, value: string, compact?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      <div className="flex items-center gap-2 text-zinc-400">
        {icon && <span className="opacity-70">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-mono font-medium ${compact ? 'text-zinc-500' : 'text-zinc-200'}`}>
        {value}
      </span>
    </div>
  );
}

function KeyShortcut({ keyLabel, description }: { keyLabel: string, description: string }) {
  return (
    <div className="flex items-center gap-2">
      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono font-bold text-zinc-300 min-w-[20px] text-center">
        {keyLabel}
      </kbd>
      <span className="text-[10px] text-zinc-500 font-medium">{description}</span>
    </div>
  );
}
