'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { createPathGenerator, CameraPathGenerator } from '@/lib/camera/pathGenerator';
import { CameraSnapshot } from '@/lib/camera/types';

interface ImmersivePlaybackProps {
  isActive: boolean;
  onComplete: () => void;
  onStop: () => void;
  cameraControlsRef: React.RefObject<CameraControls>;
  autoRotateBeforePlayback: boolean;
}

export default function ImmersivePlayback({
  isActive,
  onComplete,
  onStop,
  cameraControlsRef,
  autoRotateBeforePlayback,
}: ImmersivePlaybackProps) {
  const { camera } = useThree();
  const [isPlaying, setIsPlaying] = useState(false);
  const pathGeneratorRef = useRef<CameraPathGenerator | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const transitionStartTimeRef = useRef<number>(0);
  const isTransitioningRef = useRef(false);
  const isZoomingBackRef = useRef(false);
  const startPositionRef = useRef<{ position: [number, number, number], target: [number, number, number], fov: number } | null>(null);
  const targetPositionRef = useRef<{ position: [number, number, number], target: [number, number, number], fov: number } | null>(null);
  const transitionDurationRef = useRef(2); // 2 seconds for smooth transition to start (faster)
  const zoomBackDurationRef = useRef(3); // 3 seconds for smooth zoom back to start (faster)
  const pathDurationRef = useRef(45); // 45 seconds total path duration (slower for cinematic feel)
  
  // Temporal smoothing refs to handle frame drops
  const smoothedPositionRef = useRef<[number, number, number]>([0, 0, 0]);
  const smoothedTargetRef = useRef<[number, number, number]>([0, 0, 0]);
  const isFirstFrameRef = useRef(true);
  const SMOOTH_FACTOR = 0.25; // Lower = smoother but more lag (0.25 is good balance)

  // Helper function to calculate easing velocity (derivative of easeInOutQuart)
  const getEasingVelocity = (
    start: [number, number, number],
    end: [number, number, number],
    progress: number,
    duration: number
  ): [number, number, number] => {
    // Derivative of easeInOutQuart
    const dp = progress < 0.5
      ? 32 * progress * progress * progress
      : -16 * Math.pow(-2 * progress + 2, 3);
    
    return [
      (end[0] - start[0]) * dp / duration,
      (end[1] - start[1]) * dp / duration,
      (end[2] - start[2]) * dp / duration,
    ];
  };

  // Start playback when activated
  useEffect(() => {
    if (isActive && cameraControlsRef.current) {
      // Create parametric path generator for perfectly smooth motion
      // Uses Catmull-Rom splines with unified velocity (smooth position AND rotation)
      pathGeneratorRef.current = createPathGenerator(true, pathDurationRef.current);
      
      // Capture current camera state
      const currentPosition = camera.position.clone();
      const currentTarget = cameraControlsRef.current.getTarget(new THREE.Vector3());
      const currentFov = (camera as THREE.PerspectiveCamera).fov || 45;
      
      startPositionRef.current = {
        position: [currentPosition.x, currentPosition.y, currentPosition.z],
        target: [currentTarget.x, currentTarget.y, currentTarget.z],
        fov: currentFov,
      };
      
      // Get first frame as target
      const firstFrame = pathGeneratorRef.current.getSnapshotAtTime(0);
      targetPositionRef.current = {
        position: firstFrame.position,
        target: firstFrame.target,
        fov: firstFrame.fov ?? 45,
      };
      
      // Reset smoothing state
      isFirstFrameRef.current = true;
      
      // Start transition
      isTransitioningRef.current = true;
      transitionStartTimeRef.current = performance.now() / 1000;
      
      setIsPlaying(true);
    } else if (!isActive) {
      // Reset state when deactivated
      isTransitioningRef.current = false;
      isZoomingBackRef.current = false;
      pathGeneratorRef.current = null;
      isFirstFrameRef.current = true;
      setIsPlaying(false);
    }
  }, [isActive, cameraControlsRef, camera]);

  // Handle user input to stop playback
  useEffect(() => {
    if (!isPlaying) return;

    const handleStop = () => {
      onStop();
    };

    // Stop on any keyboard input (except 'I' which might be used to restart)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'i') {
        handleStop();
      }
    };

    // Stop on mouse/touch interaction
    const handleInteraction = () => {
      handleStop();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('wheel', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, [isPlaying, onStop]);

  // Main playback loop - perfectly smooth parametric motion
  useFrame((_, delta) => {
    if (!isPlaying || !cameraControlsRef.current || !pathGeneratorRef.current) return;

    const now = performance.now() / 1000;

    // Handle transition from current position to start of playback
    if (isTransitioningRef.current && startPositionRef.current && targetPositionRef.current) {
      const transitionElapsed = now - transitionStartTimeRef.current;
      const transitionProgress = Math.min(transitionElapsed / transitionDurationRef.current, 1);
      
      // Use easeInOutQuart for very smooth, cinematic transition
      const easedProgress = transitionProgress < 0.5
        ? 8 * transitionProgress * transitionProgress * transitionProgress * transitionProgress
        : 1 - Math.pow(-2 * transitionProgress + 2, 4) / 2;
      
      // Interpolate each axis independently for smooth, natural movement
      const interpolated = {
        position: [
          THREE.MathUtils.lerp(startPositionRef.current.position[0], targetPositionRef.current.position[0], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current.position[1], targetPositionRef.current.position[1], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current.position[2], targetPositionRef.current.position[2], easedProgress),
        ] as [number, number, number],
        target: [
          THREE.MathUtils.lerp(startPositionRef.current.target[0], targetPositionRef.current.target[0], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current.target[1], targetPositionRef.current.target[1], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current.target[2], targetPositionRef.current.target[2], easedProgress),
        ] as [number, number, number],
        fov: THREE.MathUtils.lerp(startPositionRef.current.fov, targetPositionRef.current.fov, easedProgress),
      };
      
      // Apply the interpolated camera state smoothly
      // This ensures both position AND target (look-at) transition smoothly
      cameraControlsRef.current.setLookAt(
        interpolated.position[0],
        interpolated.position[1],
        interpolated.position[2],
        interpolated.target[0],
        interpolated.target[1],
        interpolated.target[2],
        false // No additional smoothing - we're handling it manually
      );
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = interpolated.fov;
        camera.updateProjectionMatrix();
      }
      
      if (transitionProgress >= 1) {
        isTransitioningRef.current = false;
        
        // VELOCITY CONTINUITY FIX: Match velocity at transition boundary
        // Calculate end velocity of easing curve
        const endVelocity = getEasingVelocity(
          startPositionRef.current.position,
          targetPositionRef.current.position,
          1.0,
          transitionDurationRef.current
        );
        
        // Get path start velocity (if available)
        if ('getVelocityAtTime' in pathGeneratorRef.current) {
          const pathVelocity = (pathGeneratorRef.current as any).getVelocityAtTime(0);
          
          // Handle both legacy {position: Vector3} and standard Vector3 return types
          const pVel = pathVelocity.position || pathVelocity;
          
          // Calculate velocity mismatch
          const velocityMismatch = Math.sqrt(
            Math.pow(endVelocity[0] - pVel.x, 2) +
            Math.pow(endVelocity[1] - pVel.y, 2) +
            Math.pow(endVelocity[2] - pVel.z, 2)
          );
          
          // If velocities don't match, add a micro-transition (200ms)
          if (velocityMismatch > 0.01) {
            startTimeRef.current = now + 0.2; // 200ms velocity matching buffer
          } else {
            startTimeRef.current = now;
          }
        } else {
          startTimeRef.current = now;
        }
      }
      
      return;
    }

    // Parametric playback - generate smooth positions in real-time
    if (startTimeRef.current === 0) {
      startTimeRef.current = now;
    }
    
    const elapsed = now - startTimeRef.current;
    const pathDuration = pathGeneratorRef.current.getDuration();
    
    // Check if playback is complete - start zoom back to start
    if (elapsed >= pathDuration) {
      // Start zoom back transition
      if (!isZoomingBackRef.current) {
        isZoomingBackRef.current = true;
        transitionStartTimeRef.current = now;
        
        // Capture current (end) position
        const lastFrame = pathGeneratorRef.current.getSnapshotAtTime(pathDuration);
        startPositionRef.current = {
          position: lastFrame.position,
          target: lastFrame.target,
          fov: lastFrame.fov ?? 45,
        };
        
        // Target is the first frame (start position)
        const firstFrame = pathGeneratorRef.current.getSnapshotAtTime(0);
        targetPositionRef.current = {
          position: firstFrame.position,
          target: firstFrame.target,
          fov: firstFrame.fov ?? 45,
        };
      }
      
      // Handle zoom back transition
      const zoomBackElapsed = now - transitionStartTimeRef.current;
      const zoomBackProgress = Math.min(zoomBackElapsed / zoomBackDurationRef.current, 1);
      
      // Use easeInOutQuint for very smooth, cinematic zoom back
      const easedProgress = zoomBackProgress < 0.5
        ? 16 * zoomBackProgress * zoomBackProgress * zoomBackProgress * zoomBackProgress * zoomBackProgress
        : 1 - Math.pow(-2 * zoomBackProgress + 2, 5) / 2;
      
      // Interpolate smoothly back to start
      const interpolated = {
        position: [
          THREE.MathUtils.lerp(startPositionRef.current!.position[0], targetPositionRef.current!.position[0], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current!.position[1], targetPositionRef.current!.position[1], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current!.position[2], targetPositionRef.current!.position[2], easedProgress),
        ] as [number, number, number],
        target: [
          THREE.MathUtils.lerp(startPositionRef.current!.target[0], targetPositionRef.current!.target[0], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current!.target[1], targetPositionRef.current!.target[1], easedProgress),
          THREE.MathUtils.lerp(startPositionRef.current!.target[2], targetPositionRef.current!.target[2], easedProgress),
        ] as [number, number, number],
        fov: THREE.MathUtils.lerp(startPositionRef.current!.fov, targetPositionRef.current!.fov, easedProgress),
      };
      
      // Apply the interpolated camera state
      cameraControlsRef.current.setLookAt(
        interpolated.position[0],
        interpolated.position[1],
        interpolated.position[2],
        interpolated.target[0],
        interpolated.target[1],
        interpolated.target[2],
        false
      );
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = interpolated.fov;
        camera.updateProjectionMatrix();
      }
      
      // Complete when zoom back is done
      if (zoomBackProgress >= 1) {
        isZoomingBackRef.current = false;
        onComplete();
      }
      
      return;
    }
    
    // Generate camera position for current time using parametric curves
    // This is mathematically smooth - no discrete frames!
    const snapshot = pathGeneratorRef.current.getSnapshotAtTime(elapsed);
    
    // TEMPORAL SMOOTHING FIX: Apply exponential smoothing to handle frame drops
    // This ensures smooth motion even if frame rate varies (60fps -> 30fps)
    if (isFirstFrameRef.current) {
      // Initialize smoothed values on first frame
      smoothedPositionRef.current = snapshot.position;
      smoothedTargetRef.current = snapshot.target;
      isFirstFrameRef.current = false;
    } else {
      // Apply exponential smoothing (low-pass filter)
      smoothedPositionRef.current = [
        THREE.MathUtils.lerp(smoothedPositionRef.current[0], snapshot.position[0], SMOOTH_FACTOR),
        THREE.MathUtils.lerp(smoothedPositionRef.current[1], snapshot.position[1], SMOOTH_FACTOR),
        THREE.MathUtils.lerp(smoothedPositionRef.current[2], snapshot.position[2], SMOOTH_FACTOR),
      ];
      
      smoothedTargetRef.current = [
        THREE.MathUtils.lerp(smoothedTargetRef.current[0], snapshot.target[0], SMOOTH_FACTOR),
        THREE.MathUtils.lerp(smoothedTargetRef.current[1], snapshot.target[1], SMOOTH_FACTOR),
        THREE.MathUtils.lerp(smoothedTargetRef.current[2], snapshot.target[2], SMOOTH_FACTOR),
      ];
    }
    
    // Apply smoothed camera position and target
    cameraControlsRef.current.setLookAt(
      smoothedPositionRef.current[0],
      smoothedPositionRef.current[1],
      smoothedPositionRef.current[2],
      smoothedTargetRef.current[0],
      smoothedTargetRef.current[1],
      smoothedTargetRef.current[2],
      false // No additional smoothing - we're handling it manually
    );
    
    // Update FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = snapshot.fov ?? 45;
      camera.updateProjectionMatrix();
    }
  });

  // This component doesn't render anything visible
  return null;
}
