'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Stage, Environment, ContactShadows, Stats, PerformanceMonitor } from '@react-three/drei';
import SceneControls from './SceneControls';
import { Suspense, useState, useMemo, useEffect, useRef } from 'react';
import Model from './Model';

interface InteractiveSceneProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  showGrid?: boolean;
  showStats?: boolean;
  modelVisibility?: Record<string, boolean>;
}

// Performance tier detection
type PerformanceTier = 'high' | 'medium' | 'low';

function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    const cores = navigator.hardwareConcurrency || 4;
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
    
    // Low tier: low-end mobile or explicitly low resources
    if (cores <= 4 && isMobile) return 'low';
    
    // High tier: desktop with good specs
    if (cores >= 8 && dpr >= 2 && !isMobile) return 'high';
    
    // Medium tier: everything else
    return 'medium';
  }, []);
}

// DPR caps per tier
const DPR_CAPS: Record<PerformanceTier, [number, number]> = {
  high: [1, 2],
  medium: [1, 1.5],
  low: [1, 1],
};

export default function InteractiveScene({ 
  selectedModel, 
  onModelSelect,
  showGrid = true,
  showStats = true,
  modelVisibility
}: InteractiveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const [dpr, setDpr] = useState(DPR_CAPS[tier][1]); 
  const [autoRotate, setAutoRotate] = useState(true);
  const [isImmersivePlaying, setIsImmersivePlaying] = useState(false); // New state to force frameloop
  const [isVisible, setIsVisible] = useState(true);

  // Offscreen pause: stop rendering when not visible
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Page visibility: pause when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        dpr={dpr}
        // FORCE ALWAYS RENDERING IF PLAYING: logic updated
        frameloop={isVisible ? ((autoRotate || isImmersivePlaying) ? 'always' : 'demand') : 'never'}
        shadows={tier !== 'low'}
        camera={{ position: [10, 15, 10], fov: 45 }} 
        gl={{ 
          antialias: true, // Enable for all tiers - critical for reducing graininess
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          powerPreference: tier === 'low' ? 'low-power' : 'high-performance',
          logarithmicDepthBuffer: true, // Prevents z-fighting and improves depth precision
        }}
        onCreated={({ gl }) => {
          // Set max anisotropy for the renderer
          gl.capabilities.getMaxAnisotropy();
        }}
        className="bg-[#050505]"
        style={{ width: '100%', height: '100%' }}
        tabIndex={0}
        events={(store: any) => ({
          ...store.events,
          compute: (event, state) => {
            const { width, height, left, top } = state.gl.domElement.getBoundingClientRect()
            const x = event.clientX - left
            const y = event.clientY - top
            state.pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1)
            state.raycaster.setFromCamera(state.pointer, state.camera)
          },
        })}
      >
        <PerformanceMonitor 
          onDecline={() => setDpr(DPR_CAPS[tier][0])} 
          onIncline={() => setDpr(DPR_CAPS[tier][1])} 
        />
        {showStats && <Stats />}

        {/* PRO LIGHTING SETUP: STUDIO */}
        <Environment preset="studio" blur={1} background={false} /> 
        
        {/* KEY LIGHT - reduced intensity on low tier */}
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.2} 
          penumbra={1} 
          intensity={tier === 'low' ? 1 : 1.5} 
          castShadow={tier !== 'low'}
          shadow-bias={-0.0001}
        />
        
        {/* FILL LIGHT */}
        <ambientLight intensity={tier === 'low' ? 0.2 : 0.1} />

        {/* GROUNDING - skip contact shadows on low tier */}
        {tier !== 'low' && (
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.6} 
            scale={60} 
            blur={2} 
            far={4.5} 
            color="#000000"
          />
        )}
        
        {showGrid && (
          <gridHelper args={[50, 50, '#1a1a1a', '#111111']} position={[0, -0.01, 0]} />
        )}

        {/* Models - Single Assembly for Performance */}
        <Suspense fallback={null}>
          <Model
            path="/models/alu_full.glb"
            position={[0, 0, 0]}
            isSelected={false}
            onClick={() => {}} 
            isVisible={true}
          />
        </Suspense>

        {/* Apple-like Interactions */}
        <SceneControls 
          autoRotate={autoRotate} 
          onAutoRotateChange={setAutoRotate} 
          // Inject control to lift state up
          onPlaybackStateChange={setIsImmersivePlaying}
        />
        
      </Canvas>
    </div>
  );
}

