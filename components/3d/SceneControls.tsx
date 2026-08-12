'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { haptics } from '@/lib/utils/haptics';
import ImmersivePlayback from './ImmersivePlayback';


interface SceneControlsProps {
  autoRotate?: boolean;
  onAutoRotateChange?: (v: boolean) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  startTourProp?: boolean;
}

export default function SceneControls({ 
  autoRotate = false,
  onAutoRotateChange,
  onPlaybackStateChange,
  startTourProp = false
}: SceneControlsProps) {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { camera, gl, scene } = useThree();
  
  // Apple-like smooth animation config
  const SMOOTH_TIME = 0.8;
  const [isMobile, setIsMobile] = useState(false);
  
  // Immersive playback state - local + synced
  const [isImmersivePlaying, setIsImmersivePlayingLocal] = useState(false);
  
  const setIsImmersivePlaying = (val: boolean) => {
    setIsImmersivePlayingLocal(val);
    if (onPlaybackStateChange) onPlaybackStateChange(val);
  };

  const autoRotateBeforePlaybackRef = useRef(autoRotate);

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
  const isImmersivePlayingRef = useRef(isImmersivePlaying);
  
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    onAutoRotateChangeRef.current = onAutoRotateChange;
  }, [onAutoRotateChange]);

  useEffect(() => {
    isImmersivePlayingRef.current = isImmersivePlaying;
  }, [isImmersivePlaying]);

  // Watch for external tour trigger (e.g. from UI button)
  useEffect(() => {
    if (startTourProp && !isImmersivePlaying) {
      if (!isImmersivePlayingRef.current) {
        autoRotateBeforePlaybackRef.current = autoRotateRef.current;
        if (onAutoRotateChangeRef.current) {
          onAutoRotateChangeRef.current(false); // Stop auto-rotate during playback
        }
        setIsImmersivePlaying(true);
      }
    }
  }, [startTourProp, isImmersivePlaying]);

  // Enhanced mobile touch gesture handlers
  const handleTouchGestures = useCallback(() => {
    const canvas = gl.domElement;
    
    // Internal state for gesture detection
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout | null = null;
    let longPressTimer: NodeJS.Timeout | null = null;
    let isLongPress = false;
    let wasRotatingOnLongPress = false; // Track rotation state before long press
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
      // Don't auto-stop rotation - only SPACE key controls it
      
      // 1. Handle Taps (1 Finger)
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Long Press Detection Setup
        longPressTimer = setTimeout(() => {
          isLongPress = true;
          haptics.impactHeavy(); // Signal "Mode Change"
          
          // Stop rotation if it was active
          if (autoRotateRef.current) {
            wasRotatingOnLongPress = true;
            if (onAutoRotateChangeRef.current) {
              onAutoRotateChangeRef.current(false);
            }
          } else {
            wasRotatingOnLongPress = false;
          }

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
               haptics.impactMedium();
               cameraControlsRef.current.setLookAt(10, 15, 10, 0, 0, 0, true);
             } else if (tapCount === 4) {
               // Quadruple Tap: Start Immersive Playback
               haptics.success();
               if (!isImmersivePlayingRef.current) {
                 autoRotateBeforePlaybackRef.current = autoRotateRef.current;
                 if (onAutoRotateChangeRef.current) {
                   onAutoRotateChangeRef.current(false); // Stop auto-rotate during playback
                 }
                 setIsImmersivePlaying(true);
               }
             }
          }
          tapCount = 0;
        }, 300); // 300ms window for multi-taps
      } else {
        // Cancel single-finger logic if multi-touch
        if (longPressTimer) clearTimeout(longPressTimer);
        if (tapTimer) clearTimeout(tapTimer);
        
        // Fix: If interrupting a long press (e.g. adding 2nd finger), restore state
        if (isLongPress) {
          if (cameraControlsRef.current) {
            cameraControlsRef.current.azimuthRotateSpeed = 1.0;
            cameraControlsRef.current.polarRotateSpeed = 1.0;
          }
          // Resume auto-rotation if it was paused by the long press
          if (wasRotatingOnLongPress && onAutoRotateChangeRef.current) {
            onAutoRotateChangeRef.current(true);
          }
        }

        tapCount = 0;
        isLongPress = false;
        wasRotatingOnLongPress = false;
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
          const MOVE_THRESHOLD = 30; // Increased to 30px to tolerate "slop" in 2-finger taps
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
        // Restore Rotation Settings
        if (cameraControlsRef.current) {
          cameraControlsRef.current.azimuthRotateSpeed = 1.0; // Default
          cameraControlsRef.current.polarRotateSpeed = 1.0;
        }

        // Resume Auto-Rotation if needed
        if (wasRotatingOnLongPress && onAutoRotateChangeRef.current) {
          onAutoRotateChangeRef.current(true);
        }
        wasRotatingOnLongPress = false;
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

    // Mouse Click Handler for Rotation Toggle & Hold-to-Pause
    const canvas = gl.domElement;
    
    // State capture for the specific interaction
    let mouseDownTime = 0;
    let mouseDownX = 0;
    let mouseDownY = 0;
    let wasRotatingOnMouseDown = false;
    let isDragging = false; // Guard to prevent multiple listeners

    const handleMouseUp = (e: MouseEvent) => {
      // Only handle Left Click
      if (e.button === 0) {
        const timeDiff = performance.now() - mouseDownTime;
        const dx = e.clientX - mouseDownX;
        const dy = e.clientY - mouseDownY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Constants for "Click" detection
        const CLICK_TIME_THRESHOLD = 250; // ms
        const CLICK_MOVE_THRESHOLD = 5;   // pixels

        if (timeDiff < CLICK_TIME_THRESHOLD && dist < CLICK_MOVE_THRESHOLD) {
            // == CLICK EVENT (Toggle) ==
            if (onAutoRotateChangeRef.current) {
                // Toggle logic:
                // If we paused it (wasRotating=true), click means STOP (keep it stopped).
                // If it was already stopped (wasRotating=false), click means START.
                
                if (!wasRotatingOnMouseDown) {
                     onAutoRotateChangeRef.current(true);
                     haptics.success();
                } else {
                     haptics.impactLight();
                }
            }
        } else {
            // == DRAG / HOLD EVENT (Resume) ==
            // If it was rotating before, resume it.
            if (wasRotatingOnMouseDown && onAutoRotateChangeRef.current) {
                onAutoRotateChangeRef.current(true);
            }
        }
      }
      
      // Cleanup Global Listeners
      window.removeEventListener('mouseup', handleMouseUp);
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only track Left Click (button 0)
      if (e.button === 0) {
        // Prevent native selection/drag behaviors
        e.preventDefault();
        
        mouseDownTime = performance.now();
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        
        wasRotatingOnMouseDown = autoRotateRef.current;
        
        // Pause immediately for "Hold to freeze"
        if (wasRotatingOnMouseDown && onAutoRotateChangeRef.current) {
            onAutoRotateChangeRef.current(false);
        }
        
        // Attach MouseUp globally to handle dragging off-canvas
        if (!isDragging) {
             window.addEventListener('mouseup', handleMouseUp);
             isDragging = true;
        }
      }
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    // Note: We do NOT attach mouseup to canvas anymore, only to window dynamically.
    
    return () => {
      cleanup();
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp); // Safety cleanup
    };
  }, [handleTouchGestures, gl.domElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const controls = cameraControlsRef.current;
      if (!controls) return;

      switch(e.key.toLowerCase()) {
        case 'i': // Immersive Playback
          if (!isImmersivePlaying) {
            autoRotateBeforePlaybackRef.current = autoRotate;
            if (onAutoRotateChange) {
              onAutoRotateChange(false); // Stop auto-rotate during playback
            }
            setIsImmersivePlaying(true);
          }
          break;
        case ' ': // Toggle Rotate (Space) - ONLY control for auto-rotation
             if (onAutoRotateChange) onAutoRotateChange(!autoRotate);
             break;
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
  }, [autoRotate, onAutoRotateChange, isImmersivePlaying]);

  // Handle immersive playback completion
  const handlePlaybackComplete = useCallback(() => {
    setIsImmersivePlaying(false);
    // Resume auto-rotation if it was on before playback
    if (autoRotateBeforePlaybackRef.current && onAutoRotateChangeRef.current) {
      onAutoRotateChangeRef.current(true);
    }
  }, [onAutoRotateChange]);

  // Handle immersive playback stop (user interrupted)
  const handlePlaybackStop = useCallback(() => {
    setIsImmersivePlaying(false);
    // Resume auto-rotation if it was on before playback
    if (autoRotateBeforePlaybackRef.current && onAutoRotateChangeRef.current) {
      onAutoRotateChangeRef.current(true);
    }
  }, [onAutoRotateChange]);

  // Handle per-frame updates: Auto-rotation & Dynamic Smoothing
  useFrame((_, delta) => {
     if (cameraControlsRef.current) {
        // 1. Auto Rotate (only when not in immersive playback)
        if (autoRotate && !isImmersivePlaying) {
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
    <>
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
      <ImmersivePlayback
        isActive={isImmersivePlaying}
        onComplete={handlePlaybackComplete}
        onStop={handlePlaybackStop}
        cameraControlsRef={cameraControlsRef}
        autoRotateBeforePlayback={autoRotateBeforePlaybackRef.current}
      />

    </>
  );
}
