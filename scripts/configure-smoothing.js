/**
 * Interactive Camera Smoothing Configuration Tool
 * 
 * Helps you find the optimal smoothing parameters for your needs
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
  'ultra-smooth': {
    name: 'Ultra Smooth',
    description: 'Maximum smoothness, cinematic quality (120 FPS)',
    config: {
      targetFPS: 120,
      targetVelocity: 1.2,
      tensionParameter: 0.3,
      velocityVariance: 0.2,
      maxJumpDistance: 5.0,
      outlierThreshold: 2.5,
    },
  },
  'balanced': {
    name: 'Balanced',
    description: 'Great smoothness with reasonable file size (60 FPS)',
    config: {
      targetFPS: 60,
      targetVelocity: 1.5,
      tensionParameter: 0.5,
      velocityVariance: 0.3,
      maxJumpDistance: 5.0,
      outlierThreshold: 2.5,
    },
  },
  'fast-playback': {
    name: 'Fast Playback',
    description: 'Faster movement, tighter curves (60 FPS)',
    config: {
      targetFPS: 60,
      targetVelocity: 2.5,
      tensionParameter: 0.7,
      velocityVariance: 0.3,
      maxJumpDistance: 5.0,
      outlierThreshold: 2.5,
    },
  },
  'cinematic': {
    name: 'Cinematic',
    description: 'Slow, dramatic, flowing motion (60 FPS)',
    config: {
      targetFPS: 60,
      targetVelocity: 1.0,
      tensionParameter: 0.4,
      velocityVariance: 0.15,
      maxJumpDistance: 5.0,
      outlierThreshold: 2.5,
    },
  },
  'high-fidelity': {
    name: 'High Fidelity',
    description: 'Stays closest to original path (60 FPS)',
    config: {
      targetFPS: 60,
      targetVelocity: 1.5,
      tensionParameter: 0.6,
      velocityVariance: 0.1,
      maxJumpDistance: 3.0,
      outlierThreshold: 2.0,
    },
  },
  'performance': {
    name: 'Performance',
    description: 'Smaller file size, good quality (30 FPS)',
    config: {
      targetFPS: 30,
      targetVelocity: 1.5,
      tensionParameter: 0.5,
      velocityVariance: 0.3,
      maxJumpDistance: 5.0,
      outlierThreshold: 2.5,
    },
  },
};

// ============================================================================
// CLI INTERFACE
// ============================================================================

function displayHeader() {
  console.log('\n' + '═'.repeat(80));
  console.log('CAMERA SMOOTHING CONFIGURATION TOOL');
  console.log('═'.repeat(80));
  console.log('\nThis tool helps you configure the optimal smoothing parameters.');
  console.log('Choose a preset or customize your own settings.\n');
}

function displayPresets() {
  console.log('Available Presets:\n');
  
  let index = 1;
  for (const [key, preset] of Object.entries(PRESETS)) {
    console.log(`${index}. ${preset.name}`);
    console.log(`   ${preset.description}`);
    console.log(`   FPS: ${preset.config.targetFPS}, Velocity: ${preset.config.targetVelocity}, Tension: ${preset.config.tensionParameter}`);
    console.log('');
    index++;
  }
}

function displayConfig(config) {
  console.log('\nCurrent Configuration:');
  console.log('─'.repeat(80));
  console.log(`Target FPS:          ${config.targetFPS}`);
  console.log(`Target Velocity:     ${config.targetVelocity} units/second`);
  console.log(`Tension Parameter:   ${config.tensionParameter} (0=loose, 1=tight)`);
  console.log(`Velocity Variance:   ${config.velocityVariance} (0=strict, 1=loose)`);
  console.log(`Max Jump Distance:   ${config.maxJumpDistance} units`);
  console.log(`Outlier Threshold:   ${config.outlierThreshold} std deviations`);
  console.log('─'.repeat(80));
}

function estimateOutput(config) {
  // Load original to estimate
  try {
    const originalPath = path.join(__dirname, '..', 'camera_recording_2026-01-23 (1).json');
    const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
    const originalFrames = originalData.snapshots.length;
    const duration = originalData.snapshots[originalData.snapshots.length - 1].timestamp - 
                     originalData.snapshots[0].timestamp;
    
    // Estimate based on velocity and path length (rough approximation)
    const estimatedDuration = duration * 0.27; // Based on observed compression
    const estimatedFrames = Math.floor(estimatedDuration * config.targetFPS);
    const estimatedSize = (estimatedFrames * 2.5) / 1024; // KB
    
    console.log('\nEstimated Output:');
    console.log('─'.repeat(80));
    console.log(`Original frames:     ${originalFrames}`);
    console.log(`Original duration:   ${duration.toFixed(2)}s`);
    console.log(`Estimated frames:    ${estimatedFrames}`);
    console.log(`Estimated duration:  ${estimatedDuration.toFixed(2)}s`);
    console.log(`Estimated file size: ${estimatedSize.toFixed(2)} MB`);
    console.log('─'.repeat(80));
  } catch (err) {
    console.log('\nCould not load original file for estimation.');
  }
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

function writeConfigFile(config, filename = 'smoothing-config.json') {
  const outputPath = path.join(__dirname, '..', filename);
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  console.log(`\n✅ Configuration saved to: ${filename}`);
}

function generateSmootherScript(config, outputFilename = 'smooth-camera-custom.js') {
  const scriptPath = path.join(__dirname, 'smooth-camera-advanced.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Replace CONFIG object
  const configStr = `const CONFIG = ${JSON.stringify(config, null, 2)};`;
  const newContent = scriptContent.replace(
    /const CONFIG = \{[\s\S]*?\};/,
    configStr
  );
  
  // Update output filename
  const finalContent = newContent.replace(
    /outputFile: 'camera_recording_smoothed_advanced\.json'/,
    `outputFile: 'camera_recording_smoothed_custom.json'`
  );
  
  const outputPath = path.join(__dirname, outputFilename);
  fs.writeFileSync(outputPath, finalContent);
  
  console.log(`✅ Custom smoother script saved to: scripts/${outputFilename}`);
  console.log(`\nTo run it: node scripts/${outputFilename}`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  displayHeader();
  displayPresets();
  
  console.log('Options:');
  console.log('  1-6: Select a preset');
  console.log('  c:   Custom configuration (advanced)');
  console.log('  q:   Quit\n');
  
  const choice = await promptUser('Your choice: ');
  
  if (choice.toLowerCase() === 'q') {
    console.log('\nGoodbye!');
    return;
  }
  
  let selectedConfig;
  
  if (choice.toLowerCase() === 'c') {
    console.log('\n=== Custom Configuration ===\n');
    console.log('Enter values or press Enter to use default.\n');
    
    const fps = await promptUser('Target FPS [60]: ');
    const velocity = await promptUser('Target Velocity (units/s) [1.5]: ');
    const tension = await promptUser('Tension Parameter (0-1) [0.5]: ');
    const variance = await promptUser('Velocity Variance (0-1) [0.3]: ');
    const maxJump = await promptUser('Max Jump Distance [5.0]: ');
    const outlier = await promptUser('Outlier Threshold [2.5]: ');
    
    selectedConfig = {
      inputFile: 'camera_recording_2026-01-23 (1).json',
      outputFile: 'camera_recording_smoothed_custom.json',
      targetFPS: fps ? parseInt(fps) : 60,
      outlierThreshold: outlier ? parseFloat(outlier) : 2.5,
      maxJumpDistance: maxJump ? parseFloat(maxJump) : 5.0,
      velocitySmoothing: true,
      targetVelocity: velocity ? parseFloat(velocity) : 1.5,
      velocityVariance: variance ? parseFloat(variance) : 0.3,
      useHermiteSpline: true,
      tensionParameter: tension ? parseFloat(tension) : 0.5,
    };
  } else {
    const presetIndex = parseInt(choice) - 1;
    const presetKeys = Object.keys(PRESETS);
    
    if (presetIndex >= 0 && presetIndex < presetKeys.length) {
      const presetKey = presetKeys[presetIndex];
      const preset = PRESETS[presetKey];
      
      console.log(`\n✅ Selected: ${preset.name}`);
      console.log(`   ${preset.description}\n`);
      
      selectedConfig = {
        inputFile: 'camera_recording_2026-01-23 (1).json',
        outputFile: `camera_recording_smoothed_${presetKey}.json`,
        velocitySmoothing: true,
        useHermiteSpline: true,
        ...preset.config,
      };
    } else {
      console.log('\n❌ Invalid choice. Please run again.');
      return;
    }
  }
  
  // Display selected configuration
  displayConfig(selectedConfig);
  estimateOutput(selectedConfig);
  
  // Ask what to do
  console.log('\nWhat would you like to do?');
  console.log('  1: Save configuration file only');
  console.log('  2: Generate custom smoother script');
  console.log('  3: Both (recommended)');
  console.log('  q: Cancel\n');
  
  const action = await promptUser('Your choice: ');
  
  if (action === '1' || action === '3') {
    writeConfigFile(selectedConfig);
  }
  
  if (action === '2' || action === '3') {
    generateSmootherScript(selectedConfig);
  }
  
  if (action === '1' || action === '2' || action === '3') {
    console.log('\n' + '═'.repeat(80));
    console.log('CONFIGURATION COMPLETE');
    console.log('═'.repeat(80));
    console.log('\nNext steps:');
    console.log('  1. Review the generated configuration');
    console.log('  2. Run the smoother script: node scripts/smooth-camera-custom.js');
    console.log('  3. View results: node scripts/visualize-smoothing.js');
    console.log('  4. Integrate into your app');
    console.log('\n');
  } else {
    console.log('\nOperation cancelled.');
  }
}

main().catch(console.error);
