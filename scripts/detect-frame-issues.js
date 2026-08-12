/**
 * Frame Issue Detection Tool
 * 
 * Analyzes camera recording data to detect:
 * - Sudden position changes (jarring movements)
 * - Frequent zoom in/out (distance changes)
 * - Target jumps (look-at point changes)
 * - FOV changes (field of view variations)
 * 
 * Outputs a detailed report of problematic frames
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// DETECTION THRESHOLDS
// ============================================================================

const THRESHOLDS = {
  // Position change thresholds (units)
  positionChange: {
    warning: 0.5,    // Noticeable movement
    critical: 1.0,   // Jarring movement
  },
  
  // Distance change thresholds (zoom in/out)
  distanceChange: {
    warning: 0.3,    // Noticeable zoom
    critical: 0.8,   // Jarring zoom
  },
  
  // Target change thresholds (look-at point)
  targetChange: {
    warning: 0.3,    // Noticeable look change
    critical: 0.6,   // Jarring look change
  },
  
  // FOV change thresholds (field of view)
  fovChange: {
    warning: 2,      // Noticeable FOV change
    critical: 5,     // Jarring FOV change
  },
  
  // Velocity thresholds (units per second)
  velocity: {
    warning: 3.0,    // Fast movement
    critical: 5.0,   // Very fast movement
  },
  
  // Acceleration thresholds (units per second squared)
  acceleration: {
    warning: 5.0,    // Noticeable acceleration
    critical: 10.0,  // Jarring acceleration
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function distance3D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateDistance(position) {
  return Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
}

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect sudden position changes between frames
 */
function detectPositionJumps(snapshots) {
  const issues = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    
    const positionDelta = distance3D(prev.position, curr.position);
    
    if (positionDelta > THRESHOLDS.positionChange.critical) {
      issues.push({
        frameIndex: i,
        type: 'position_jump',
        severity: 'critical',
        value: positionDelta,
        threshold: THRESHOLDS.positionChange.critical,
        description: `Sudden position change of ${positionDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevPosition: prev.position,
        currPosition: curr.position,
      });
    } else if (positionDelta > THRESHOLDS.positionChange.warning) {
      issues.push({
        frameIndex: i,
        type: 'position_jump',
        severity: 'warning',
        value: positionDelta,
        threshold: THRESHOLDS.positionChange.warning,
        description: `Noticeable position change of ${positionDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevPosition: prev.position,
        currPosition: curr.position,
      });
    }
  }
  
  return issues;
}

/**
 * Detect frequent zoom in/out (distance changes)
 */
function detectZoomChanges(snapshots) {
  const issues = [];
  const zoomHistory = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    
    const prevDistance = calculateDistance(prev.position);
    const currDistance = calculateDistance(curr.position);
    const distanceDelta = Math.abs(currDistance - prevDistance);
    
    // Track zoom direction
    const zoomDirection = currDistance > prevDistance ? 'out' : 'in';
    zoomHistory.push({ index: i, direction: zoomDirection, delta: distanceDelta });
    
    // Detect sudden zoom changes
    if (distanceDelta > THRESHOLDS.distanceChange.critical) {
      issues.push({
        frameIndex: i,
        type: 'zoom_jump',
        severity: 'critical',
        value: distanceDelta,
        threshold: THRESHOLDS.distanceChange.critical,
        description: `Sudden zoom ${zoomDirection} of ${distanceDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevDistance,
        currDistance,
        zoomDirection,
      });
    } else if (distanceDelta > THRESHOLDS.distanceChange.warning) {
      issues.push({
        frameIndex: i,
        type: 'zoom_jump',
        severity: 'warning',
        value: distanceDelta,
        threshold: THRESHOLDS.distanceChange.warning,
        description: `Noticeable zoom ${zoomDirection} of ${distanceDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevDistance,
        currDistance,
        zoomDirection,
      });
    }
  }
  
  // Detect frequent zoom direction changes (oscillation)
  const oscillations = detectZoomOscillations(zoomHistory);
  issues.push(...oscillations);
  
  return issues;
}

/**
 * Detect zoom oscillations (frequent in/out changes)
 */
function detectZoomOscillations(zoomHistory, windowSize = 10) {
  const issues = [];
  
  for (let i = windowSize; i < zoomHistory.length; i++) {
    const window = zoomHistory.slice(i - windowSize, i);
    
    // Count direction changes
    let directionChanges = 0;
    for (let j = 1; j < window.length; j++) {
      if (window[j].direction !== window[j - 1].direction) {
        directionChanges++;
      }
    }
    
    // If more than 50% of frames change direction, it's oscillating
    if (directionChanges > windowSize * 0.5) {
      issues.push({
        frameIndex: i,
        type: 'zoom_oscillation',
        severity: 'warning',
        value: directionChanges,
        threshold: windowSize * 0.5,
        description: `Frequent zoom oscillation: ${directionChanges} direction changes in ${windowSize} frames`,
        windowStart: i - windowSize,
        windowEnd: i,
      });
    }
  }
  
  return issues;
}

/**
 * Detect sudden target (look-at) changes
 */
function detectTargetJumps(snapshots) {
  const issues = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    
    const targetDelta = distance3D(prev.target, curr.target);
    
    if (targetDelta > THRESHOLDS.targetChange.critical) {
      issues.push({
        frameIndex: i,
        type: 'target_jump',
        severity: 'critical',
        value: targetDelta,
        threshold: THRESHOLDS.targetChange.critical,
        description: `Sudden target change of ${targetDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevTarget: prev.target,
        currTarget: curr.target,
      });
    } else if (targetDelta > THRESHOLDS.targetChange.warning) {
      issues.push({
        frameIndex: i,
        type: 'target_jump',
        severity: 'warning',
        value: targetDelta,
        threshold: THRESHOLDS.targetChange.warning,
        description: `Noticeable target change of ${targetDelta.toFixed(4)} units`,
        prevFrame: i - 1,
        prevTarget: prev.target,
        currTarget: curr.target,
      });
    }
  }
  
  return issues;
}

/**
 * Detect FOV changes
 */
function detectFOVChanges(snapshots) {
  const issues = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    
    const prevFOV = prev.fov ?? 45;
    const currFOV = curr.fov ?? 45;
    const fovDelta = Math.abs(currFOV - prevFOV);
    
    if (fovDelta > THRESHOLDS.fovChange.critical) {
      issues.push({
        frameIndex: i,
        type: 'fov_jump',
        severity: 'critical',
        value: fovDelta,
        threshold: THRESHOLDS.fovChange.critical,
        description: `Sudden FOV change of ${fovDelta.toFixed(2)} degrees`,
        prevFrame: i - 1,
        prevFOV,
        currFOV,
      });
    } else if (fovDelta > THRESHOLDS.fovChange.warning) {
      issues.push({
        frameIndex: i,
        type: 'fov_jump',
        severity: 'warning',
        value: fovDelta,
        threshold: THRESHOLDS.fovChange.warning,
        description: `Noticeable FOV change of ${fovDelta.toFixed(2)} degrees`,
        prevFrame: i - 1,
        prevFOV,
        currFOV,
      });
    }
  }
  
  return issues;
}

/**
 * Detect high velocity (fast movement)
 */
function detectHighVelocity(snapshots) {
  const issues = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    
    const dt = curr.timestamp - prev.timestamp;
    if (dt <= 0) continue;
    
    const distance = distance3D(prev.position, curr.position);
    const velocity = distance / dt;
    
    if (velocity > THRESHOLDS.velocity.critical) {
      issues.push({
        frameIndex: i,
        type: 'high_velocity',
        severity: 'critical',
        value: velocity,
        threshold: THRESHOLDS.velocity.critical,
        description: `Very fast movement: ${velocity.toFixed(2)} units/s`,
        prevFrame: i - 1,
        distance,
        timeDelta: dt,
      });
    } else if (velocity > THRESHOLDS.velocity.warning) {
      issues.push({
        frameIndex: i,
        type: 'high_velocity',
        severity: 'warning',
        value: velocity,
        threshold: THRESHOLDS.velocity.warning,
        description: `Fast movement: ${velocity.toFixed(2)} units/s`,
        prevFrame: i - 1,
        distance,
        timeDelta: dt,
      });
    }
  }
  
  return issues;
}

/**
 * Detect high acceleration (sudden speed changes)
 */
function detectHighAcceleration(snapshots) {
  const issues = [];
  
  // Calculate velocities first
  const velocities = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    const dt = curr.timestamp - prev.timestamp;
    const distance = distance3D(prev.position, curr.position);
    const velocity = dt > 0 ? distance / dt : 0;
    velocities.push(velocity);
  }
  
  // Calculate accelerations
  for (let i = 1; i < velocities.length; i++) {
    const prev = snapshots[i];
    const curr = snapshots[i + 1];
    const dt = curr.timestamp - prev.timestamp;
    if (dt <= 0) continue;
    
    const dv = velocities[i] - velocities[i - 1];
    const acceleration = Math.abs(dv / dt);
    
    if (acceleration > THRESHOLDS.acceleration.critical) {
      issues.push({
        frameIndex: i + 1,
        type: 'high_acceleration',
        severity: 'critical',
        value: acceleration,
        threshold: THRESHOLDS.acceleration.critical,
        description: `Sudden speed change: ${acceleration.toFixed(2)} units/s²`,
        prevFrame: i,
        prevVelocity: velocities[i - 1],
        currVelocity: velocities[i],
      });
    } else if (acceleration > THRESHOLDS.acceleration.warning) {
      issues.push({
        frameIndex: i + 1,
        type: 'high_acceleration',
        severity: 'warning',
        value: acceleration,
        threshold: THRESHOLDS.acceleration.warning,
        description: `Noticeable speed change: ${acceleration.toFixed(2)} units/s²`,
        prevFrame: i,
        prevVelocity: velocities[i - 1],
        currVelocity: velocities[i],
      });
    }
  }
  
  return issues;
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

function analyzeRecording(inputFile) {
  console.log('='.repeat(80));
  console.log('CAMERA RECORDING FRAME ISSUE DETECTION');
  console.log('='.repeat(80));
  console.log('');
  
  // Load data
  const inputPath = path.join(__dirname, '..', inputFile);
  console.log(`Loading: ${inputPath}\n`);
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const snapshots = data.snapshots;
  
  console.log(`Total frames: ${snapshots.length}`);
  console.log(`Duration: ${(snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp).toFixed(2)}s\n`);
  
  // Run all detections
  console.log('Running detections...\n');
  
  const allIssues = [
    ...detectPositionJumps(snapshots),
    ...detectZoomChanges(snapshots),
    ...detectTargetJumps(snapshots),
    ...detectFOVChanges(snapshots),
    ...detectHighVelocity(snapshots),
    ...detectHighAcceleration(snapshots),
  ];
  
  // Sort by frame index
  allIssues.sort((a, b) => a.frameIndex - b.frameIndex);
  
  // Generate statistics
  const stats = {
    totalIssues: allIssues.length,
    criticalIssues: allIssues.filter(i => i.severity === 'critical').length,
    warningIssues: allIssues.filter(i => i.severity === 'warning').length,
    byType: {},
  };
  
  allIssues.forEach(issue => {
    if (!stats.byType[issue.type]) {
      stats.byType[issue.type] = { total: 0, critical: 0, warning: 0 };
    }
    stats.byType[issue.type].total++;
    stats.byType[issue.type][issue.severity]++;
  });
  
  // Print summary
  console.log('='.repeat(80));
  console.log('DETECTION SUMMARY');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Total Issues Found: ${stats.totalIssues}`);
  console.log(`  Critical: ${stats.criticalIssues}`);
  console.log(`  Warning: ${stats.warningIssues}\n`);
  
  console.log('Issues by Type:');
  Object.entries(stats.byType).forEach(([type, counts]) => {
    console.log(`  ${type}: ${counts.total} (${counts.critical} critical, ${counts.warning} warning)`);
  });
  console.log('');
  
  // Show top issues
  const criticalIssues = allIssues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    console.log('Top 10 Critical Issues:');
    criticalIssues.slice(0, 10).forEach((issue, idx) => {
      console.log(`  ${idx + 1}. Frame ${issue.frameIndex}: ${issue.description}`);
    });
    console.log('');
  }
  
  // Save detailed report
  const outputPath = path.join(__dirname, '..', 'frame_issues_report.json');
  const report = {
    metadata: {
      inputFile,
      totalFrames: snapshots.length,
      duration: snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp,
      analyzedAt: new Date().toISOString(),
      thresholds: THRESHOLDS,
    },
    statistics: stats,
    issues: allIssues,
    problematicFrames: [...new Set(allIssues.map(i => i.frameIndex))].sort((a, b) => a - b),
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  
  console.log('='.repeat(80));
  console.log(`DETAILED REPORT SAVED: ${outputPath}`);
  console.log('='.repeat(80));
  console.log('');
  console.log('Next Steps:');
  console.log('  1. Review frame_issues_report.json for detailed analysis');
  console.log('  2. Use the report to identify problem areas');
  console.log('  3. Run smoothing/filtering on problematic frames');
  console.log('  4. Re-analyze to verify improvements\n');
  
  return report;
}

// ============================================================================
// RUN ANALYSIS
// ============================================================================

const inputFile = process.argv[2] || 'camera_recording_2026-01-23 (1).json';
analyzeRecording(inputFile);

export { analyzeRecording, THRESHOLDS };
