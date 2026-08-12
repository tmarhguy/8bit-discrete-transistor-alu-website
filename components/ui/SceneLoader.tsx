'use client';

import { useProgress } from '@react-three/drei';
import LoadingSpinner from './LoadingSpinner';
import { useEffect, useState } from 'react';

interface SceneLoaderProps {
  isInitializing?: boolean;
}

export default function SceneLoader({ isInitializing = false }: SceneLoaderProps) {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  // Smooth out the disappearing act
  useEffect(() => {
    if (!active && !isInitializing && progress === 100) {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [active, isInitializing, progress]);

  if (!show) return null;

  // Decide what text to show
  let statusText = 'Initializing System...';
  if (!isInitializing) {
     statusText = `Loading ALU: ${progress.toFixed(2)}%`;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500">
      <LoadingSpinner>
          <p className="mt-4 text-mono font-medium text-white tracking-wider text-sm animate-pulse">
            {statusText}
          </p>
          {/* Optional: Add a simple progress bar visual */}
          {!isInitializing && (
            <div className="mt-2 w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-amber-400 transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
          )}
      </LoadingSpinner>
    </div>
  );
}
