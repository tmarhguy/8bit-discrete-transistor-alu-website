import { useEffect, useRef, useState } from 'react';

export interface PinchZoomOptions {
  onZoom?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export interface PinchZoomState {
  scale: number;
  isPinching: boolean;
}

/**
 * Custom hook for handling pinch-to-zoom gestures on touch devices
 * Essential for mobile image galleries and 3D model viewers
 * 
 * @param options - Configuration for pinch zoom behavior
 * @returns Ref to attach to the zoomable element and current zoom state
 */
export function usePinchZoom<T extends HTMLElement = HTMLElement>(
  options: PinchZoomOptions = {}
) {
  const {
    onZoom,
    minScale = 0.5,
    maxScale = 3,
    initialScale = 1,
  } = options;

  const ref = useRef<T>(null);
  const [state, setState] = useState<PinchZoomState>({
    scale: initialScale,
    isPinching: false,
  });

  const lastDistance = useRef<number>(0);
  const lastScale = useRef<number>(initialScale);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getDistance = (touch1: Touch, touch2: Touch): number => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastDistance.current = getDistance(e.touches[0], e.touches[1]);
        setState(prev => ({ ...prev, isPinching: true }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scaleDelta = currentDistance / lastDistance.current;
        const newScale = Math.max(
          minScale,
          Math.min(maxScale, lastScale.current * scaleDelta)
        );

        setState({
          scale: newScale,
          isPinching: true,
        });

        onZoom?.(newScale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastScale.current = state.scale;
        setState(prev => ({ ...prev, isPinching: false }));
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onZoom, minScale, maxScale, state.scale]);

  const reset = () => {
    setState({ scale: initialScale, isPinching: false });
    lastScale.current = initialScale;
  };

  return { ref, state, reset };
}
