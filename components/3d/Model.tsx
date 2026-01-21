'use client';

import { useGLTF, Center } from '@react-three/drei';
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
  const [hovered, setHovered] = useState(false);
  
  // OPTIMIZATION: Enable Draco compression
  // Note: The draco files must be present in public/draco/
  const { scene } = useGLTF(path, true); 

  // Memoize geometry to prevent re-cloning on every render
  // Memoize geometry AND apply materials immediately to prevent FOUC (Flash of Unstyled Content)
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    
    // ROBUST MATERIAL OVERRIDE (FAIL-SAFE)
    // 1. Identify the largest mesh -> That is the PCB Body.
    // 2. Everything else is either Text (White) or Component (Metallic).
    
    let maxVolume = 0;
    let pcbMesh: THREE.Mesh | null = null;

    // First Pass: Find the PCB Body
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
           mesh.geometry.computeBoundingBox();
           const box = mesh.geometry.boundingBox;
           if (box) {
             const size = new THREE.Vector3();
             box.getSize(size);
             const volume = size.x * size.y * size.z;
             if (volume > maxVolume) {
               maxVolume = volume;
               pcbMesh = mesh;
             }
           }
        }
      }
    });

    // Second Pass: Apply Materials
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (material) {
           mesh.material = material.clone();
           const m = mesh.material as THREE.MeshStandardMaterial;

           // FIX: Reduce Graininess / Texture Aliasing
           // Apply high-quality texture filtering to all maps
           const applyTextureFiltering = (texture: THREE.Texture | null) => {
             if (texture) {
               texture.minFilter = THREE.LinearMipMapLinearFilter;
               texture.magFilter = THREE.LinearFilter;
               texture.anisotropy = 16; // Max anisotropic filtering
               texture.needsUpdate = true;
             }
           };

           applyTextureFiltering(m.map);
           applyTextureFiltering(m.normalMap);
           applyTextureFiltering(m.roughnessMap);
           applyTextureFiltering(m.metalnessMap);
           applyTextureFiltering(m.aoMap);
           applyTextureFiltering(m.emissiveMap);

           // IS THIS THE PCB BODY?
           if (mesh === pcbMesh) {
               // VISUAL: PREMIUM EMERALD GREEN FR4
               m.color.setHex(0x004d40); 
               m.roughness = 0.2;       
               m.metalness = 0.1;        
               m.envMapIntensity = 1.0;
           } 
           else {
               const h = m.color.getHSL({ h: 0, s: 0, l: 0 });
               
               // 1. PURE BLACK (ICs / Plastic Connectors)
               if (h.l < 0.25) { 
                   m.color.setHex(0x000000); // F U L L  B L A C K
                   m.roughness = 0.5;        // Matte-ish plastic
                   m.metalness = 0.0;        
                   m.envMapIntensity = 0.5;  
               }
                // 2. CRISP WHITE (Silkscreen)
               else if (h.l > 0.8 && h.s < 0.2) {
                   m.color.setHex(0xFFFFFF); 
                   m.roughness = 1.0;
                   m.metalness = 0.0;
                   // FIX: Prevent Z-fighting/Disappearing text on PCB
                   m.polygonOffset = true;
                   m.polygonOffsetFactor = -1; // Pull towards camera
                   
                   // FIX: Force render ON TOP of the PCB (fixes "disappearing at angles" transparency sorting)
                   mesh.renderOrder = 1; 
               }
               // 3. VIBRANT RED (LEDs)
               // Hue 0-0.05 (Red) or 0.95-1.0 (Red)
               else if ((h.h < 0.05 || h.h > 0.95) && h.s > 0.3) {
                   m.color.setHex(0xE60000); // Deep Crisp Red
                   m.roughness = 0.3;        // Shiny Plastic/Epoxy
                   m.metalness = 0.0;
                   m.emissive.setHex(0x330000); // Slight inner glow
               }
               // 4. GOLD / BRASS (Pins, Capacitor tops)
               else if (h.h > 0.08 && h.h < 0.15) {
                   m.color.setHex(0xFFD700); // Gold
                   m.roughness = 0.3;
                   m.metalness = 1.0;        // Full Metal
                   m.envMapIntensity = 2.0;
               }
               // 5. EVERYTHING ELSE (Silver/Tin/Grey)
               else {
                   m.roughness = 0.4;
                   m.metalness = 1.0;        // Assume it's metal (pins/pads)
                   m.envMapIntensity = 1.5;
               }
           }
           
           m.transparent = true; // Keep for fade effects
        }
      }
    });

    // DEBUG: Assert Dimensions
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    box.getSize(size);
    // console.log(`[Dimension Check] ${path}:`, {x: size.x, y: size.y, z: size.z});

    return s;
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetOpacity = isVisible ? 1 : 0;
      let visibleCount = 0;
      let needsUpdate = false;

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material) {
            // Lerp opacity
            if (Math.abs(material.opacity - targetOpacity) > 0.001) {
              material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, delta * 5);
              needsUpdate = true;
            }
            if (material.opacity > 0.01) {
              material.visible = true;
              visibleCount++;
            } else {
              material.visible = false;
            }
          }
        }
      });
      // Optimize: Disable entire group if completely invisible
      groupRef.current.visible = visibleCount > 0;
      if (needsUpdate) state.invalidate();
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Center top>
        <primitive
          object={clonedScene}
          scale={25} 
        />
      </Center>
      {isSelected && (
        <pointLight
          position={[0, 2, 0]}
          intensity={2}
          distance={5}
          color="#ffd700" 
        />
      )}
    </group>
  );
}

// Preload all models with Draco enabled
const modelPaths = [
  '/models/alu_full.glb',
];

modelPaths.forEach((path) => {
  useGLTF.preload(path, true); // true enables Draco
});
