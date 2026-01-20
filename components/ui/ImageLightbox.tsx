'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePinchZoom } from '@/hooks/usePinchZoom';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { haptics } from '@/lib/utils/haptics';

interface ImageLightboxProps {
  images: string[];
  types?: ('image' | 'video')[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  captions?: string[];
}

export default function ImageLightbox({
  images,
  types,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  captions,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Pinch-to-zoom support for mobile
  const { ref: pinchRef, state: pinchState, reset: resetPinch } = usePinchZoom({
    onZoom: (newScale) => {
      setScale(newScale);
      if (newScale === 0.5 || newScale === 3) {
        haptics.impactMedium(); // Haptic at zoom limits
      }
    },
    minScale: 0.5,
    maxScale: 3,
    initialScale: 1,
  });

  // Swipe gesture for navigation (only when not zoomed)
  const { ref: swipeRef } = useSwipeGesture({
    onSwipeLeft: () => {
      if (scale === 1) {
        haptics.selectionChange();
        onNext?.();
      }
    },
    onSwipeRight: () => {
      if (scale === 1) {
        haptics.selectionChange();
        onPrevious?.();
      }
    },
    onSwipeDown: () => {
      if (scale === 1) {
        haptics.tap();
        onClose();
      }
    },
    threshold: 50,
  });

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    resetPinch();
  }, [currentIndex, resetPinch]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious?.();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
        case '_':
          setScale(prev => Math.max(prev - 0.25, 0.5));
          break;
        case '0':
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const currentType = types?.[currentIndex] || 'image';
  const currentCaption = captions?.[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button - Larger touch target for mobile */}
        <button
          onClick={() => { haptics.tap(); onClose(); }}
          className="absolute top-4 right-4 z-[102] p-3 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        {onPrevious && images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 z-[102] p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {onNext && images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 z-[102] p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image/Video Container */}
        <div
          ref={(node) => {
            // Combine refs for both pinch and swipe
            if (node) {
              // @ts-ignore
              pinchRef.current = node;
              // @ts-ignore
              swipeRef.current = node;
            }
          }}
          className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pinch Zoom Hint for Mobile */}
          {scale === 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[102] sm:hidden pointer-events-none animate-pulse">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs text-white/60 font-medium">Pinch to zoom</span>
              </div>
            </div>
          )}

          <motion.div
            drag={scale > 1 ? true : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              if (scale === 1) {
                const swipe = offset.x * velocity.x;
                const swipeConfidenceThreshold = 10000;
                if (swipe < -swipeConfidenceThreshold) {
                  haptics.selectionChange();
                  onNext?.();
                } else if (swipe > swipeConfidenceThreshold) {
                  haptics.selectionChange();
                  onPrevious?.();
                }
              }
            }}
            style={{
              scale: pinchState.isPinching ? pinchState.scale : scale,
              x: position.x,
              y: position.y,
            }}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          >
            {currentType === 'video' ? (
              <video
                src={currentImage}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain pointer-events-none"
                playsInline
              />
            ) : (
              <Image
                src={currentImage}
                alt={currentCaption || `Image ${currentIndex + 1}`}
                width={1920}
                height={1080}
                className="max-w-full max-h-full object-contain pointer-events-none"
                priority
              />
            )}
          </motion.div>
        </div>

        {/* Caption */}
        {currentCaption && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[102] max-w-2xl px-6 py-3 bg-black/80 rounded-lg">
            <p className="text-white text-center text-sm">{currentCaption}</p>
          </div>
        )}

        {/* Controls Info - Desktop only */}
        <div className="absolute top-4 left-4 z-[102] glass glass-border rounded-lg px-4 py-2 hidden sm:block">
          <p className="text-white text-xs">
            {images.length > 1 && `${currentIndex + 1} / ${images.length} • `}
            <span className="text-muted-foreground">
              ← → Navigate • +/- Zoom • ESC Close
            </span>
          </p>
        </div>

        {/* Mobile Controls Info */}
        <div className="absolute top-4 left-4 z-[102] glass glass-border rounded-lg px-3 py-1.5 sm:hidden">
          <p className="text-white text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        {/* Zoom Controls - Optimized touch targets */}
        <div className="absolute bottom-4 right-4 z-[102] flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.tap();
              const newScale = Math.max(scale - 0.25, 0.5);
              setScale(newScale);
              if (newScale === 0.5) haptics.impactMedium();
            }}
            className="p-3 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.tap();
              setScale(1);
              setPosition({ x: 0, y: 0 });
              resetPinch();
            }}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors min-h-[48px] flex items-center justify-center"
          >
            <span className="text-white text-sm font-medium">{Math.round((pinchState.isPinching ? pinchState.scale : scale) * 100)}%</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.tap();
              const newScale = Math.min(scale + 0.25, 3);
              setScale(newScale);
              if (newScale === 3) haptics.impactMedium();
            }}
            className="p-3 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
