/**
 * Frame Issues Fixer
 * 
 * Applies targeted smoothing and filtering to fix detected issues:
 * - Removes/interpolates frames with sudden jumps
 * - Smooths zoom oscillations
 * - Limits velocity and acceleration
 * - Ensures frame-to-frame evenness
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
  issuesFile: 'frame_issues_report.json',
  outputFile: 'camera_recording_fixed.json',
  
  // Fixing strategies
  removeOutliers: true,
  smoothPositions: true,
  smoothZoom: true,
  limitVelocity: true,
  limitAcceleration: true,
  
  // Thresholds (more strict than detection)
  maxPositionJump: 0.8,      // Max allowed position change
  maxZoomJump: 0.5,          // Max allowed distance change
  maxVelocity: 4.0,          // Max allowed velocity
  maxAcceleration: 8.0,      // Max allowed acceleration
  
  // Smoothing parameters
  positionSmoothWindow: 5,   // Frames to average for position
  zoomSmoothWindow: 7,       // Frames to average for zoom
  velocitySmoothWindow: 3,   // Frames to average for velocity
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

function calculateDistance(position) {
  return Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
}

// ============================================================================
// FIXING FUNCTIONS
// ============================================================================

/**
 * Remove frames with critical issues and interpolate
 */
function removeOutlierFrames(snapshots, issues) {
  if (!CONFIG.removeOutliers) return snapshots;
  
  console.log('\n=== REMOVING OUTLIER FRAMES ===\n');
  
  // Find frames with critical issues
  const criticalFrames = new Set(
    issues
      .filter(i => i.severity === 'critical')
      .map(i => i.frameIndex)
  );
  
  console.log(`Frames with critical issues: ${criticalFrames.size}`);
  
  // Remove outliers and interpolate
  const result = [];
  let removed = 0;
  
  for (let i = 0; i < snapshots.length; i++) {
    if (criticalFrames.has(i)) {
      removed++;
      // Skip this frame, will be interpolated
      continue;
    }
    result.push(snapshots[i]);
  }
  
  console.log(`Removed ${removed} outlier frames`);
  console.log(`Remaining frames: ${result.length}\n`);
  
  return result;
}

/**
 * Smooth position changes with moving average
 */
function smoothPositions(snapshots) {
  if (!CONFIG.smoothPositions) return snapshots;
  
  console.log('\n=== SMOOTHING POSITIONS ===\n');
  
  const window = CONFIG.positionSmoothWindow;
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
  
  console.log(`Applied position smoothing (window=${window})\n`);
  
  return result;
}

/**
 * Smooth zoom (distance) changes
 */
function smoothZoom(snapshots) {
  if (!CONFIG.smoothZoom) return snapshots;
  
  console.log('\n=== SMOOTHING ZOOM ===\n');
  
  const window = CONFIG.zoomSmoothWindow;
  const halfWindow = Math.floor(window / 2);
  const result = [...snapshots];
  
  // Calculate distances
  const distances = snapshots.map(s => calculateDistance(s.position));
  
  // Smooth distances
  const smoothedDistances = [...distances];
  for (let i = halfWindow; i < distances.length - halfWindow; i++) {
    let sum = 0;
    for (let j = -halfWindow; j <= halfWindow; j++) {
      sum += distances[i + j];
    }
    smoothedDistances[i] = sum / window;
  }
  
  // Apply smoothed distances while preserving direction
  for (let i = 0; i < snapshots.length; i++) {
    const originalDist = distances[i];
    const smoothedDist = smoothedDistances[i];
    
    if (originalDist > 0) {
      const scale = smoothedDist / originalDist;
      result[i] = {
        ...snapshots[i],
        position: [
          snapshots[i].position[0] * scale,
          snapshots[i].position[1] * scale,
          snapshots[i].position[2] * scale,
        ],
        distance: smoothedDist,
      };
    }
  }
  
  console.log(`Applied zoom smoothing (window=${window})\n`);
  
  return result;
}

/**
 * Limit velocity by adjusting frame spacing
 */
function limitVelocity(snapshots) {
  if (!CONFIG.limitVelocity) return snapshots;
  
  console.log('\n=== LIMITING VELOCITY ===\n');
  
  const result = [snapshots[0]];
  let adjusted = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = result[result.length - 1];
    const curr = snapshots[i];
    
    const dt = curr.timestamp - prev.timestamp;
    if (dt <= 0) {
      result.push(curr);
      continue;
    }
    
    const distance = distance3D(prev.position, curr.position);
    const velocity = distance / dt;
    
    if (velocity > CONFIG.maxVelocity) {
      // Interpolate to limit velocity
      const maxDistance = CONFIG.maxVelocity * dt;
      const t = maxDistance / distance;
      
      result.push({
        ...curr,
        position: lerpVector(prev.position, curr.position, t),
        target: lerpVector(prev.target, curr.target, t),
      });
      
      adjusted++;
    } else {
      result.push(curr);
    }
  }
  
  console.log(`Adjusted ${adjusted} frames to limit velocity\n`);
  
  return result;
}

/**
 * Limit acceleration by smoothing velocity changes
 */
function limitAcceleration(snapshots) {
  if (!CONFIG.limitAcceleration) return snapshots;
  
  console.log('\n=== LIMITING ACCELERATION ===\n');
  
  // Calculate velocities
  const velocities = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    const dt = curr.timestamp - prev.timestamp;
    const distance = distance3D(prev.position, curr.position);
    const velocity = dt > 0 ? distance / dt : 0;
    velocities.push(velocity);
  }
  
  // Smooth velocities
  const window = CONFIG.velocitySmoothWindow;
  const halfWindow = Math.floor(window / 2);
  const smoothedVelocities = [...velocities];
  
  for (let i = halfWindow; i < velocities.length - halfWindow; i++) {
    let sum = 0;
    for (let j = -halfWindow; j <= halfWindow; j++) {
      sum += velocities[i + j];
    }
    smoothedVelocities[i] = sum / window;
  }
  
  // Apply smoothed velocities
  const result = [snapshots[0]];
  let adjusted = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = result[result.length - 1];
    const curr = snapshots[i];
    const dt = curr.timestamp - prev.timestamp;
    
    if (dt <= 0) {
      result.push(curr);
      continue;
    }
    
    const targetVelocity = smoothedVelocities[i - 1];
    const currentDistance = distance3D(prev.position, curr.position);
    const currentVelocity = currentDistance / dt;
    
    if (Math.abs(currentVelocity - targetVelocity) / targetVelocity > 0.3) {
      // Adjust to match target velocity
      const targetDistance = targetVelocity * dt;
      const t = currentDistance > 0 ? targetDistance / currentDistance : 0;
      
      result.push({
        ...curr,
        position: lerpVector(prev.position, curr.position, Math.min(t, 1)),
        target: lerpVector(prev.target, curr.target, Math.min(t, 1)),
      });
      
      adjusted++;
    } else {
      result.push(curr);
    }
  }
  
  console.log(`Adjusted ${adjusted} frames to limit acceleration\n`);
  
  return result;
}

/**
 * Ensure frame-to-frame evenness
 */
function enforceEvenness(snapshots) {
  console.log('\n=== ENFORCING FRAME-TO-FRAME EVENNESS ===\n');
  
  const result = [snapshots[0]];
  let adjusted = 0;
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = result[result.length - 1];
    const curr = snapshots[i];
    
    // Check position change
    const posDelta = distance3D(prev.position, curr.position);
    if (posDelta > CONFIG.maxPositionJump) {
      // Interpolate to limit jump
      const t = CONFIG.maxPositionJump / posDelta;
      result.push({
        ...curr,
        position: lerpVector(prev.position, curr.position, t),
        target: lerpVector(prev.target, curr.target, t),
      });
      adjusted++;
      continue;
    }
    
    // Check zoom change
    const prevDist = calculateDistance(prev.position);
    const currDist = calculateDistance(curr.position);
    const zoomDelta = Math.abs(currDist - prevDist);
    
    if (zoomDelta > CONFIG.maxZoomJump) {
      // Adjust to limit zoom
      const targetDist = prevDist + Math.sign(currDist - prevDist) * CONFIG.maxZoomJump;
      const scale = targetDist / currDist;
      
      result.push({
        ...curr,
        position: [
          curr.position[0] * scale,
          curr.position[1] * scale,
          curr.position[2] * scale,
        ],
        distance: targetDist,
      });
      adjusted++;
      continue;
    }
    
    result.push(curr);
  }
  
  console.log(`Adjusted ${adjusted} frames to enforce evenness\n`);
  
  return result;
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

function fixRecording() {
  console.log('='.repeat(80));
  console.log('FRAME ISSUES FIXER');
  console.log('='.repeat(80));
  console.log('');
  
  // Load input
  const inputPath = path.join(__dirname, '..', CONFIG.inputFile);
  const issuesPath = path.join(__dirname, '..', CONFIG.issuesFile);
  
  console.log(`Loading: ${inputPath}`);
  console.log(`Issues: ${issuesPath}\n`);
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const issuesReport = JSON.parse(fs.readFileSync(issuesPath, 'utf8'));
  
  let snapshots = data.snapshots;
  
  console.log(`Original frames: ${snapshots.length}`);
  console.log(`Original issues: ${issuesReport.statistics.totalIssues}\n`);
  
  // Apply fixes in order
  snapshots = removeOutlierFrames(snapshots, issuesReport.issues);
  snapshots = smoothPositions(snapshots);
  snapshots = smoothZoom(snapshots);
  snapshots = enforceEvenness(snapshots);
  snapshots = limitVelocity(snapshots);
  snapshots = limitAcceleration(snapshots);
  
  // Normalize timestamps
  console.log('\n=== NORMALIZING TIMESTAMPS ===\n');
  const targetFPS = 60;
  snapshots = snapshots.map((snapshot, index) => ({
    ...snapshot,
    timestamp: index / targetFPS,
  }));
  
  const duration = snapshots[snapshots.length - 1].timestamp;
  console.log(`Final frames: ${snapshots.length}`);
  console.log(`Final duration: ${duration.toFixed(2)}s at ${targetFPS} FPS\n`);
  
  // Save output
  const outputPath = path.join(__dirname, '..', CONFIG.outputFile);
  const output = {
    version: '2.2',
    createdAt: new Date().toISOString(),
    totalSnapshots: snapshots.length,
    fps: targetFPS,
    fixesApplied: {
      outlierRemoval: CONFIG.removeOutliers,
      positionSmoothing: CONFIG.smoothPositions,
      zoomSmoothing: CONFIG.smoothZoom,
      velocityLimiting: CONFIG.limitVelocity,
      accelerationLimiting: CONFIG.limitAcceleration,
    },
    thresholds: {
      maxPositionJump: CONFIG.maxPositionJump,
      maxZoomJump: CONFIG.maxZoomJump,
      maxVelocity: CONFIG.maxVelocity,
      maxAcceleration: CONFIG.maxAcceleration,
    },
    snapshots,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('='.repeat(80));
  console.log(`OUTPUT SAVED: ${outputPath}`);
  console.log('='.repeat(80));
  console.log(`\nOriginal frames: ${data.snapshots.length}`);
  console.log(`Fixed frames: ${snapshots.length}`);
  console.log(`Reduction: ${((1 - snapshots.length / data.snapshots.length) * 100).toFixed(2)}%\n`);
  console.log('Next Steps:');
  console.log('  1. Run detection on fixed file to verify improvements');
  console.log('  2. node scripts/detect-frame-issues.js camera_recording_fixed.json');
  console.log('  3. Compare before/after issue counts\n');
}

fixRecording();
