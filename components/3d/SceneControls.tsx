'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SceneControlsProps {
  autoRotate?: boolean;
  onAutoRotateChange?: (v: boolean) => void;
}

export default function SceneControls({ 
  autoRotate = false,
  onAutoRotateChange 
}: SceneControlsProps) {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { camera } = useThree();
  
  // Apple-like smooth animation config
  const SMOOTH_TIME = 0.8;

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
        case 'f': // Reset Camera (Default)
          controls.setLookAt(10, 15, 10, 0, 0, 0, true);
          break;
        case 'r': // Toggle Rotate
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
      dollySpeed={0.5} 
      truckSpeed={0.5}
      dollyToCursor={true} // UX: Zoom towards mouse pointer
    />
  );
}
