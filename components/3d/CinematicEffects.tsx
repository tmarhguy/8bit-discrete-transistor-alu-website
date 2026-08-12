'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CinematicEffectsProps {
  isPlaying: boolean;
  intensity?: number;
}

export default function CinematicEffects({ 
  isPlaying, 
  intensity = 0.3 
}: CinematicEffectsProps) {
  const { camera, scene } = useThree();
  const originalFogRef = useRef<THREE.Fog | THREE.FogExp2 | null>(null);
  const timeRef = useRef(0);

  // Add subtle atmospheric fog during playback
  useEffect(() => {
    if (isPlaying) {
      // Store original fog
      originalFogRef.current = scene.fog;
      
      // Add cinematic fog
      scene.fog = new THREE.Fog(0x000000, 30, 100);
    } else {
      // Restore original fog
      if (originalFogRef.current !== undefined) {
        scene.fog = originalFogRef.current;
      }
    }
    
    return () => {
      if (originalFogRef.current !== undefined) {
        scene.fog = originalFogRef.current;
      }
    };
  }, [isPlaying, scene]);

  // Subtle camera shake for organic feel (film grain effect)
  useFrame((_, delta) => {
    if (!isPlaying) return;
    
    timeRef.current += delta;
    
    // Very subtle shake using Perlin-like noise approximation
    const shakeX = Math.sin(timeRef.current * 2.3) * Math.cos(timeRef.current * 3.7) * 0.002 * intensity;
    const shakeY = Math.sin(timeRef.current * 3.1) * Math.cos(timeRef.current * 2.9) * 0.002 * intensity;
    const shakeZ = Math.sin(timeRef.current * 2.7) * Math.cos(timeRef.current * 3.3) * 0.001 * intensity;
    
    // Apply shake to camera rotation (very subtle)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.rotation.x += shakeX;
      camera.rotation.y += shakeY;
      camera.rotation.z += shakeZ;
    }
  });

  return null;
}
