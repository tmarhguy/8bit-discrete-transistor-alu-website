'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[102] p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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
          className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x * velocity.x;
              const swipeConfidenceThreshold = 10000;
              if (swipe < -swipeConfidenceThreshold) {
                onNext?.();
              } else if (swipe > swipeConfidenceThreshold) {
                onPrevious?.();
              }
            }}
            style={{
              scale,
              x: position.x,
              y: position.y,
            }}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
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

        {/* Controls Info */}
        <div className="absolute top-4 left-4 z-[102] glass glass-border rounded-lg px-4 py-2">
          <p className="text-white text-xs">
            {images.length > 1 && `${currentIndex + 1} / ${images.length} • `}
            <span className="text-muted-foreground">
              ← → Navigate • +/- Zoom • ESC Close
            </span>
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-[102] flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(prev - 0.25, 0.5));
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white text-sm font-medium">{Math.round(scale * 100)}%</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(prev + 0.25, 3));
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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
