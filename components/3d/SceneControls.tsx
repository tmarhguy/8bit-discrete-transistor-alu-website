'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { haptics } from '@/lib/utils/haptics';

interface SceneControlsProps {
  autoRotate?: boolean;
  onAutoRotateChange?: (v: boolean) => void;
}

export default function SceneControls({ 
  autoRotate = false,
  onAutoRotateChange 
}: SceneControlsProps) {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { camera, gl, scene } = useThree();
  
  // Apple-like smooth animation config
  const SMOOTH_TIME = 0.8;
  const [isMobile, setIsMobile] = useState(false);

  // Touch gesture state for mobile
  const touchState = useRef({
    lastDistance: 0,
    lastAngle: 0,
    isPinching: false,
    isTwoFingerRotate: false,
    lastTap: 0,
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Refs for event handlers to access current state without re-binding
  const autoRotateRef = useRef(autoRotate);
  const onAutoRotateChangeRef = useRef(onAutoRotateChange);
  
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    onAutoRotateChangeRef.current = onAutoRotateChange;
  }, [onAutoRotateChange]);

  // Enhanced mobile touch gesture handlers
  const handleTouchGestures = useCallback(() => {
    const canvas = gl.domElement;
    
    // Internal state for gesture detection
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout | null = null;
    let longPressTimer: NodeJS.Timeout | null = null;
    let isLongPress = false;
    let touchStartX = 0;
    let touchStartY = 0;

    // Two-finger tap state
    let twoFingerTapStart = 0;
    let isTwoFingerTapCandidate = false;
    let touchStartPositions: { id: number, x: number, y: number }[] = [];
    
    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getAngle = (touch1: Touch, touch2: Touch) => {
      return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Stop auto-rotate on interaction
      if (autoRotateRef.current && onAutoRotateChangeRef.current) {
        onAutoRotateChangeRef.current(false);
      }

      // 1. Handle Taps (1 Finger)
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Long Press Detection Setup
        longPressTimer = setTimeout(() => {
          isLongPress = true;
          haptics.impactHeavy(); // Signal "Mode Change"
          if (cameraControlsRef.current) {
            // Disable rotation to allow panning without spinning
            cameraControlsRef.current.azimuthRotateSpeed = 0;
            cameraControlsRef.current.polarRotateSpeed = 0;
          }
        }, 500);

        // Tap Counting
        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);
        
        tapTimer = setTimeout(() => {
          // Action based on final count
          if (cameraControlsRef.current) {
             if (tapCount === 2) {
               // Double Tap: Smart Zoom In
               haptics.impactLight();
               cameraControlsRef.current.dolly(3, true);
             } else if (tapCount === 3) {
               // Triple Tap: Reset Camera
               haptics.success();
               cameraControlsRef.current.setLookAt(10, 15, 10, 0, 0, 0, true);
             }
          }
          tapCount = 0;
        }, 300); // 300ms window for multi-taps
      } else {
        // Cancel single-finger logic if multi-touch
        if (longPressTimer) clearTimeout(longPressTimer);
        if (tapTimer) clearTimeout(tapTimer);
        tapCount = 0;
        isLongPress = false;
      }
      
      // 2. Handle Multi-touch (Pinch/Rotate/Two-Finger Tap)
      if (e.touches.length === 2) {
        const distance = getDistance(e.touches[0], e.touches[1]);
        const angle = getAngle(e.touches[0], e.touches[1]);
        
        touchState.current.lastDistance = distance;
        touchState.current.lastAngle = angle;
        touchState.current.isPinching = true;
        touchState.current.isTwoFingerRotate = true;
        
        haptics.impactLight();

        // Two-Finger Tap Detection Start
        twoFingerTapStart = Date.now();
        isTwoFingerTapCandidate = true;
        touchStartPositions = Array.from(e.touches).map(t => ({
          id: t.identifier,
          x: t.clientX,
          y: t.clientY
        }));
      } else if (e.touches.length > 2) {
        isTwoFingerTapCandidate = false; // Cancel if 3 fingers
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 1. Long Press Pan Logic (1 Finger)
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        const moveDist = Math.sqrt(dx*dx + dy*dy);

        // Cancel Long Press if moved before timer fires
        if (moveDist > 10 && !isLongPress) {
          if (longPressTimer) clearTimeout(longPressTimer);
        }

        // If in Long Press (Pan) Mode, execute Pan manually
        if (isLongPress && cameraControlsRef.current) {
           e.preventDefault(); // Stop scrolling
           const sensitivity = 0.01 * (isMobile ? 0.5 : 1);
           // Truck (Pan) opposite to drag direction for natural feel
           const deltaX = (e.touches[0].clientX - touchStartX) * sensitivity; 
           const deltaY = (e.touches[0].clientY - touchStartY) * sensitivity;
           
           // We use trucking with immediate delta relative to last frame? 
           // Standard truck() takes distance. 
           // Better to use delta from *last move event*, not start.
           // Let's reset Start on every move for Delta calculation.
           const stepX = (e.touches[0].clientX - touchStartX) * -0.03;
           const stepY = (e.touches[0].clientY - touchStartY) * -0.03;
           
           cameraControlsRef.current.truck(stepX, stepY, true);
           
           // Reset for next delta
           touchStartX = e.touches[0].clientX;
           touchStartY = e.touches[0].clientY;
        }
      }

      // 2. Multi-touch Logic
      if (e.touches.length === 2 && cameraControlsRef.current) {
        e.preventDefault(); // Prevent default pinch zoom
        
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const currentAngle = getAngle(e.touches[0], e.touches[1]);
        
        // Check for Tap Invalidation (Movement Threshold)
        if (isTwoFingerTapCandidate) {
          const MOVE_THRESHOLD = 20;
          let movedTooMuch = false;
          
          for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i];
            const start = touchStartPositions.find(st => st.id === t.identifier);
            if (start) {
              const dist = Math.hypot(t.clientX - start.x, t.clientY - start.y);
              if (dist > MOVE_THRESHOLD) {
                movedTooMuch = true;
                break;
              }
            }
          }
          
          if (movedTooMuch) {
            isTwoFingerTapCandidate = false;
          }
        }

        // Pinch to zoom (only if not tapping/holding still)
        // Actually we allow small movements but if it's a tap we don't want jitter.
        // But for responsiveness, we usually process moves.
        // If it's a tap candidate, we can still pinch/rotate, but if they lift quickly it becomes a tap.
        // However, usually tap implies NO significant gesture action.
        
        if (touchState.current.isPinching) {
          const distanceDelta = currentDistance - touchState.current.lastDistance;
          const zoomSpeed = 0.05;
          cameraControlsRef.current.dolly(distanceDelta * zoomSpeed, true);
          
          // Haptic feedback at zoom limits
          const dist = cameraControlsRef.current.distance;
          if (dist <= 1 || dist >= 74) {
            haptics.impactMedium();
          }
        }
        
        // Two-finger rotate
        if (touchState.current.isTwoFingerRotate) {
          const angleDelta = currentAngle - touchState.current.lastAngle;
          cameraControlsRef.current.rotate(angleDelta * 0.5, 0, true);
        }
        
        touchState.current.lastDistance = currentDistance;
        touchState.current.lastAngle = currentAngle;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Cleanup Long Press / Pan Mode
      if (longPressTimer) clearTimeout(longPressTimer);
      
      if (isLongPress) {
        isLongPress = false;
        // Restore Rotation
        if (cameraControlsRef.current) {
          cameraControlsRef.current.azimuthRotateSpeed = 1.0; // Default
          cameraControlsRef.current.polarRotateSpeed = 1.0;
        }
      }

      // Key Logic: Check for Two-Finger Tap Completion
      // We check if we *were* a candidate and now fingers are lifting.
      // e.touches is the list of *active* touches.
      // If we go from 2 -> <2, we check.
      if (isTwoFingerTapCandidate && e.touches.length < 2) {
         const TAP_TIME_LIMIT = 400; // ms
         if (Date.now() - twoFingerTapStart < TAP_TIME_LIMIT) {
             // Success! Two-finger tap detected.
             haptics.success();
             
             // Toggle Auto-Rotate
             if (onAutoRotateChangeRef.current) {
                 const newState = !autoRotateRef.current;
                 onAutoRotateChangeRef.current(newState);
             }
         }
         // Reset candidate to prevent double-firing
         isTwoFingerTapCandidate = false;
      }

      if (e.touches.length < 2) {
        touchState.current.isPinching = false;
        touchState.current.isTwoFingerRotate = false;
        isTwoFingerTapCandidate = false; // Reset just in case
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl.domElement, isMobile]);

  useEffect(() => {
    const cleanup = handleTouchGestures();
    
    // Stop auto-rotate on desktop interactions
    const canvas = gl.domElement;
    const stopRotation = () => {
      if (autoRotateRef.current && onAutoRotateChangeRef.current) {
        onAutoRotateChangeRef.current(false);
      }
    };

    canvas.addEventListener('mousedown', stopRotation);
    canvas.addEventListener('wheel', stopRotation);

    return () => {
      cleanup();
      canvas.removeEventListener('mousedown', stopRotation);
      canvas.removeEventListener('wheel', stopRotation);
    };
  }, [handleTouchGestures, gl.domElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const controls = cameraControlsRef.current;
      if (!controls) return;

      switch(e.key.toLowerCase()) {
        case '1': // Top View (PCB Inspection standard)
          controls.setLookAt(0, 30, 0, 0, 0, 0, true);
          break;
        case '2': // Iso View (Professional 45deg)
          controls.setLookAt(20, 20, 20, 0, 0, 0, true);
          break;
        case '3': // Side/Stack View
          controls.setLookAt(30, 0, 0, 0, 0, 0, true);
          break;
        case 'r': // Reset Camera
          controls.setLookAt(10, 15, 10, 0, 0, 0, true);
          break;
        case ' ': // Toggle Rotate (Space)
        case 'f': // Toggle Rotate (F)
             if (onAutoRotateChange) onAutoRotateChange(!autoRotate);
             break;
        case 'arrowleft':
          controls.rotate(-10 * THREE.MathUtils.DEG2RAD, 0, true);
          break;
        case 'arrowright':
          controls.rotate(10 * THREE.MathUtils.DEG2RAD, 0, true);
          break;
        case 'arrowup':
          controls.rotate(0, -10 * THREE.MathUtils.DEG2RAD, true);
          break;
        case 'arrowdown':
          controls.rotate(0, 10 * THREE.MathUtils.DEG2RAD, true);
          break;
        
        // ZOOM CONTROLS (Apple-like precision)
        case '=':
        case '+':
          controls.dolly(2, true); // Smooth zoom in
          break;
        case '-':
        case '_':
          controls.dolly(-2, true); // Smooth zoom out
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    onAutoRotateChange && onAutoRotateChange(autoRotate); // Sync initial state
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoRotate, onAutoRotateChange]);

  // Handle per-frame updates: Auto-rotation & Dynamic Smoothing
  useFrame((_, delta) => {
     if (cameraControlsRef.current) {
        // 1. Auto Rotate
        if (autoRotate) {
           cameraControlsRef.current.azimuthAngle += 20 * THREE.MathUtils.DEG2RAD * delta;
        }

        // 2. Dynamic Smoothing (The Fix)
        // When zoomed in (low distance), we want snappy controls (low smoothTime).
        // When zoomed out (high distance), we want cinematic controls (high smoothTime).
        const dist = cameraControlsRef.current.distance;
        
        // Map distance range [30, 80] to smoothTime range [0.1, 0.8]
        // This makes it "snappy" even earlier (anything closer than 30 units is fully responsive).
        const t = THREE.MathUtils.clamp((dist - 30.0) / (80.0 - 30.0), 0, 1);
        const dynamicSmooth = THREE.MathUtils.lerp(0.1, 0.8, t);
        
        cameraControlsRef.current.smoothTime = dynamicSmooth;
     }
  });

  return (
    <CameraControls 
      ref={cameraControlsRef}
      smoothTime={SMOOTH_TIME}
      minDistance={0.8} // Allow "Hairline" Macro inspection
      maxDistance={75}
      dollySpeed={isMobile ? 0.1 : -0.5} // Slower on mobile for precision
      truckSpeed={isMobile ? 0.1 : 0.5}
      dollyToCursor={!isMobile} // Only on desktop
      // OrbitControls-style mobile optimizations
      makeDefault
      // Damping creates smooth, inertial movement (like OrbitControls enableDamping)
      // This is handled by smoothTime in CameraControls
    />
  );
}
