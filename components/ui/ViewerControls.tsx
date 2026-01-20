'use client';

import { motion } from 'framer-motion';

interface ViewerControlsProps {
  onResetCamera: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showStats: boolean;
  onToggleStats: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function ViewerControls({
  onResetCamera,
  showGrid,
  onToggleGrid,
  showStats,
  onToggleStats,
  isPlaying,
  onTogglePlay,
}: ViewerControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass glass-border rounded-lg p-4"
    >
      <div className="flex items-center gap-4">
        {/* Play/Pause Rotation */}
        <button
          onClick={onTogglePlay}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            isPlaying
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'bg-white/10 text-foreground hover:bg-white/20'
          }`}
          title="Toggle Rotation (Space)"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-foreground transition-colors text-sm font-medium"
          title="Reset Camera (R)"
        >
          Reset
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Toggle Grid */}
        <button
          onClick={onToggleGrid}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            showGrid
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'bg-white/10 text-foreground hover:bg-white/20'
          }`}
          title="Toggle Grid (G)"
        >
          Grid {showGrid ? 'On' : 'Off'}
        </button>

        {/* Toggle Stats */}
        <button
          onClick={onToggleStats}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            showStats
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'bg-white/10 text-foreground hover:bg-white/20'
          }`}
          title="Toggle Stats (S)"
        >
          Stats {showStats ? 'On' : 'Off'}
        </button>


      </div>
    </motion.div>
  );
}
