'use client';

import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface CinematicOverlayProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentSceneId: string;
  onSkip?: () => void;
}

// Scene display names
const SCENE_NAMES: Record<string, string> = {
  'scene1_zoom_in': 'Opening Shot',
  'scene2_immersive_sweep': 'Board Exploration',
  'scene3_horizontal_spin': '360° Showcase',
  'scene4_zoom_out_45': 'Isometric View',
  'scene5_slow_detail_zoom': 'Component Focus',
  'scene6_reset_out': 'Final Overview',
};

export default function CinematicOverlay({ 
  isPlaying, 
  progress, 
  currentSceneId,
  onSkip 
}: CinematicOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSceneTitle, setShowSceneTitle] = useState(false);
  const [lastSceneId, setLastSceneId] = useState('');

  // Fade in overlay when playback starts
  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
    } else {
      // Fade out
      const timeout = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying]);

  // Show scene title on scene change
  useEffect(() => {
    if (currentSceneId && currentSceneId !== lastSceneId) {
      setShowSceneTitle(true);
      setLastSceneId(currentSceneId);
      
      // Hide after 2 seconds
      const timeout = setTimeout(() => setShowSceneTitle(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentSceneId, lastSceneId]);

  if (!isVisible) return null;

  const sceneName = SCENE_NAMES[currentSceneId] || '';
  const progressPercent = Math.round(progress * 100);

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
      <div 
        className={`fixed inset-0 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: isPlaying ? 'auto' : 'none' }}
      >
        {/* Letterbox Bars (Top & Bottom) */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-sm transition-all duration-700 ease-out" 
             style={{ transform: isPlaying ? 'translateY(0)' : 'translateY(-100%)' }}>
          {/* Top Bar Content */}
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white/70 text-xs font-mono uppercase tracking-wider">Cinematic Mode</span>
            </div>
            
            {/* Scene Title (Fade in/out) */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${showSceneTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
              <span className="text-white text-sm font-medium tracking-wide">{sceneName}</span>
            </div>
            
            <button 
              onClick={onSkip}
              className="text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors pointer-events-auto cursor-pointer"
            >
              Press ESC to Skip
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-sm transition-all duration-700 ease-out"
             style={{ transform: isPlaying ? 'translateY(0)' : 'translateY(100%)' }}>
          {/* Bottom Bar Content */}
          <div className="flex flex-col justify-center h-full px-6">
            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Glow effect */}
              <div 
                className="absolute top-0 h-full w-8 bg-white/30 blur-sm"
                style={{ 
                  left: `${progressPercent}%`,
                  transform: 'translateX(-50%)',
                  opacity: progressPercent > 0 ? 1 : 0
                }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex items-center justify-between text-white/50 text-xs font-mono">
              <span>{progressPercent}%</span>
              <span className="text-white/30">|</span>
              <span>{currentSceneId.replace('scene', 'Scene ').replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Vignette Effect */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
            opacity: isPlaying ? 0.6 : 0
          }}
        />

        {/* Corner Accents */}
        <div className={`absolute top-20 left-6 w-8 h-8 border-l-2 border-t-2 border-amber-500/30 transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-20 right-6 w-8 h-8 border-r-2 border-t-2 border-amber-500/30 transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-24 left-6 w-8 h-8 border-l-2 border-b-2 border-amber-500/30 transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-24 right-6 w-8 h-8 border-r-2 border-b-2 border-amber-500/30 transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </Html>
  );
}
