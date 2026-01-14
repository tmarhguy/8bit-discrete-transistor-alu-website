'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
}

export default function LottieAnimation({
  animationData,
  className = '',
  loop = true,
  autoplay = true,
  width,
  height,
}: LottieAnimationProps) {
  const style = useMemo(() => {
    return {
      width: width,
      height: height,
    };
  }, [width, height]);

  return (
    <div className={className} style={style}>
      <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse rounded-full" />}>
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          style={style}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
