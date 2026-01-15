'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface ModelProps {
  path: string;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  isVisible: boolean;
}

export default function Model({ path, position, isSelected, onClick, isVisible }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(path);

  // Memoize geometry to prevent re-cloning on every render
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Enhance material colors only once and cache references
  useEffect(() => {
    materialsRef.current = []; // Reset cache
    
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (material.isMeshStandardMaterial) {
          // Create a new material to avoid modifying the original
          const enhancedMaterial = material.clone();
          
          // Enable transparency for fading
          enhancedMaterial.transparent = true;
          enhancedMaterial.opacity = 1; // Start fully visible

          // Get the current color
          const color = enhancedMaterial.color;
          
          // Check if it's a green-ish color (hue between 90-150 degrees)
          const hsl = { h: 0, s: 0, l: 0 };
          color.getHSL(hsl);
          
          if (hsl.h > 0.25 && hsl.h < 0.42) {
            // It's green - make it deep green with high saturation
            enhancedMaterial.color.setHSL(0.33, 0.9, 0.25); // Deep green
          } else if (hsl.l < 0.3) {
            // It's dark - make it pure black
            enhancedMaterial.color.setHex(0x000000);
          }
          
          // Reduce metalness and increase roughness for more vibrant colors
          enhancedMaterial.metalness = 0.1;
          enhancedMaterial.roughness = 0.7;
          
          // Disable environment map influence
          enhancedMaterial.envMapIntensity = 0;
          
          // Ensure colors are in sRGB space
          enhancedMaterial.color.convertSRGBToLinear();
          
          mesh.material = enhancedMaterial;
          materialsRef.current.push(enhancedMaterial);
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // PERFORMANCE OPTIMIZATION: Iterate cached materials instead of traversing scene graph
      const targetOpacity = isVisible ? 1 : 0;
      let visibleCount = 0;
      let needsUpdate = false;
      
      for (const material of materialsRef.current) {
        if (Math.abs(material.opacity - targetOpacity) > 0.001) {
          material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, delta * 5);
          needsUpdate = true;
        }
        if (material.opacity > 0.01) visibleCount++;
      }
      
      // Update group visibility based on cumulative opacity
      if (groupRef.current.visible !== (visibleCount > 0)) {
        groupRef.current.visible = visibleCount > 0;
        needsUpdate = true;
      }

      // If we are still animating opacity, request another frame
      if (needsUpdate) {
        state.invalidate();
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click-through
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <primitive
        object={clonedScene}
        scale={hovered || isSelected ? 26.25 : 25}
      />
      {isSelected && (
        <pointLight
          position={[0, 2, 0]}
          intensity={0.5}
          distance={5}
          color="#ffffff"
        />
      )}
    </group>
  );
}

// Preload all models
const modelPaths = [
  '/models/main_control.glb',
  '/models/main_logic.glb',
  '/models/add_sub.glb',
  '/models/flags.glb',
  '/models/led_panel_1.glb',
  '/models/led_panel_2.glb',
  '/models/led_panel_3.glb',
  '/models/led_panel_4.glb',
];

modelPaths.forEach((path) => {
  useGLTF.preload(path);
});
