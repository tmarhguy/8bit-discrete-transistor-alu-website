/**
 * Frame Issues Visualization Tool
 * 
 * Creates visual reports showing where problems occur in the recording
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// VISUALIZATION
// ============================================================================

function generateASCIIChart(data, width = 80, height = 20, label = '') {
  if (data.length === 0) return '';
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const lines = [];
  lines.push(`\n${label}:`);
  lines.push('┌' + '─'.repeat(width) + '┐');
  
  // Create grid
  for (let row = 0; row < height; row++) {
    const threshold = max - (row / (height - 1)) * range;
    let line = '│';
    
    for (let col = 0; col < width; col++) {
      const dataIndex = Math.floor((col / width) * data.length);
      const value = data[dataIndex];
      
      if (value >= threshold) {
        line += '█';
      } else {
        line += ' ';
      }
    }
    
    line += '│';
    if (row === 0) line += ` ${max.toFixed(2)}`;
    if (row === height - 1) line += ` ${min.toFixed(2)}`;
    lines.push(line);
  }
  
  lines.push('└' + '─'.repeat(width) + '┘');
  lines.push(`  Frame: 0${' '.repeat(width - 20)}${data.length}`);
  
  return lines.join('\n');
}

function generateIssueTimeline(issues, totalFrames, width = 80) {
  const timeline = new Array(width).fill(' ');
  
  issues.forEach(issue => {
    const position = Math.floor((issue.frameIndex / totalFrames) * width);
    if (position >= 0 && position < width) {
      if (issue.severity === 'critical') {
        timeline[position] = '█';
      } else if (timeline[position] !== '█') {
        timeline[position] = '▓';
      }
    }
  });
  
  return timeline.join('');
}

function generateReport(reportPath) {
  console.log('='.repeat(80));
  console.log('FRAME ISSUES VISUALIZATION');
  console.log('='.repeat(80));
  console.log('');
  
  // Load report
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const { metadata, statistics, issues } = report;
  
  console.log(`Input: ${metadata.inputFile}`);
  console.log(`Frames: ${metadata.totalFrames}`);
  console.log(`Duration: ${metadata.duration.toFixed(2)}s`);
  console.log(`Issues: ${statistics.totalIssues} (${statistics.criticalIssues} critical)\n`);
  
  // Issue timeline
  console.log('Issue Timeline:');
  console.log('─'.repeat(80));
  console.log('█ = Critical  ▓ = Warning\n');
  
  const timeline = generateIssueTimeline(issues, metadata.totalFrames, 80);
  console.log(timeline);
  console.log('');
  
  // Issues by frame range
  console.log('\nIssues by Frame Range:');
  console.log('─'.repeat(80));
  
  const rangeSize = Math.ceil(metadata.totalFrames / 10);
  for (let i = 0; i < 10; i++) {
    const start = i * rangeSize;
    const end = Math.min((i + 1) * rangeSize, metadata.totalFrames);
    const rangeIssues = issues.filter(issue => 
      issue.frameIndex >= start && issue.frameIndex < end
    );
    const critical = rangeIssues.filter(i => i.severity === 'critical').length;
    const warning = rangeIssues.filter(i => i.severity === 'warning').length;
    
    const bar = '█'.repeat(Math.min(Math.floor(rangeIssues.length / 2), 40));
    console.log(`Frames ${start.toString().padStart(4)}-${end.toString().padEnd(4)}: ${bar} ${rangeIssues.length} (${critical}c, ${warning}w)`);
  }
  
  // Issues by type
  console.log('\n\nIssues by Type:');
  console.log('─'.repeat(80));
  
  Object.entries(statistics.byType).forEach(([type, counts]) => {
    const bar = '█'.repeat(Math.min(Math.floor(counts.total / 2), 40));
    console.log(`${type.padEnd(20)}: ${bar} ${counts.total} (${counts.critical}c, ${counts.warning}w)`);
  });
  
  // Problem areas (clusters of issues)
  console.log('\n\nProblem Areas (Issue Clusters):');
  console.log('─'.repeat(80));
  
  const clusters = findIssueClusters(issues, 20); // 20 frame window
  clusters.slice(0, 10).forEach((cluster, idx) => {
    console.log(`${idx + 1}. Frames ${cluster.start}-${cluster.end}: ${cluster.count} issues`);
    console.log(`   Types: ${Object.keys(cluster.types).join(', ')}`);
  });
  
  // Recommendations
  console.log('\n\n' + '='.repeat(80));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(80));
  console.log('');
  
  if (statistics.byType.zoom_oscillation && statistics.byType.zoom_oscillation.total > 0) {
    console.log('⚠️  Zoom Oscillation Detected:');
    console.log('   The camera is zooming in and out frequently.');
    console.log('   Solution: Apply distance smoothing to stabilize zoom.\n');
  }
  
  if (statistics.byType.position_jump && statistics.byType.position_jump.critical > 10) {
    console.log('⚠️  Frequent Position Jumps:');
    console.log('   The camera position changes suddenly between frames.');
    console.log('   Solution: Apply position smoothing or remove outlier frames.\n');
  }
  
  if (statistics.byType.high_velocity && statistics.byType.high_velocity.critical > 10) {
    console.log('⚠️  High Velocity Movements:');
    console.log('   The camera moves too fast in some sections.');
    console.log('   Solution: Apply velocity limiting or temporal smoothing.\n');
  }
  
  if (statistics.byType.high_acceleration && statistics.byType.high_acceleration.critical > 10) {
    console.log('⚠️  Sudden Speed Changes:');
    console.log('   The camera accelerates/decelerates too quickly.');
    console.log('   Solution: Apply acceleration smoothing for gradual speed changes.\n');
  }
  
  console.log('Next Steps:');
  console.log('  1. Focus on frames with critical issues first');
  console.log('  2. Apply smoothing to problem areas identified above');
  console.log('  3. Re-run detection to verify improvements');
  console.log('  4. Use the advanced smoother with stricter thresholds\n');
}

function findIssueClusters(issues, windowSize) {
  const clusters = [];
  
  for (let i = 0; i < issues.length; i++) {
    const startFrame = issues[i].frameIndex;
    const endFrame = startFrame + windowSize;
    
    const clusterIssues = issues.filter(issue => 
      issue.frameIndex >= startFrame && issue.frameIndex < endFrame
    );
    
    if (clusterIssues.length > 3) { // At least 3 issues in window
      const types = {};
      clusterIssues.forEach(issue => {
        types[issue.type] = (types[issue.type] || 0) + 1;
      });
      
      clusters.push({
        start: startFrame,
        end: endFrame,
        count: clusterIssues.length,
        types,
      });
    }
  }
  
  // Merge overlapping clusters
  const merged = [];
  let current = null;
  
  clusters.sort((a, b) => a.start - b.start);
  
  for (const cluster of clusters) {
    if (!current) {
      current = cluster;
    } else if (cluster.start <= current.end) {
      // Merge
      current.end = Math.max(current.end, cluster.end);
      current.count += cluster.count;
      Object.entries(cluster.types).forEach(([type, count]) => {
        current.types[type] = (current.types[type] || 0) + count;
      });
    } else {
      merged.push(current);
      current = cluster;
    }
  }
  
  if (current) merged.push(current);
  
  // Sort by count
  merged.sort((a, b) => b.count - a.count);
  
  return merged;
}

// ============================================================================
// MAIN
// ============================================================================

const reportPath = path.join(__dirname, '..', 'frame_issues_report.json');
generateReport(reportPath);
