'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Stage, Environment, ContactShadows, Stats, PerformanceMonitor } from '@react-three/drei';
import SceneControls from './SceneControls';
import ControlsLegend from './ControlsLegend';
import { Suspense, useState } from 'react';
import Model from './Model';

interface InteractiveSceneProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  showGrid?: boolean;
  showStats?: boolean;
  modelVisibility?: Record<string, boolean>;
}

export default function InteractiveScene({ 
  selectedModel, 
  onModelSelect,
  showGrid = true,
  showStats = true,
  modelVisibility
}: InteractiveSceneProps) {
  const [dpr, setDpr] = useState(1.5); 
  const [autoRotate, setAutoRotate] = useState(false); // New State for turntable

  return (
    <Canvas
      dpr={dpr}
      frameloop="demand" // SceneControls handles demand rendering well
      shadows
      camera={{ position: [10, 15, 10], fov: 45 }} 
      gl={{ 
        antialias: true, 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8 
      }}
      className="bg-[#050505]"
      style={{ width: '100%', height: '100%' }}
      // Add keyboard listener to canvas for focus
      tabIndex={0}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
      {showStats && <Stats />}

      {/* PRO LIGHTING SETUP: STUDIO */}
      <Environment preset="studio" blur={1} background={false} /> 
      
      {/* KEY LIGHT */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={1.5} 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* FILL LIGHT */}
      <ambientLight intensity={0.1} />

      {/* GROUNDING */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.6} 
        scale={60} 
        blur={2} 
        far={4.5} 
        color="#000000"
      />
      
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

      {/* NEW: Apple-like Interactions */}
      <SceneControls 
        autoRotate={autoRotate} 
        onAutoRotateChange={setAutoRotate} 
      />
      
      {/* UI: Heads Up Display */}
      <ControlsLegend />
    </Canvas>
  );
}
