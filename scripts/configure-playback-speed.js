/**
 * Interactive Playback Speed Configuration
 * 
 * Helps you find the optimal playback speed by adjusting frame reduction
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// PRESETS
// ============================================================================

const PRESETS = {
  'slightly-faster': {
    name: 'Slightly Faster',
    description: '1.5x speed - gentle speedup',
    keepStartFrames: 60,
    keepEndFrames: 60,
    middleReductionFactor: 1.5,
  },
  'faster': {
    name: 'Faster (Default)',
    description: '2x speed - noticeable speedup',
    keepStartFrames: 60,
    keepEndFrames: 60,
    middleReductionFactor: 2,
  },
  'much-faster': {
    name: 'Much Faster',
    description: '3x speed - significant speedup',
    keepStartFrames: 60,
    keepEndFrames: 60,
    middleReductionFactor: 3,
  },
  'very-fast': {
    name: 'Very Fast',
    description: '4x speed - rapid playback',
    keepStartFrames: 60,
    keepEndFrames: 60,
    middleReductionFactor: 4,
  },
  'preserve-more-start': {
    name: 'Preserve More Start',
    description: '2x speed, keep 2 seconds at start',
    keepStartFrames: 120,
    keepEndFrames: 60,
    middleReductionFactor: 2,
  },
  'preserve-more-end': {
    name: 'Preserve More End',
    description: '2x speed, keep 2 seconds at end',
    keepStartFrames: 60,
    keepEndFrames: 120,
    middleReductionFactor: 2,
  },
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

function estimateResults(originalFrames, config) {
  const middleFrames = originalFrames - config.keepStartFrames - config.keepEndFrames;
  const reducedMiddle = Math.floor(middleFrames / config.middleReductionFactor);
  const totalFrames = config.keepStartFrames + reducedMiddle + config.keepEndFrames;
  const duration = totalFrames / 60; // Assuming 60 FPS
  const speedIncrease = originalFrames / totalFrames;
  
  return {
    totalFrames,
    duration,
    speedIncrease,
    reduction: ((1 - totalFrames / originalFrames) * 100).toFixed(2),
  };
}

async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function displayPresets(originalFrames) {
  console.log('\nAvailable Presets:\n');
  
  let index = 1;
  for (const [key, preset] of Object.entries(PRESETS)) {
    const estimate = estimateResults(originalFrames, preset);
    
    console.log(`${index}. ${preset.name}`);
    console.log(`   ${preset.description}`);
    console.log(`   Result: ${estimate.totalFrames} frames, ${estimate.duration.toFixed(1)}s, ${estimate.speedIncrease.toFixed(2)}x speed`);
    console.log('');
    index++;
  }
}

function generateOptimizerScript(config, outputFilename = 'optimize-playback-custom.js') {
  const scriptPath = path.join(__dirname, 'optimize-playback-speed.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Replace CONFIG object
  const configStr = `const CONFIG = {
  inputFile: 'camera_recording_smoothed_advanced.json',
  outputFile: 'camera_recording_optimized_custom.json',
  
  keepStartFrames: ${config.keepStartFrames},
  keepEndFrames: ${config.keepEndFrames},
  middleReductionFactor: ${config.middleReductionFactor},
  
  applySmoothing: true,
  smoothingWindow: 3,
};`;
  
  const newContent = scriptContent.replace(
    /const CONFIG = \{[\s\S]*?\};/,
    configStr
  );
  
  const outputPath = path.join(__dirname, outputFilename);
  fs.writeFileSync(outputPath, newContent);
  
  console.log(`✅ Custom optimizer script saved to: scripts/${outputFilename}`);
  console.log(`\nTo run it: node scripts/${outputFilename}`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('='.repeat(80));
  console.log('PLAYBACK SPEED CONFIGURATION TOOL');
  console.log('='.repeat(80));
  
  // Load original to get frame count
  const inputPath = path.join(__dirname, '..', 'camera_recording_smoothed_advanced.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const originalFrames = data.snapshots.length;
  const originalDuration = (data.snapshots[data.snapshots.length - 1].timestamp - data.snapshots[0].timestamp).toFixed(2);
  
  console.log(`\nOriginal: ${originalFrames} frames, ${originalDuration}s\n`);
  
  displayPresets(originalFrames);
  
  console.log('Options:');
  console.log('  1-6: Select a preset');
  console.log('  c:   Custom configuration');
  console.log('  q:   Quit\n');
  
  const choice = await promptUser('Your choice: ');
  
  if (choice.toLowerCase() === 'q') {
    console.log('\nGoodbye!');
    return;
  }
  
  let selectedConfig;
  let presetName;
  
  if (choice.toLowerCase() === 'c') {
    console.log('\n=== Custom Configuration ===\n');
    
    const startFrames = await promptUser('Keep start frames (1 second = 60 frames) [60]: ');
    const endFrames = await promptUser('Keep end frames (1 second = 60 frames) [60]: ');
    const reductionFactor = await promptUser('Reduction factor (2 = 2x speed, 3 = 3x speed) [2]: ');
    
    selectedConfig = {
      keepStartFrames: startFrames ? parseInt(startFrames) : 60,
      keepEndFrames: endFrames ? parseInt(endFrames) : 60,
      middleReductionFactor: reductionFactor ? parseFloat(reductionFactor) : 2,
    };
    
    presetName = 'Custom';
  } else {
    const presetIndex = parseInt(choice) - 1;
    const presetKeys = Object.keys(PRESETS);
    
    if (presetIndex >= 0 && presetIndex < presetKeys.length) {
      const presetKey = presetKeys[presetIndex];
      const preset = PRESETS[presetKey];
      
      console.log(`\n✅ Selected: ${preset.name}`);
      console.log(`   ${preset.description}\n`);
      
      selectedConfig = {
        keepStartFrames: preset.keepStartFrames,
        keepEndFrames: preset.keepEndFrames,
        middleReductionFactor: preset.middleReductionFactor,
      };
      
      presetName = preset.name;
    } else {
      console.log('\n❌ Invalid choice. Please run again.');
      return;
    }
  }
  
  // Show estimate
  const estimate = estimateResults(originalFrames, selectedConfig);
  
  console.log('Configuration:');
  console.log('─'.repeat(80));
  console.log(`Keep start frames:   ${selectedConfig.keepStartFrames} (${(selectedConfig.keepStartFrames / 60).toFixed(2)}s)`);
  console.log(`Keep end frames:     ${selectedConfig.keepEndFrames} (${(selectedConfig.keepEndFrames / 60).toFixed(2)}s)`);
  console.log(`Reduction factor:    ${selectedConfig.middleReductionFactor}x`);
  console.log('─'.repeat(80));
  
  console.log('\nEstimated Results:');
  console.log('─'.repeat(80));
  console.log(`Original frames:     ${originalFrames}`);
  console.log(`Optimized frames:    ${estimate.totalFrames}`);
  console.log(`Reduction:           ${estimate.reduction}%`);
  console.log(`Original duration:   ${originalDuration}s`);
  console.log(`Optimized duration:  ${estimate.duration.toFixed(2)}s`);
  console.log(`Speed increase:      ${estimate.speedIncrease.toFixed(2)}x`);
  console.log('─'.repeat(80));
  
  // Ask what to do
  console.log('\nWhat would you like to do?');
  console.log('  1: Generate optimizer script with this config');
  console.log('  2: Run optimizer now');
  console.log('  q: Cancel\n');
  
  const action = await promptUser('Your choice: ');
  
  if (action === '1') {
    generateOptimizerScript(selectedConfig);
  } else if (action === '2') {
    console.log('\nRunning optimizer...\n');
    
    // Update the default script
    generateOptimizerScript(selectedConfig, 'optimize-playback-speed.js');
    
    // Run it
    const { execSync } = await import('child_process');
    execSync('node scripts/optimize-playback-speed.js', { stdio: 'inherit' });
  } else {
    console.log('\nOperation cancelled.');
    return;
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('CONFIGURATION COMPLETE');
  console.log('='.repeat(80));
  console.log(`\nPreset: ${presetName}`);
  console.log(`Speed increase: ${estimate.speedIncrease.toFixed(2)}x`);
  console.log(`Duration: ${estimate.duration.toFixed(2)}s (was ${originalDuration}s)`);
  console.log('\nNext steps:');
  console.log('  1. Test the optimized recording');
  console.log('  2. Adjust if needed by running this tool again');
  console.log('  3. Use camera_recording_optimized.json in your app\n');
}

main().catch(console.error);
