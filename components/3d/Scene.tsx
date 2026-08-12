'use client';

import { Canvas } 
-rom '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Model from './Model';
import { models } from '@/lib/data/models';

interface SceneProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
}

export default function Scene({ selectedModel, onModelSelect }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [15, 10, 15], fov: 50 }}
      shadows
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting Setup - Reduced to prevent color washing */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.3}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.2}
        castShadow
      />

      {/* Models */}
      <Suspense fallback={null}>
        {models.map((model) => (
          <Model
            key={model.name}
            path={model.path}
            position={model.position}
            isSelected={selectedModel === model.name}
            isVisible={true}
            onClick={() => onModelSelect(model.name)}
          />
        ))}
      </Suspense>

      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        minDistance={10}
        maxDistance={40}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={-1.0}
        panSpeed={-1.0}
      />
    </Canvas>
  );
}
