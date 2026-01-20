'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface LazyRenderProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string | number;
  className?: string;
}

export default function LazyRender({
  children,
  threshold = 0,
  rootMargin = '200px', // Load 200px before it comes into view
  minHeight = 'min-h-[50vh]', // Default placeholder height to prevent layout shift
  className = '',
}: LazyRenderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    // Fallback timer: Force render after 4s in case IntersectionObserver fails
    // or if the user scrolls very fast and the browser misses the event.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [isVisible, threshold, rootMargin]);

  if (!isVisible) {
    return <div ref={ref} className={`${minHeight} ${className}`} />;
  }

  return <>{children}</>;
}
