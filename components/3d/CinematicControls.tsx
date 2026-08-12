import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicControlsProps {
  isVisible: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  isMobile?: boolean;
}

export default function CinematicControls({
  isVisible,
  isPlaying,
  onPlay,
  onStop,
  isMobile = false
}: CinematicControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-shrink on mobile after delay
  useEffect(() => {
    if (isVisible && isMobile && !isPlaying) {
      // Reset to expanded when first showing
      setIsExpanded(true);
      
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    } else if (!isMobile) {
      setIsExpanded(true);
    }
  }, [isVisible, isMobile, isPlaying]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-0 w-full flex justify-center pr-4 z-40 pointer-events-none"
        >
          <motion.button
            layout
            onClick={onPlay}
            initial={false}
            animate={{ 
              paddingLeft: isExpanded ? 24 : 8,
              paddingRight: isExpanded ? 24 : 8,
              paddingTop: 8,
              paddingBottom: 8,
              gap: isExpanded ? 12 : 0,
              backgroundColor: isExpanded ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
              borderColor: isExpanded ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.5)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-auto group flex items-center backdrop-blur-md border rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            // Expand on interaction if minimized
            onHoverStart={() => !isExpanded && setIsExpanded(true)}
            onTap={() => !isExpanded && setIsExpanded(true)}
          >
            <motion.div 
              layout="position"
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 group-hover:scale-110 transition-transform flex-shrink-0"
            >
              <Play size={14} className="text-amber-400 ml-0.5 fill-current" />
            </motion.div>
            
            <AnimatePresence mode="popLayout">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, width: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, width: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start whitespace-nowrap"
                >
                  <span className="text-sm font-bold text-amber-100 uppercase tracking-wider">Immersion</span>
                  <span className="text-[10px] text-amber-200/60 font-mono">360° Virtual Tour</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
