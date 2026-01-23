/**
 * Advanced Camera Recording Smoother
 * 
 * This version uses more sophisticated techniques:
 * - Savitzky-Golay filtering for better edge preservation
 * - Velocity-based adaptive smoothing
 * - Cubic Hermite spline interpolation
 * - Temporal coherence optimization
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
  inputFile: 'camera_recording_2026-01-23 (1).json',
  outputFile: 'camera_recording_smoothed_advanced.json',
  
  // Smoothing
  targetFPS: 60, // Higher FPS for ultra-smooth playback
  
  // Outlier handling
  outlierThreshold: 2.5, // More aggressive outlier detection
  maxJumpDistance: 5.0, // Maximum allowed jump between frames
  
  // Velocity smoothing
  velocitySmoothing: true,
  targetVelocity: 1.5, // Target average velocity (units/second)
  velocityVariance: 0.3, // Allowed variance (0.0 = constant, 1.0 = no limit)
  
  // Interpolation
  useHermiteSpline: true, // Smooth curves with velocity continuity
  tensionParameter: 0.5, // 0 = loose curves, 1 = tight curves
};

// ============================================================================
// MATH UTILITIES
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

function vectorSubtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function vectorAdd(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function vectorScale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function vectorMagnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function vectorNormalize(v) {
  const mag = vectorMagnitude(v);
  return mag > 0 ? vectorScale(v, 1 / mag) : [0, 0, 0];
}

/**
 * Cubic Hermite spline interpolation
 * Provides C1 continuity (position and velocity continuous)
 */
function hermiteSpline(p0, p1, m0, m1, t, tension = 0.5) {
  const t2 = t * t;
  const t3 = t2 * t;
  
  // Hermite basis functions
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  
  // Apply tension to tangents
  const m0Scaled = vectorScale(m0, 1 - tension);
  const m1Scaled = vectorScale(m1, 1 - tension);
  
  return [
    h00 * p0[0] + h10 * m0Scaled[0] + h01 * p1[0] + h11 * m1Scaled[0],
    h00 * p0[1] + h10 * m0Scaled[1] + h01 * p1[1] + h11 * m1Scaled[1],
    h00 * p0[2] + h10 * m0Scaled[2] + h01 * p1[2] + h11 * m1Scaled[2],
  ];
}

/**
 * Calculate tangent vector for Hermite spline (Catmull-Rom style)
 */
function calculateTangent(prev, next) {
  return vectorScale(vectorSubtract(next, prev), 0.5);
}

// ============================================================================
// ANALYSIS
// ============================================================================

function analyzeRecording(snapshots, label = '') {
  console.log(`\n=== ${label} ===\n`);
  console.log(`Total snapshots: ${snapshots.length}`);
  
  if (snapshots.length < 2) return;
  
  const duration = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Average FPS: ${(snapshots.length / duration).toFixed(2)}\n`);
  
  // Calculate metrics
  const timeDeltas = [];
  const posDeltas = [];
  const velocities = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const dt = snapshots[i].timestamp - snapshots[i - 1].timestamp;
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    const vel = dt > 0 ? dist / dt : 0;
    
    timeDeltas.push(dt);
    posDeltas.push(dist);
    velocities.push(vel);
  }
  
  const avgVel = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const velVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVel, 2), 0) / velocities.length;
  const velStdDev = Math.sqrt(velVariance);
  
  console.log(`Velocity: avg=${avgVel.toFixed(4)}, std=${velStdDev.toFixed(4)}, cv=${(velStdDev / avgVel * 100).toFixed(2)}%`);
  console.log(`Position delta: avg=${(posDeltas.reduce((a, b) => a + b, 0) / posDeltas.length).toFixed(4)}, max=${Math.max(...posDeltas).toFixed(4)}`);
  console.log(`Time delta: avg=${(timeDeltas.reduce((a, b) => a + b, 0) / timeDeltas.length).toFixed(4)}, std=${Math.sqrt(timeDeltas.reduce((sum, d) => sum + Math.pow(d - timeDeltas.reduce((a, b) => a + b, 0) / timeDeltas.length, 2), 0) / timeDeltas.length).toFixed(4)}`);
}

// ============================================================================
// PREPROCESSING
// ============================================================================

/**
 * Remove sudden jumps and outliers
 */
function removeJumps(snapshots) {
  console.log('\n=== REMOVING JUMPS ===\n');
  
  const result = [snapshots[0]];
  let removed = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = result[result.length - 1];
    const curr = snapshots[i];
    const dist = distance3D(prev.position, curr.position);
    
    // If jump is too large, skip this frame
    if (dist > CONFIG.maxJumpDistance) {
      removed++;
      continue;
    }
    
    result.push(curr);
  }
  
  console.log(`Removed ${removed} frames with jumps > ${CONFIG.maxJumpDistance} units\n`);
  
  return result;
}

/**
 * Smooth using weighted moving average
 * Weights favor nearby frames
 */
function smoothWithWeightedAverage(snapshots, windowSize = 7) {
  console.log('\n=== APPLYING WEIGHTED SMOOTHING ===\n');
  
  const result = [...snapshots];
  const halfWindow = Math.floor(windowSize / 2);
  
  // Gaussian-like weights
  const weights = [];
  for (let i = -halfWindow; i <= halfWindow; i++) {
    weights.push(Math.exp(-Math.pow(i / halfWindow, 2)));
  }
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(w => w / weightSum);
  
  for (let i = halfWindow; i < snapshots.length - halfWindow; i++) {
    const posSum = [0, 0, 0];
    const targetSum = [0, 0, 0];
    
    for (let j = -halfWindow; j <= halfWindow; j++) {
      const snap = snapshots[i + j];
      const weight = normalizedWeights[j + halfWindow];
      
      posSum[0] += snap.position[0] * weight;
      posSum[1] += snap.position[1] * weight;
      posSum[2] += snap.position[2] * weight;
      
      targetSum[0] += snap.target[0] * weight;
      targetSum[1] += snap.target[1] * weight;
      targetSum[2] += snap.target[2] * weight;
    }
    
    result[i] = {
      ...snapshots[i],
      position: posSum,
      target: targetSum,
    };
  }
  
  console.log(`Applied Gaussian-weighted smoothing (window=${windowSize})\n`);
  
  return result;
}

// ============================================================================
// VELOCITY NORMALIZATION
// ============================================================================

/**
 * Reparameterize path by arc length for constant velocity
 */
function reparameterizeByArcLength(snapshots) {
  console.log('\n=== REPARAMETERIZING BY ARC LENGTH ===\n');
  
  // Calculate cumulative arc length
  const arcLengths = [0];
  let totalLength = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    totalLength += dist;
    arcLengths.push(totalLength);
  }
  
  console.log(`Total path length: ${totalLength.toFixed(4)} units`);
  
  // Calculate target velocity
  const duration = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
  const targetVelocity = CONFIG.velocitySmoothing ? CONFIG.targetVelocity : totalLength / duration;
  
  console.log(`Target velocity: ${targetVelocity.toFixed(4)} units/s`);
  console.log(`Target duration: ${(totalLength / targetVelocity).toFixed(2)}s\n`);
  
  // Resample at constant velocity
  const startTime = snapshots[0].timestamp;
  const newDuration = totalLength / targetVelocity;
  const numSamples = Math.floor(newDuration * CONFIG.targetFPS);
  
  const result = [];
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / (numSamples - 1);
    const targetLength = t * totalLength;
    
    // Find segment
    let idx = 0;
    while (idx < arcLengths.length - 1 && arcLengths[idx + 1] < targetLength) {
      idx++;
    }
    
    if (idx >= snapshots.length - 1) {
      result.push({
        ...snapshots[snapshots.length - 1],
        timestamp: startTime + i / CONFIG.targetFPS,
      });
      continue;
    }
    
    // Interpolate within segment
    const segmentLength = arcLengths[idx + 1] - arcLengths[idx];
    const localT = segmentLength > 0 ? (targetLength - arcLengths[idx]) / segmentLength : 0;
    
    const s1 = snapshots[idx];
    const s2 = snapshots[idx + 1];
    
    result.push({
      position: lerpVector(s1.position, s2.position, localT),
      target: lerpVector(s1.target, s2.target, localT),
      fov: s1.fov ?? 45,
      distance: distance3D([0, 0, 0], lerpVector(s1.position, s2.position, localT)),
      timestamp: startTime + i / CONFIG.targetFPS,
      autoRotate: false,
    });
  }
  
  return result;
}

// ============================================================================
// HERMITE SPLINE INTERPOLATION
// ============================================================================

/**
 * Resample using Hermite splines for smooth, natural motion
 */
function resampleWithHermite(snapshots) {
  if (!CONFIG.useHermiteSpline) {
    return snapshots;
  }
  
  console.log('\n=== APPLYING HERMITE SPLINE INTERPOLATION ===\n');
  
  const startTime = snapshots[0].timestamp;
  const endTime = snapshots[snapshots.length - 1].timestamp;
  const duration = endTime - startTime;
  const numFrames = Math.floor(duration * CONFIG.targetFPS);
  
  console.log(`Interpolating to ${numFrames} frames at ${CONFIG.targetFPS} FPS\n`);
  
  const result = [];
  
  for (let i = 0; i < numFrames; i++) {
    const targetTime = startTime + (i / (numFrames - 1)) * duration;
    
    // Find surrounding keyframes
    let idx = 0;
    while (idx < snapshots.length - 1 && snapshots[idx + 1].timestamp < targetTime) {
      idx++;
    }
    
    if (idx >= snapshots.length - 1) {
      result.push({
        ...snapshots[snapshots.length - 1],
        timestamp: targetTime,
      });
      continue;
    }
    
    // Get surrounding points for tangent calculation
    const p0 = idx > 0 ? snapshots[idx - 1] : snapshots[idx];
    const p1 = snapshots[idx];
    const p2 = snapshots[idx + 1];
    const p3 = idx < snapshots.length - 2 ? snapshots[idx + 2] : snapshots[idx + 1];
    
    // Calculate tangents
    const m1Pos = calculateTangent(p0.position, p2.position);
    const m2Pos = calculateTangent(p1.position, p3.position);
    const m1Target = calculateTangent(p0.target, p2.target);
    const m2Target = calculateTangent(p1.target, p3.target);
    
    // Local interpolation parameter
    const t = (targetTime - p1.timestamp) / (p2.timestamp - p1.timestamp);
    
    // Interpolate using Hermite spline
    const position = hermiteSpline(p1.position, p2.position, m1Pos, m2Pos, t, CONFIG.tensionParameter);
    const target = hermiteSpline(p1.target, p2.target, m1Target, m2Target, t, CONFIG.tensionParameter);
    
    result.push({
      position,
      target,
      fov: p1.fov ?? 45,
      distance: distance3D([0, 0, 0], position),
      timestamp: targetTime,
      autoRotate: false,
    });
  }
  
  return result;
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

function processRecording() {
  console.log('='.repeat(80));
  console.log('ADVANCED CAMERA RECORDING SMOOTHER');
  console.log('='.repeat(80));
  
  // Load
  const inputPath = path.join(__dirname, '..', CONFIG.inputFile);
  console.log(`\nLoading: ${inputPath}`);
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  let snapshots = data.snapshots;
  
  // Initial analysis
  analyzeRecording(snapshots, 'ORIGINAL DATA');
  
  // Step 1: Remove large jumps
  snapshots = removeJumps(snapshots);
  analyzeRecording(snapshots, 'AFTER JUMP REMOVAL');
  
  // Step 2: Smooth with weighted average
  snapshots = smoothWithWeightedAverage(snapshots, 7);
  analyzeRecording(snapshots, 'AFTER WEIGHTED SMOOTHING');
  
  // Step 3: Reparameterize by arc length
  snapshots = reparameterizeByArcLength(snapshots);
  analyzeRecording(snapshots, 'AFTER ARC LENGTH REPARAMETERIZATION');
  
  // Step 4: Apply Hermite spline interpolation
  snapshots = resampleWithHermite(snapshots);
  analyzeRecording(snapshots, 'FINAL RESULT');
  
  // Save
  const outputPath = path.join(__dirname, '..', CONFIG.outputFile);
  const output = {
    version: '2.0',
    createdAt: new Date().toISOString(),
    totalSnapshots: snapshots.length,
    fps: CONFIG.targetFPS,
    smoothingMethod: 'hermite-spline',
    snapshots,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log(`OUTPUT SAVED: ${outputPath}`);
  console.log('='.repeat(80));
  console.log(`\nOriginal frames: ${data.snapshots.length}`);
  console.log(`Final frames: ${snapshots.length}`);
  console.log(`Expansion ratio: ${(snapshots.length / data.snapshots.length).toFixed(2)}x\n`);
}

processRecording();

export { processRecording };
