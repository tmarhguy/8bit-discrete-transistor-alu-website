/**
 * Optimize Playback Speed
 * 
 * Reduces intermediate frames to speed up playback while preserving
 * start and end frames for smooth transitions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  inputFile: 'camera_recording_smoothed_advanced.json',
  outputFile: 'camera_recording_optimized.json',
  
  // Frame reduction strategy
  keepStartFrames: 60,        // Keep first 60 frames (1 second at 60 FPS)
  keepEndFrames: 60,          // Keep last 60 frames (1 second at 60 FPS)
  middleReductionFactor: 2,   // Keep every Nth frame in middle (2 = half speed, 3 = third speed)
  
  // Smoothing after reduction
  applySmoothing: true,
  smoothingWindow: 3,
};

// ============================================================================
// UTILITIES
// ============================================================================

function distance3D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpVector(v1, v2, t) {
  return [
    lerp(v1[0], v2[0], t),
    lerp(v1[1], v2[1], t),
    lerp(v1[2], v2[2], t),
  ];
}

// ============================================================================
// FRAME REDUCTION
// ============================================================================

function reduceFrames(snapshots) {
  console.log('\n=== REDUCING FRAMES ===\n');
  console.log(`Original frame count: ${snapshots.length}`);
  console.log(`Strategy:`);
  console.log(`  - Keep first ${CONFIG.keepStartFrames} frames (start)`);
  console.log(`  - Keep last ${CONFIG.keepEndFrames} frames (end)`);
  console.log(`  - Keep every ${CONFIG.middleReductionFactor} frame in middle\n`);
  
  if (snapshots.length <= CONFIG.keepStartFrames + CONFIG.keepEndFrames) {
    console.log('Recording too short, keeping all frames');
    return snapshots;
  }
  
  const result = [];
  
  // Keep start frames
  for (let i = 0; i < CONFIG.keepStartFrames && i < snapshots.length; i++) {
    result.push(snapshots[i]);
  }
  
  // Reduce middle frames
  const middleStart = CONFIG.keepStartFrames;
  const middleEnd = snapshots.length - CONFIG.keepEndFrames;
  
  for (let i = middleStart; i < middleEnd; i += CONFIG.middleReductionFactor) {
    result.push(snapshots[i]);
  }
  
  // Keep end frames
  for (let i = Math.max(middleEnd, CONFIG.keepStartFrames); i < snapshots.length; i++) {
    result.push(snapshots[i]);
  }
  
  console.log(`Reduced frame count: ${result.length}`);
  console.log(`Reduction: ${((1 - result.length / snapshots.length) * 100).toFixed(2)}%`);
  console.log(`Speed increase: ${(snapshots.length / result.length).toFixed(2)}x\n`);
  
  return result;
}

// ============================================================================
// SMOOTH TRANSITIONS
// ============================================================================

function smoothTransitions(snapshots) {
  if (!CONFIG.applySmoothing) {
    return snapshots;
  }
  
  console.log('\n=== SMOOTHING TRANSITIONS ===\n');
  
  const window = CONFIG.smoothingWindow;
  const halfWindow = Math.floor(window / 2);
  const result = [...snapshots];
  
  // Only smooth the middle section (not start/end)
  const smoothStart = CONFIG.keepStartFrames;
  const smoothEnd = snapshots.length - CONFIG.keepEndFrames;
  
  for (let i = smoothStart + halfWindow; i < smoothEnd - halfWindow; i++) {
    const posSum = [0, 0, 0];
    const targetSum = [0, 0, 0];
    
    for (let j = -halfWindow; j <= halfWindow; j++) {
      const snap = snapshots[i + j];
      posSum[0] += snap.position[0];
      posSum[1] += snap.position[1];
      posSum[2] += snap.position[2];
      targetSum[0] += snap.target[0];
      targetSum[1] += snap.target[1];
      targetSum[2] += snap.target[2];
    }
    
    result[i] = {
      ...snapshots[i],
      position: [posSum[0] / window, posSum[1] / window, posSum[2] / window],
      target: [targetSum[0] / window, targetSum[1] / window, targetSum[2] / window],
    };
  }
  
  console.log(`Applied smoothing with window size ${window}\n`);
  
  return result;
}

// ============================================================================
// NORMALIZE TIMING
// ============================================================================

function normalizeTimestamps(snapshots) {
  console.log('\n=== NORMALIZING TIMESTAMPS ===\n');
  
  const targetFPS = 60;
  const frameDuration = 1 / targetFPS;
  
  const result = snapshots.map((snapshot, index) => ({
    ...snapshot,
    timestamp: index * frameDuration,
  }));
  
  const duration = result[result.length - 1].timestamp;
  console.log(`Duration: ${duration.toFixed(2)}s at ${targetFPS} FPS\n`);
  
  return result;
}

// ============================================================================
// ANALYSIS
// ============================================================================

function analyzeRecording(snapshots, label) {
  console.log(`=== ${label} ===\n`);
  console.log(`Frames: ${snapshots.length}`);
  
  if (snapshots.length < 2) return;
  
  const duration = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`FPS: ${(snapshots.length / duration).toFixed(2)}\n`);
  
  // Calculate velocity stats
  const velocities = [];
  for (let i = 1; i < snapshots.length; i++) {
    const dt = snapshots[i].timestamp - snapshots[i - 1].timestamp;
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    const vel = dt > 0 ? dist / dt : 0;
    velocities.push(vel);
  }
  
  const avgVel = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const velVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVel, 2), 0) / velocities.length;
  const velStdDev = Math.sqrt(velVariance);
  
  console.log(`Velocity: avg=${avgVel.toFixed(4)}, std=${velStdDev.toFixed(4)}, cv=${(velStdDev / avgVel * 100).toFixed(2)}%\n`);
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log('='.repeat(80));
  console.log('PLAYBACK SPEED OPTIMIZER');
  console.log('='.repeat(80));
  
  // Load input
  const inputPath = path.join(__dirname, '..', CONFIG.inputFile);
  console.log(`\nLoading: ${inputPath}\n`);
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  let snapshots = data.snapshots;
  
  // Initial analysis
  analyzeRecording(snapshots, 'ORIGINAL');
  
  // Reduce frames
  snapshots = reduceFrames(snapshots);
  
  // Smooth transitions
  snapshots = smoothTransitions(snapshots);
  
  // Normalize timestamps
  snapshots = normalizeTimestamps(snapshots);
  
  // Final analysis
  analyzeRecording(snapshots, 'OPTIMIZED');
  
  // Save output
  const outputPath = path.join(__dirname, '..', CONFIG.outputFile);
  const output = {
    version: '2.1',
    createdAt: new Date().toISOString(),
    totalSnapshots: snapshots.length,
    fps: 60,
    optimizations: {
      frameReduction: true,
      keepStartFrames: CONFIG.keepStartFrames,
      keepEndFrames: CONFIG.keepEndFrames,
      reductionFactor: CONFIG.middleReductionFactor,
      smoothing: CONFIG.applySmoothing,
    },
    snapshots,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('='.repeat(80));
  console.log(`OUTPUT SAVED: ${outputPath}`);
  console.log('='.repeat(80));
  console.log(`\nOriginal frames: ${data.snapshots.length}`);
  console.log(`Optimized frames: ${snapshots.length}`);
  console.log(`Reduction: ${((1 - snapshots.length / data.snapshots.length) * 100).toFixed(2)}%`);
  console.log(`Speed increase: ${(data.snapshots.length / snapshots.length).toFixed(2)}x\n`);
}

main();
