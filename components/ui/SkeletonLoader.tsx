'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'image' | 'card' | 'avatar' | 'button';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

/**
 * Skeleton Loader Component
 * Provides loading placeholders for better perceived performance on mobile
 */
export default function SkeletonLoader({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  count = 1,
}: SkeletonLoaderProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'image':
        return 'aspect-video rounded-lg';
      case 'card':
        return 'h-48 rounded-xl';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'button':
        return 'h-12 rounded-full';
      default:
        return 'h-4 rounded';
    }
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={`bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer ${getVariantStyles()} ${className}`}
      style={{
        width: width,
        height: height,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
    />
  ));

  return count > 1 ? (
    <div className="space-y-3">{skeletons}</div>
  ) : (
    <>{skeletons}</>
  );
}

// Preset skeleton components for common use cases
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLoader
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function ImageSkeleton({ aspectRatio = 'video' }: { aspectRatio?: 'video' | 'square' | 'portrait' }) {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  return (
    <div className={`w-full ${aspectClass} bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer rounded-lg`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass glass-border rounded-xl p-6 space-y-4">
      <SkeletonLoader variant="image" height="200px" />
      <SkeletonLoader variant="text" width="80%" />
      <TextSkeleton lines={2} />
      <SkeletonLoader variant="button" width="120px" />
    </div>
  );
}

export function GallerySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
