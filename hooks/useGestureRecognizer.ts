'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { haptics } from '@/lib/utils/haptics';

export interface GestureRecognizerOptions {
  // Swipe gestures
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  
  // Pinch gestures
  onPinchStart?: () => void;
  onPinch?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  
  // Long press
  onLongPress?: () => void;
  
  // Double tap
  onDoubleTap?: () => void;
  
  // Pull to refresh
  onPullToRefresh?: () => Promise<void>;
  
  // Configuration
  swipeThreshold?: number;
  longPressDuration?: number;
  doubleTapDelay?: number;
  minPinchScale?: number;
  maxPinchScale?: number;
  pullToRefreshThreshold?: number;
  enableHaptics?: boolean;
}

export interface GestureState {
  isSwiping: boolean;
  isPinching: boolean;
  isLongPressing: boolean;
  isPulling: boolean;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
  pinchScale: number;
  pullDistance: number;
}

/**
 * Unified Gesture Recognizer Hook
 * Handles swipe, pinch, long-press, double-tap, and pull-to-refresh gestures
 * Provides haptic feedback and conflict resolution
 */
export function useGestureRecognizer<T extends HTMLElement = HTMLElement>(
  options: GestureRecognizerOptions = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchStart,
    onPinch,
    onPinchEnd,
    onLongPress,
    onDoubleTap,
    onPullToRefresh,
    swipeThreshold = 50,
    longPressDuration = 500,
    doubleTapDelay = 300,
    minPinchScale = 0.5,
    maxPinchScale = 3,
    pullToRefreshThreshold = 80,
    enableHaptics = true,
  } = options;

  const ref = useRef<T>(null);
  const [state, setState] = useState<GestureState>({
    isSwiping: false,
    isPinching: false,
    isLongPressing: false,
    isPulling: false,
    swipeDirection: null,
    pinchScale: 1,
    pullDistance: 0,
  });

  // Touch tracking
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0, time: 0 });
  const lastTap = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const initialPinchDistance = useRef(0);
  const lastPinchScale = useRef(1);
  const isPullingRef = useRef(false);

  // Helper functions
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1: Touch, touch2: Touch) => ({
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    };

    // Check for double tap
    if (onDoubleTap && now - lastTap.current < doubleTapDelay) {
      onDoubleTap();
      if (enableHaptics) haptics.tap();
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setState(prev => ({ ...prev, isLongPressing: true }));
        onLongPress();
        if (enableHaptics) haptics.longPress();
      }, longPressDuration);
    }

    // Handle pinch start
    if (e.touches.length === 2) {
      clearTimeout(longPressTimer.current);
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      setState(prev => ({ ...prev, isPinching: true }));
      onPinchStart?.();
      if (enableHaptics) haptics.impactLight();
    }

    // Handle pull to refresh (only if scrolled to top)
    if (onPullToRefresh && e.touches.length === 1) {
      const element = ref.current;
      if (element && element.scrollTop === 0) {
        isPullingRef.current = true;
      }
    }
  }, [onDoubleTap, onLongPress, onPinchStart, onPullToRefresh, doubleTapDelay, longPressDuration, enableHaptics]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    clearTimeout(longPressTimer.current);

    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Handle pinch zoom
    if (e.touches.length === 2 && onPinch) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = Math.max(
        minPinchScale,
        Math.min(maxPinchScale, (currentDistance / initialPinchDistance.current) * lastPinchScale.current)
      );
      
      setState(prev => ({ ...prev, pinchScale: scale }));
      onPinch(scale);

      // Haptic feedback at limits
      if (enableHaptics && (scale <= minPinchScale || scale >= maxPinchScale)) {
        haptics.impactMedium();
      }
      return;
    }

    // Handle pull to refresh
    if (isPullingRef.current && e.touches.length === 1) {
      const deltaY = touchEnd.current.y - touchStart.current.y;
      if (deltaY > 0) {
        e.preventDefault();
        const pullDistance = Math.min(deltaY, pullToRefreshThreshold * 1.5);
        setState(prev => ({ ...prev, isPulling: true, pullDistance }));
      }
      return;
    }

    // Calculate swipe direction
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setState(prev => ({
        ...prev,
        isSwiping: true,
        swipeDirection: deltaX > 0 ? 'right' : 'left',
      }));
    } else {
      setState(prev => ({
        ...prev,
        isSwiping: true,
        swipeDirection: deltaY > 0 ? 'down' : 'up',
      }));
    }
  }, [onPinch, minPinchScale, maxPinchScale, pullToRefreshThreshold, enableHaptics]);

  const handleTouchEnd = useCallback(async (e: TouchEvent) => {
    clearTimeout(longPressTimer.current);

    // Handle pinch end
    if (e.touches.length < 2 && state.isPinching) {
      lastPinchScale.current = state.pinchScale;
      onPinchEnd?.(state.pinchScale);
      setState(prev => ({ ...prev, isPinching: false }));
    }

    // Handle pull to refresh
    if (isPullingRef.current && state.pullDistance >= pullToRefreshThreshold) {
      if (onPullToRefresh) {
        if (enableHaptics) haptics.success();
        await onPullToRefresh();
      }
    }
    isPullingRef.current = false;

    // Handle swipe
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Validate swipe (not too slow)
    if (deltaTime < 500) {
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontal && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        if (enableHaptics) haptics.swipe();
      } else if (!isHorizontal && Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
        if (enableHaptics) haptics.swipe();
      }
    }

    // Reset state
    setState({
      isSwiping: false,
      isPinching: false,
      isLongPressing: false,
      isPulling: false,
      swipeDirection: null,
      pinchScale: 1,
      pullDistance: 0,
    });
  }, [
    state,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchEnd,
    onPullToRefresh,
    swipeThreshold,
    pullToRefreshThreshold,
    enableHaptics,
  ]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(longPressTimer.current);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { ref, state };
}
