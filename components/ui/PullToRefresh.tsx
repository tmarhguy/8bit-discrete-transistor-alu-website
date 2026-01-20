'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

/**
 * Pull to Refresh Component
 * Native mobile pattern for refreshing content
 */
export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    if (scrollTop === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || touchStart === 0) return;

    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;

    if (distance > 0) {
      // Elastic resistance
      const elasticDistance = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(elasticDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    setTouchStart(0);
  };

  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return (
    <div
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className=\"absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4\"
            style={{ transform: `translateY(${pullDistance}px)` }}
          >
            <div className=\"flex flex-col items-center gap-2\">
              {/* Spinner or Icon */}
              {isRefreshing ? (
                <div className=\"w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin\" />
              ) : (
                <motion.svg
                  className=\"w-6 h-6 text-[#D4AF37]\"
                  fill=\"none\"
                  stroke=\"currentColor\"
                  viewBox=\"0 0 24 24\"
                  animate={{ rotate: progress >= 100 ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap=\"round\"
                    strokeLinejoin=\"round\"
                    strokeWidth={2}
                    d=\"M19 14l-7 7m0 0l-7-7m7 7V3\"
                  />
                </motion.svg>
              )}
              
              {/* Progress Text */}
              <p className=\"text-xs text-white/60 font-medium\">
                {isRefreshing
                  ? 'Refreshing...'
                  : progress >= 100
                  ? 'Release to refresh'
                  : 'Pull to refresh'}
              </p>

              {/* Progress Bar */}
              <div className=\"w-16 h-1 bg-white/10 rounded-full overflow-hidden\">
                <motion.div
                  className=\"h-full bg-[#D4AF37]\"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div
        className=\"transition-transform duration-200\"
        style={{
          transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
