/**
 * Camera Recording Visualization
 * 
 * Generates comparison charts and statistics for camera recordings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// UTILITIES
// ============================================================================

function distance3D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateMetrics(snapshots) {
  const metrics = {
    frameCount: snapshots.length,
    duration: snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp,
    timeDeltas: [],
    positionDeltas: [],
    velocities: [],
    accelerations: [],
  };
  
  // Calculate deltas
  for (let i = 1; i < snapshots.length; i++) {
    const dt = snapshots[i].timestamp - snapshots[i - 1].timestamp;
    const dist = distance3D(snapshots[i - 1].position, snapshots[i].position);
    const vel = dt > 0 ? dist / dt : 0;
    
    metrics.timeDeltas.push(dt);
    metrics.positionDeltas.push(dist);
    metrics.velocities.push(vel);
  }
  
  // Calculate accelerations
  for (let i = 1; i < metrics.velocities.length; i++) {
    const dv = metrics.velocities[i] - metrics.velocities[i - 1];
    const dt = metrics.timeDeltas[i];
    const acc = dt > 0 ? dv / dt : 0;
    metrics.accelerations.push(acc);
  }
  
  return metrics;
}

function calculateStats(values) {
  if (values.length === 0) return null;
  
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
    cv: mean !== 0 ? (stdDev / mean) * 100 : 0,
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}

// ============================================================================
// ASCII CHART GENERATION
// ============================================================================

function generateHistogram(values, bins = 40, width = 60) {
  const stats = calculateStats(values);
  const min = stats.min;
  const max = stats.max;
  const range = max - min;
  const binSize = range / bins;
  
  // Create bins
  const histogram = new Array(bins).fill(0);
  for (const value of values) {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
    histogram[binIndex]++;
  }
  
  // Find max count for scaling
  const maxCount = Math.max(...histogram);
  
  // Generate ASCII chart
  const lines = [];
  lines.push('Distribution:');
  lines.push('─'.repeat(width + 10));
  
  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    const count = histogram[i];
    const barLength = Math.round((count / maxCount) * width);
    const bar = '█'.repeat(barLength);
    
    if (count > 0) {
      lines.push(`${binStart.toFixed(2).padStart(7)} │${bar} ${count}`);
    }
  }
  
  lines.push('─'.repeat(width + 10));
  
  return lines.join('\n');
}

function generateTimeSeries(values, width = 80, height = 20, label = 'Value') {
  if (values.length === 0) return '';
  
  const stats = calculateStats(values);
  const min = stats.min;
  const max = stats.max;
  const range = max - min;
  
  // Sample points if too many
  const maxPoints = width;
  const step = Math.max(1, Math.floor(values.length / maxPoints));
  const sampledValues = [];
  for (let i = 0; i < values.length; i += step) {
    sampledValues.push(values[i]);
  }
  
  // Create 2D grid
  const grid = Array(height).fill(null).map(() => Array(width).fill(' '));
  
  // Plot points
  for (let i = 0; i < sampledValues.length && i < width; i++) {
    const value = sampledValues[i];
    const y = range > 0 ? Math.floor(((value - min) / range) * (height - 1)) : Math.floor(height / 2);
    const row = height - 1 - y;
    grid[row][i] = '●';
  }
  
  // Generate output
  const lines = [];
  lines.push(`\n${label} over time:`);
  lines.push('┌' + '─'.repeat(width) + '┐');
  
  for (let row = 0; row < height; row++) {
    const value = max - (row / (height - 1)) * range;
    const valueStr = value.toFixed(2).padStart(7);
    lines.push(`│${grid[row].join('')}│ ${row === 0 ? valueStr : row === height - 1 ? valueStr : ''}`);
  }
  
  lines.push('└' + '─'.repeat(width) + '┘');
  lines.push(`  ${' '.repeat(Math.floor(width / 2) - 5)}Frame Index`);
  
  return lines.join('\n');
}

// ============================================================================
// COMPARISON REPORT
// ============================================================================

function generateComparisonReport(recordings) {
  const report = [];
  
  report.push('═'.repeat(80));
  report.push('CAMERA RECORDING COMPARISON REPORT');
  report.push('═'.repeat(80));
  report.push('');
  
  // Calculate metrics for each recording
  const allMetrics = recordings.map(rec => ({
    name: rec.name,
    metrics: calculateMetrics(rec.snapshots),
  }));
  
  // Summary table
  report.push('SUMMARY');
  report.push('─'.repeat(80));
  report.push('');
  
  const headers = ['Metric', ...recordings.map(r => r.name)];
  const colWidth = 20;
  report.push(headers.map(h => h.padEnd(colWidth)).join(''));
  report.push('─'.repeat(colWidth * headers.length));
  
  // Frame count
  report.push(['Frames', ...allMetrics.map(m => m.metrics.frameCount.toString())].map(v => v.padEnd(colWidth)).join(''));
  
  // Duration
  report.push(['Duration (s)', ...allMetrics.map(m => m.metrics.duration.toFixed(2))].map(v => v.padEnd(colWidth)).join(''));
  
  // FPS
  report.push(['Avg FPS', ...allMetrics.map(m => (m.metrics.frameCount / m.metrics.duration).toFixed(2))].map(v => v.padEnd(colWidth)).join(''));
  
  report.push('');
  
  // Velocity statistics
  report.push('VELOCITY STATISTICS');
  report.push('─'.repeat(80));
  report.push('');
  
  for (const { name, metrics } of allMetrics) {
    const velStats = calculateStats(metrics.velocities);
    
    report.push(`${name}:`);
    report.push(`  Mean:   ${velStats.mean.toFixed(4)} units/s`);
    report.push(`  Median: ${velStats.median.toFixed(4)} units/s`);
    report.push(`  Std Dev: ${velStats.stdDev.toFixed(4)} units/s`);
    report.push(`  CV:     ${velStats.cv.toFixed(2)}%`);
    report.push(`  Range:  ${velStats.min.toFixed(4)} - ${velStats.max.toFixed(4)} units/s`);
    report.push(`  P95:    ${velStats.p95.toFixed(4)} units/s`);
    report.push('');
  }
  
  // Time delta statistics
  report.push('TIME DELTA STATISTICS');
  report.push('─'.repeat(80));
  report.push('');
  
  for (const { name, metrics } of allMetrics) {
    const timeStats = calculateStats(metrics.timeDeltas);
    
    report.push(`${name}:`);
    report.push(`  Mean:   ${timeStats.mean.toFixed(4)} s`);
    report.push(`  Std Dev: ${timeStats.stdDev.toFixed(4)} s`);
    report.push(`  CV:     ${timeStats.cv.toFixed(2)}%`);
    report.push(`  Range:  ${timeStats.min.toFixed(4)} - ${timeStats.max.toFixed(4)} s`);
    report.push('');
  }
  
  // Visualizations
  report.push('═'.repeat(80));
  report.push('VELOCITY DISTRIBUTIONS');
  report.push('═'.repeat(80));
  
  for (const { name, metrics } of allMetrics) {
    report.push('');
    report.push(`${name}:`);
    report.push(generateHistogram(metrics.velocities, 30, 50));
  }
  
  report.push('');
  report.push('═'.repeat(80));
  report.push('VELOCITY OVER TIME');
  report.push('═'.repeat(80));
  
  for (const { name, metrics } of allMetrics) {
    // Sample for visualization
    const sampleRate = Math.max(1, Math.floor(metrics.velocities.length / 200));
    const sampledVelocities = metrics.velocities.filter((_, i) => i % sampleRate === 0);
    report.push(generateTimeSeries(sampledVelocities, 70, 15, name));
  }
  
  // Improvement metrics
  if (allMetrics.length > 1) {
    report.push('');
    report.push('═'.repeat(80));
    report.push('IMPROVEMENT ANALYSIS');
    report.push('═'.repeat(80));
    report.push('');
    
    const originalVelStats = calculateStats(allMetrics[0].metrics.velocities);
    
    for (let i = 1; i < allMetrics.length; i++) {
      const smoothedVelStats = calculateStats(allMetrics[i].metrics.velocities);
      const cvImprovement = ((originalVelStats.cv - smoothedVelStats.cv) / originalVelStats.cv) * 100;
      const stdDevImprovement = ((originalVelStats.stdDev - smoothedVelStats.stdDev) / originalVelStats.stdDev) * 100;
      
      report.push(`${allMetrics[0].name} → ${allMetrics[i].name}:`);
      report.push(`  Velocity CV improvement:     ${cvImprovement.toFixed(2)}%`);
      report.push(`  Velocity StdDev improvement: ${stdDevImprovement.toFixed(2)}%`);
      report.push(`  Frame count change:          ${((allMetrics[i].metrics.frameCount / allMetrics[0].metrics.frameCount - 1) * 100).toFixed(2)}%`);
      report.push('');
    }
  }
  
  report.push('═'.repeat(80));
  
  return report.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const recordings = [];
  
  // Load original
  try {
    const originalPath = path.join(__dirname, '..', 'camera_recording_2026-01-23 (1).json');
    const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
    recordings.push({
      name: 'Original',
      snapshots: originalData.snapshots,
    });
  } catch (err) {
    console.error('Could not load original recording:', err.message);
  }
  
  // Load basic smoothed
  try {
    const basicPath = path.join(__dirname, '..', 'camera_recording_smoothed.json');
    const basicData = JSON.parse(fs.readFileSync(basicPath, 'utf8'));
    recordings.push({
      name: 'Basic Smoothed',
      snapshots: basicData.snapshots,
    });
  } catch (err) {
    console.log('Basic smoothed file not found (run smooth-camera-recording.js first)');
  }
  
  // Load advanced smoothed
  try {
    const advancedPath = path.join(__dirname, '..', 'camera_recording_smoothed_advanced.json');
    const advancedData = JSON.parse(fs.readFileSync(advancedPath, 'utf8'));
    recordings.push({
      name: 'Advanced Smoothed',
      snapshots: advancedData.snapshots,
    });
  } catch (err) {
    console.log('Advanced smoothed file not found (run smooth-camera-advanced.js first)');
  }
  
  if (recordings.length === 0) {
    console.error('No recordings found to compare');
    return;
  }
  
  // Generate report
  const report = generateComparisonReport(recordings);
  
  // Output to console
  console.log(report);
  
  // Save to file
  const outputPath = path.join(__dirname, '..', 'camera_comparison_report.txt');
  fs.writeFileSync(outputPath, report);
  console.log(`\nReport saved to: ${outputPath}`);
}

main();
