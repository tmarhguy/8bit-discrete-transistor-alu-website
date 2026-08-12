/**
 * Camera interpolation utilities for smooth playback
 */

import { CameraSnapshot } from './types';
import * as THREE from 'three';

/**
 * Easing functions for camera movement
 */

// Smooth start and end (Apple's favorite)
export function easeInOutCubic(t: number): number {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Slow start, fast end (falling)
export function easeInQuad(t: number): number {
  return t * t;
}

// Fast start, slow end (deceleration)
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

// Cinema-grade smoothness (Ken Burns effect)
export function easeInOutQuart(t: number): number {
  return t < 0.5 
    ? 8 * t * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

// Linear (no easing)
export function linear(t: number): number {
  return t;
}

/**
 * Apply easing function to progress value
 */
export function applyEasing(
  t: number, 
  easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' | 'easeInOutQuart' = 'easeInOut'
): number {
  switch (easing) {
    case 'linear':
      return linear(t);
    case 'easeInOut':
      return easeInOutCubic(t);
    case 'easeIn':
      return easeInQuad(t);
    case 'easeOut':
      return easeOutQuad(t);
    case 'easeInOutQuart':
      return easeInOutQuart(t);
    default:
      return easeInOutCubic(t);
  }
}

/**
 * Interpolate between two camera snapshots
 * @param current - Starting snapshot
 * @param next - Ending snapshot
 * @param t - Progress (0.0 to 1.0)
 * @param easing - Easing function to apply
 */
export function interpolateCamera(
  current: CameraSnapshot,
  next: CameraSnapshot,
  t: number,
  easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' | 'easeInOutQuart' = 'easeInOut'
): { position: [number, number, number], target: [number, number, number], fov: number } {
  // Clamp t to [0, 1]
  const clampedT = THREE.MathUtils.clamp(t, 0, 1);
  
  // Apply easing
  const easedT = applyEasing(clampedT, easing);
  
  // Interpolate position
  const position: [number, number, number] = [
    THREE.MathUtils.lerp(current.position[0], next.position[0], easedT),
    THREE.MathUtils.lerp(current.position[1], next.position[1], easedT),
    THREE.MathUtils.lerp(current.position[2], next.position[2], easedT),
  ];
  
  // Interpolate target
  const target: [number, number, number] = [
    THREE.MathUtils.lerp(current.target[0], next.target[0], easedT),
    THREE.MathUtils.lerp(current.target[1], next.target[1], easedT),
    THREE.MathUtils.lerp(current.target[2], next.target[2], easedT),
  ];
  
  // Interpolate FOV (default to 45 if not specified)
  const currentFov = current.fov ?? 45;
  const nextFov = next.fov ?? 45;
  const fov = THREE.MathUtils.lerp(currentFov, nextFov, easedT);
  
  return { position, target, fov };
}

/**
 * Find the two snapshots to interpolate between based on current time
 */
export function findSnapshotsForTime(
  snapshots: CameraSnapshot[],
  currentTime: number
): { current: CameraSnapshot, next: CameraSnapshot, t: number } | null {
  if (snapshots.length < 2) {
    return null;
  }
  
  // If time is before first snapshot, use first two
  if (currentTime <= snapshots[0].timestamp) {
    return {
      current: snapshots[0],
      next: snapshots[1],
      t: 0,
    };
  }
  
  // If time is after last snapshot, use last two
  if (currentTime >= snapshots[snapshots.length - 1].timestamp) {
    const last = snapshots.length - 1;
    return {
      current: snapshots[last - 1],
      next: snapshots[last],
      t: 1,
    };
  }
  
  // Find the two snapshots to interpolate between
  for (let i = 0; i < snapshots.length - 1; i++) {
    const current = snapshots[i];
    const next = snapshots[i + 1];
    
    if (currentTime >= current.timestamp && currentTime <= next.timestamp) {
      // Calculate interpolation factor
      const duration = next.timestamp - current.timestamp;
      const elapsed = currentTime - current.timestamp;
      const t = duration > 0 ? elapsed / duration : 0;
      
      return { current, next, t };
    }
  }
  
  return null;
}

/**
 * Reverse a scene's snapshots (for creating reverse playback)
 */
export function reverseScene(snapshots: CameraSnapshot[]): CameraSnapshot[] {
  if (snapshots.length === 0) return [];
  
  const maxTime = snapshots[snapshots.length - 1].timestamp;
  const reversed = [...snapshots].reverse();
  
  // Adjust timestamps to go from 0 to maxTime
  return reversed.map((snapshot, index) => {
    const originalIndex = snapshots.length - 1 - index;
    const originalTime = snapshots[originalIndex].timestamp;
    const newTime = maxTime - originalTime;
    
    return {
      ...snapshot,
      timestamp: newTime,
    };
  });
}

/**
 * Calculate 3D distance between two points
 */
function distance3D(p1: [number, number, number], p2: [number, number, number]): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Interpolate between two snapshots
 */
function interpolateSnapshot(s1: CameraSnapshot, s2: CameraSnapshot, t: number): CameraSnapshot {
  return {
    position: [
      s1.position[0] + (s2.position[0] - s1.position[0]) * t,
      s1.position[1] + (s2.position[1] - s1.position[1]) * t,
      s1.position[2] + (s2.position[2] - s1.position[2]) * t,
    ],
    target: [
      s1.target[0] + (s2.target[0] - s1.target[0]) * t,
      s1.target[1] + (s2.target[1] - s1.target[1]) * t,
      s1.target[2] + (s2.target[2] - s1.target[2]) * t,
    ],
    fov: s1.fov ? s1.fov + ((s2.fov || s1.fov) - s1.fov) * t : undefined,
    timestamp: s1.timestamp + (s2.timestamp - s1.timestamp) * t,
  };
}

/**
 * Merge multiple scenes into one continuous path with smooth transitions
 * Ensures equal spacing between all frames, including across scene boundaries
 * 
 * @param scenes - Array of scene snapshots to merge
 * @param transitionFrames - Number of interpolated frames to add between scenes (default: 3)
 * @returns Merged array of snapshots with consistent spacing
 */
export function mergeScenesWithTransitions(
  scenes: CameraSnapshot[][],
  transitionFrames: number = 3
): CameraSnapshot[] {
  if (scenes.length === 0) return [];
  if (scenes.length === 1) return scenes[0];
  
  const merged: CameraSnapshot[] = [];
  
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    
    // Add all frames from current scene
    merged.push(...scene);
    
    // Add transition frames to next scene (except for last scene)
    if (i < scenes.length - 1) {
      const lastFrame = scene[scene.length - 1];
      const nextFirstFrame = scenes[i + 1][0];
      
      // Create smooth transition frames
      for (let j = 1; j <= transitionFrames; j++) {
        const t = j / (transitionFrames + 1);
        merged.push(interpolateSnapshot(lastFrame, nextFirstFrame, t));
      }
    }
  }
  
  // Normalize to equal spacing
  return normalizeSpacing(merged);
}

/**
 * Normalize spacing between all frames to ensure constant velocity
 * 
 * @param snapshots - Array of snapshots to normalize
 * @returns Array with equal spacing between consecutive frames
 */
export function normalizeSpacing(snapshots: CameraSnapshot[]): CameraSnapshot[] {
  if (snapshots.length < 2) return snapshots;
  
  // Calculate total path length
  let totalLength = 0;
  const segmentLengths: number[] = [];
  
  for (let i = 0; i < snapshots.length - 1; i++) {
    const posLen = distance3D(snapshots[i].position, snapshots[i + 1].position);
    const tgtLen = distance3D(snapshots[i].target, snapshots[i + 1].target);
    const len = Math.max(posLen, tgtLen); // Use the larger movement
    segmentLengths.push(len);
    totalLength += len;
  }
  
  // Create evenly spaced points
  const numPoints = snapshots.length;
  const targetSpacing = totalLength / (numPoints - 1);
  const result: CameraSnapshot[] = [snapshots[0]]; // Start with first point
  
  let currentDist = 0;
  let segmentIndex = 0;
  
  for (let i = 1; i < numPoints - 1; i++) {
    const targetDist = i * targetSpacing;
    
    // Find which segment we should be in
    while (currentDist + segmentLengths[segmentIndex] < targetDist && segmentIndex < segmentLengths.length - 1) {
      currentDist += segmentLengths[segmentIndex];
      segmentIndex++;
    }
    
    // Calculate position within current segment
    const distIntoSegment = targetDist - currentDist;
    const t = segmentLengths[segmentIndex] > 0 ? distIntoSegment / segmentLengths[segmentIndex] : 0;
    
    const s1 = snapshots[segmentIndex];
    const s2 = snapshots[segmentIndex + 1];
    
    result.push(interpolateSnapshot(s1, s2, t));
  }
  
  result.push(snapshots[snapshots.length - 1]); // End with last point
  
  // Update timestamps to be sequential
  result.forEach((snapshot, index) => {
    snapshot.timestamp = index;
  });
  
  return result;
}
