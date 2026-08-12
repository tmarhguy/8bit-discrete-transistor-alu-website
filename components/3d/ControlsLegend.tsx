'use client';


import { useState, useEffect } from 'react';
import { Info, X, Mouse, Hand, Move, ScanSearch, Rotate3d, Command } from 'lucide-react';

export default function ControlsLegend() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
      // Auto-collapse on mobile after a delay to show controls first
      if (mobile) {
        setTimeout(() => setIsOpen(true));
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;

  return (
    <div className="absolute bottom-6 left-6 z-50 pointer-events-auto">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-amber-500/20 text-amber-100/90 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:bg-black/80 hover:border-amber-500/40 hover:text-white transition-all"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse"></div>
          <span className="text-[10px] font-mono font-semibold tracking-wider drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
            CONTROLS
          </span>
        </button>
      ) : (
        <div className="relative overflow-hidden bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse"></div>
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
                  label="Orbit" 
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
                  label="Auto-Spin" 
                  value="2-Finger Tap" 
                  compact 
                />
                <ControlItem 
                  label="Reset View" 
                  value="3 Taps" 
                  compact 
                />
                <ControlItem 
                  label="Start Tour" 
                  value="4 Taps" 
                  compact 
                  highlight
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
                   <KeyShortcut keyLabel="SPACE" description="Auto-Spin" />
                   <KeyShortcut keyLabel="I" description="Immersive" highlight />
                   <KeyShortcut keyLabel="1" description="Top" />
                   <KeyShortcut keyLabel="2" description="Iso" />
                   <KeyShortcut keyLabel="3" description="Side" />
                   <KeyShortcut keyLabel="R" description="Reset" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function ControlItem({ icon, label, value, compact = false, highlight = false }: { icon?: React.ReactNode, label: string, value: string, compact?: boolean, highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      <div className={`flex items-center gap-2 ${highlight ? 'text-amber-400' : 'text-zinc-400'}`}>
        {icon && <span className="opacity-70">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-mono font-medium ${highlight ? 'text-amber-400' : (compact ? 'text-zinc-500' : 'text-zinc-200')}`}>
        {value}
      </span>
    </div>
  );
}

function KeyShortcut({ keyLabel, description, highlight = false }: { keyLabel: string, description: string, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <kbd className={`px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono font-bold min-w-[20px] text-center ${highlight ? 'text-amber-400 border border-amber-500/30 bg-amber-500/10' : 'text-zinc-300'}`}>
        {keyLabel}
      </kbd>
      <span className={`text-[10px] font-medium ${highlight ? 'text-amber-400' : 'text-zinc-500'}`}>{description}</span>
    </div>
  );
}
