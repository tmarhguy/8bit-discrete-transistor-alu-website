'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import Model from './Model';
import { models } from '@/lib/data/models';

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
  return (
    <Canvas
      dpr={[1, 1]} // Locked to 1x for max performance
      frameloop="demand" // Only render when needed (idle = 0% GPU)
      camera={{ position: [15, 10, 15], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="bg-background"
    >
      {/* Stats */}
      {showStats && <Stats />}

      {/* Lighting Setup - Simple & Fast */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.2} />

      {/* Grid Helper */}
      {showGrid && (
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
      )}

      {/* Models */}
      <Suspense fallback={null}>
        {models.map((model) => (
          <Model
            key={model.name}
            path={model.path}
            position={model.position}
            isSelected={selectedModel === model.name}
            onClick={() => onModelSelect(model.name)}
            isVisible={modelVisibility ? modelVisibility[model.name] : true}
          />
        ))}
      </Suspense>

      {/* Enhanced Orbit Controls - Full freedom */}
      <OrbitControls
        makeDefault
        minDistance={5}
        maxDistance={50}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        panSpeed={0.5}
        zoomSpeed={0.8}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}
