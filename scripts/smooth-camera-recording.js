/**
 * Camera Recording Smoother
 * 
 * This script analyzes and smooths camera recording data to ensure:
 * 1. Even temporal spacing between frames
 * 2. Smooth spatial transitions (position and target)
 * 3. Removal of outliers and sudden jumps
 * 4. Consistent velocity across all axes
 * 5. Optional resampling to target frame rate
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
  // Input/Output
  inputFile: 'camera_recording_2026-01-23 (1).json',
  outputFile: 'camera_recording_smoothed.json',
  
  // Smoothing parameters
  targetFPS: 30, // Target frames per second for output
  smoothingWindow: 5, // Moving average window size (odd number recommended)
  
  // Outlier detection
  outlierThreshold: 3.0, // Standard deviations for outlier detection
  maxVelocity: 10.0, // Maximum allowed velocity (units per second)
  
  // Interpolation
  interpolationMethod: 'catmullRom', // 'linear', 'catmullRom', 'cubic'
  
  // Filters
  removeOutliers: true,
  applyMovingAverage: true,
  normalizeVelocity: true,
  resampleToFPS: true,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate 3D distance between two points
 */
function distance3D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Vector lerp
 */
function lerpVector(v1, v2, t) {
  return [
    lerp(v1[0], v2[0], t),
    lerp(v1[1], v2[1], t),
    lerp(v1[2], v2[2], t),
  ];
}

/**
 * Catmull-Rom spline interpolation
 * Provides smooth curves through points
 */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  
  return [
    0.5 * ((2 * p1[0]) +
           (-p0[0] + p2[0]) * t +
           (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
           (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * ((2 * p1[1]) +
           (-p0[1] + p2[1]) * t +
           (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
           (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    0.5 * ((2 * p1[2]) +
           (-p0[2] + p2[2]) * t +
           (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 +
           (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3),
  ];
}

/**
 * Calculate statistics for an array of numbers
 */
function calculateStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev,
    coefficientOfVariation: (stdDev / mean) * 100,
  };
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze the raw camera recording data
 */
function analyzeRecording(snapshots) {
  console.log('\n=== ANALYZING CAMERA RECORDING ===\n');
  console.log(`Total snapshots: ${snapshots.length}`);
  console.log(`Duration: ${(snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp).toFixed(2)} seconds\n`);
  
  // Time deltas
  const timeDeltas = [];
  for (let i = 1; i < snapshots.length; i++) {
    timeDeltas.push(snapshots[i].timestamp - snapshots[i - 1].timestamp);
  }
  
  const timeStats = calculateStats(timeDeltas);
  console.log('Time Delta Statistics:');
  console.log(`  Average: ${timeStats.mean.toFixed(4)}s`);
  console.log(`  Median: ${timeStats.median.toFixed(4)}s`);
  console.log(`  Range: ${timeStats.min.toFixed(4)}s - ${timeStats.max.toFixed(4)}s`);
  console.log(`  Std Dev: ${timeStats.stdDev.toFixed(4)}s`);
  console.log(`  CV: ${timeStats.coefficientOfVariation.toFixed(2)}%\n`);
  
  // Position movement
  const positionDeltas = [];
  const velocities = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    const timeDelta = snapshots[i].timestamp - snapshots[i - 1].timestamp;
    const velocity = timeDelta > 0 ? dist / timeDelta : 0;
    
    positionDeltas.push(dist);
    velocities.push(velocity);
  }
  
  const posStats = calculateStats(positionDeltas);
  const velStats = calculateStats(velocities);
  
  console.log('Position Movement Statistics:');
  console.log(`  Average: ${posStats.mean.toFixed(4)} units`);
  console.log(`  Median: ${posStats.median.toFixed(4)} units`);
  console.log(`  Range: ${posStats.min.toFixed(4)} - ${posStats.max.toFixed(4)} units`);
  console.log(`  Std Dev: ${posStats.stdDev.toFixed(4)} units`);
  console.log(`  CV: ${posStats.coefficientOfVariation.toFixed(2)}%\n`);
  
  console.log('Velocity Statistics:');
  console.log(`  Average: ${velStats.mean.toFixed(4)} units/s`);
  console.log(`  Median: ${velStats.median.toFixed(4)} units/s`);
  console.log(`  Range: ${velStats.min.toFixed(4)} - ${velStats.max.toFixed(4)} units/s`);
  console.log(`  Std Dev: ${velStats.stdDev.toFixed(4)} units/s`);
  console.log(`  CV: ${velStats.coefficientOfVariation.toFixed(2)}%\n`);
  
  // Detect outliers
  const outlierThreshold = posStats.mean + CONFIG.outlierThreshold * posStats.stdDev;
  const outliers = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const dist = positionDeltas[i - 1];
    if (dist > outlierThreshold) {
      outliers.push({
        index: i,
        distance: dist,
        velocity: velocities[i - 1],
        timeDelta: timeDeltas[i - 1],
      });
    }
  }
  
  console.log(`Outliers detected (>${CONFIG.outlierThreshold} std dev): ${outliers.length}`);
  if (outliers.length > 0) {
    console.log('First 5 outliers:');
    outliers.slice(0, 5).forEach(o => {
      console.log(`  Frame ${o.index}: dist=${o.distance.toFixed(4)}, vel=${o.velocity.toFixed(4)}, dt=${o.timeDelta.toFixed(4)}`);
    });
  }
  
  return {
    timeStats,
    posStats,
    velStats,
    outliers,
  };
}

// ============================================================================
// SMOOTHING FUNCTIONS
// ============================================================================

/**
 * Remove outliers by replacing them with interpolated values
 */
function removeOutliers(snapshots, analysis) {
  if (!CONFIG.removeOutliers || analysis.outliers.length === 0) {
    return snapshots;
  }
  
  console.log('\n=== REMOVING OUTLIERS ===\n');
  
  const result = [...snapshots];
  const outlierIndices = new Set(analysis.outliers.map(o => o.index));
  
  // Replace outliers with interpolated values
  for (const outlier of analysis.outliers) {
    const idx = outlier.index;
    
    // Find nearest non-outlier frames
    let prevIdx = idx - 1;
    let nextIdx = idx + 1;
    
    while (prevIdx > 0 && outlierIndices.has(prevIdx)) prevIdx--;
    while (nextIdx < snapshots.length && outlierIndices.has(nextIdx)) nextIdx++;
    
    if (prevIdx >= 0 && nextIdx < snapshots.length) {
      const prev = snapshots[prevIdx];
      const next = snapshots[nextIdx];
      const t = (snapshots[idx].timestamp - prev.timestamp) / (next.timestamp - prev.timestamp);
      
      result[idx] = {
        ...snapshots[idx],
        position: lerpVector(prev.position, next.position, t),
        target: lerpVector(prev.target, next.target, t),
      };
    }
  }
  
  console.log(`Replaced ${analysis.outliers.length} outlier frames with interpolated values\n`);
  
  return result;
}

/**
 * Apply moving average smoothing
 */
function applyMovingAverage(snapshots) {
  if (!CONFIG.applyMovingAverage) {
    return snapshots;
  }
  
  console.log('\n=== APPLYING MOVING AVERAGE SMOOTHING ===\n');
  
  const window = CONFIG.smoothingWindow;
  const halfWindow = Math.floor(window / 2);
  const result = [...snapshots];
  
  for (let i = halfWindow; i < snapshots.length - halfWindow; i++) {
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
  
  console.log(`Applied moving average with window size ${window}\n`);
  
  return result;
}

/**
 * Resample to constant frame rate
 */
function resampleToFPS(snapshots) {
  if (!CONFIG.resampleToFPS) {
    return snapshots;
  }
  
  console.log('\n=== RESAMPLING TO CONSTANT FRAME RATE ===\n');
  
  const startTime = snapshots[0].timestamp;
  const endTime = snapshots[snapshots.length - 1].timestamp;
  const duration = endTime - startTime;
  const frameDuration = 1.0 / CONFIG.targetFPS;
  const numFrames = Math.floor(duration / frameDuration) + 1;
  
  console.log(`Target FPS: ${CONFIG.targetFPS}`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Output frames: ${numFrames}\n`);
  
  const result = [];
  
  for (let i = 0; i < numFrames; i++) {
    const targetTime = startTime + i * frameDuration;
    
    // Find surrounding frames
    let idx = 0;
    while (idx < snapshots.length - 1 && snapshots[idx + 1].timestamp < targetTime) {
      idx++;
    }
    
    if (idx >= snapshots.length - 1) {
      result.push({ ...snapshots[snapshots.length - 1], timestamp: targetTime });
      continue;
    }
    
    // Interpolate based on method
    const s1 = snapshots[idx];
    const s2 = snapshots[idx + 1];
    const t = (targetTime - s1.timestamp) / (s2.timestamp - s1.timestamp);
    
    let position, target;
    
    if (CONFIG.interpolationMethod === 'catmullRom' && idx > 0 && idx < snapshots.length - 2) {
      const s0 = snapshots[idx - 1];
      const s3 = snapshots[idx + 2];
      position = catmullRom(s0.position, s1.position, s2.position, s3.position, t);
      target = catmullRom(s0.target, s1.target, s2.target, s3.target, t);
    } else {
      position = lerpVector(s1.position, s2.position, t);
      target = lerpVector(s1.target, s2.target, t);
    }
    
    result.push({
      position,
      target,
      fov: s1.fov ?? 45,
      distance: distance3D([0, 0, 0], position),
      timestamp: targetTime,
      autoRotate: false,
    });
  }
  
  return result;
}

/**
 * Normalize velocity to ensure smooth, consistent movement
 */
function normalizeVelocity(snapshots) {
  if (!CONFIG.normalizeVelocity || snapshots.length < 2) {
    return snapshots;
  }
  
  console.log('\n=== NORMALIZING VELOCITY ===\n');
  
  // Calculate cumulative path length
  const pathLengths = [0];
  let totalLength = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    totalLength += dist;
    pathLengths.push(totalLength);
  }
  
  console.log(`Total path length: ${totalLength.toFixed(4)} units\n`);
  
  // Create evenly spaced samples along the path
  const result = [];
  const targetSpacing = totalLength / (snapshots.length - 1);
  
  for (let i = 0; i < snapshots.length; i++) {
    const targetLength = i * targetSpacing;
    
    // Find segment
    let idx = 0;
    while (idx < pathLengths.length - 1 && pathLengths[idx + 1] < targetLength) {
      idx++;
    }
    
    if (idx >= snapshots.length - 1) {
      result.push(snapshots[snapshots.length - 1]);
      continue;
    }
    
    // Interpolate within segment
    const segmentLength = pathLengths[idx + 1] - pathLengths[idx];
    const t = segmentLength > 0 ? (targetLength - pathLengths[idx]) / segmentLength : 0;
    
    const s1 = snapshots[idx];
    const s2 = snapshots[idx + 1];
    
    result.push({
      position: lerpVector(s1.position, s2.position, t),
      target: lerpVector(s1.target, s2.target, t),
      fov: s1.fov ?? 45,
      distance: distance3D([0, 0, 0], lerpVector(s1.position, s2.position, t)),
      timestamp: lerp(s1.timestamp, s2.timestamp, t),
      autoRotate: false,
    });
  }
  
  return result;
}

// ============================================================================
// MAIN PROCESSING PIPELINE
// ============================================================================

function processRecording() {
  console.log('='.repeat(80));
  console.log('CAMERA RECORDING SMOOTHER');
  console.log('='.repeat(80));
  
  // Load input file
  const inputPath = path.join(__dirname, '..', CONFIG.inputFile);
  console.log(`\nLoading: ${inputPath}`);
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  let snapshots = data.snapshots;
  
  // Step 1: Analyze
  const analysis = analyzeRecording(snapshots);
  
  // Step 2: Remove outliers
  snapshots = removeOutliers(snapshots, analysis);
  
  // Step 3: Apply moving average
  snapshots = applyMovingAverage(snapshots);
  
  // Step 4: Normalize velocity
  snapshots = normalizeVelocity(snapshots);
  
  // Step 5: Resample to constant FPS
  snapshots = resampleToFPS(snapshots);
  
  // Final analysis
  console.log('\n=== FINAL ANALYSIS ===\n');
  analyzeRecording(snapshots);
  
  // Save output
  const outputPath = path.join(__dirname, '..', CONFIG.outputFile);
  const output = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    totalSnapshots: snapshots.length,
    fps: CONFIG.targetFPS,
    smoothingApplied: {
      outlierRemoval: CONFIG.removeOutliers,
      movingAverage: CONFIG.applyMovingAverage,
      velocityNormalization: CONFIG.normalizeVelocity,
      fpsResampling: CONFIG.resampleToFPS,
    },
    snapshots,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('\n='.repeat(80));
  console.log(`OUTPUT SAVED: ${outputPath}`);
  console.log('='.repeat(80));
  console.log(`\nOriginal frames: ${data.snapshots.length}`);
  console.log(`Smoothed frames: ${snapshots.length}`);
  console.log(`Compression ratio: ${(snapshots.length / data.snapshots.length * 100).toFixed(2)}%\n`);
}

// Run the script
processRecording();

export { processRecording };
