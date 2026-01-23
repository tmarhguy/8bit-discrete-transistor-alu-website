/**
 * Immersive camera scene data - Constant speed, no jerks
 * 
 * Generated with equal spacing between frames for smooth, constant velocity.
 * Each scene maintains consistent speed - no stops or sudden changes.
 * 
 * Distance verification:
 * - Scene 1: avg 4.07 units, max deviation 0.7%
 * - Scene 2: avg 0.42 units, max deviation 10.5%
 * - Scene 3: avg 0.66 units, max deviation 1.3%
 * - Scene 4: avg 0.87 units, max deviation 5.8%
 * - Scene 5: avg 0.12 units, max deviation 1.7%
 * - Scene 6: avg 0.88 units, max deviation 2.1%
 * 
 * Total: 49 evenly-spaced frames across 6 scenes
 */

import { SceneData } from './types';
import { mergeScenesWithTransitions } from './interpolation';

// Scene 1: Smooth Descent (8 frames)
// Constant speed descent from overview to close
const scene1Snapshots = [
  { position: [0.010, 28.930, 0.000] as [number, number, number], target: [0.010, 0.000, 0.000] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [0.034, 24.856, -0.017] as [number, number, number], target: [0.034, 0.000, -0.017] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [0.058, 20.782, -0.034] as [number, number, number], target: [0.058, 0.000, -0.034] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [0.083, 16.708, -0.051] as [number, number, number], target: [0.083, 0.000, -0.051] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [0.107, 12.634, -0.068] as [number, number, number], target: [0.107, 0.000, -0.068] as [number, number, number], fov: 45, timestamp: 4 },
  { position: [0.118, 8.560, -0.037] as [number, number, number], target: [0.118, 0.000, -0.037] as [number, number, number], fov: 45, timestamp: 5 },
  { position: [0.128, 4.487, 0.000] as [number, number, number], target: [0.128, 0.000, 0.000] as [number, number, number], fov: 45, timestamp: 6 },
  { position: [0.440, 0.540, 0.820] as [number, number, number], target: [0.120, 0.000, -0.070] as [number, number, number], fov: 45, timestamp: 7 },
];

// Scene 2: Close Circular Orbit (12 frames)
// Constant speed circular movement at close range
const scene2Snapshots = [
  { position: [0.530, 0.490, 0.810] as [number, number, number], target: [0.120, 0.000, -0.070] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [0.717, 0.408, 0.425] as [number, number, number], target: [0.120, 0.000, -0.070] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [0.800, 0.341, 0.036] as [number, number, number], target: [0.121, 0.001, -0.073] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [0.623, 0.310, -0.361] as [number, number, number], target: [0.126, 0.006, -0.081] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [0.442, 0.280, -0.751] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 4 },
  { position: [0.009, 0.261, -0.796] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 5 },
  { position: [-0.424, 0.243, -0.842] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 6 },
  { position: [-0.630, 0.240, -0.515] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 7 },
  { position: [-0.788, 0.240, -0.109] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 8 },
  { position: [-0.739, 0.240, 0.266] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 9 },
  { position: [-0.470, 0.240, 0.608] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 10 },
  { position: [-0.200, 0.240, 0.950] as [number, number, number], target: [0.130, 0.010, -0.090] as [number, number, number], fov: 45, timestamp: 11 },
];

// Scene 3: Horizontal Detail Pan (8 frames)
// Constant speed horizontal arc
const scene3Snapshots = [
  { position: [2.270, 0.360, 2.000] as [number, number, number], target: [0.260, -0.320, -0.100] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [2.531, 0.293, 1.392] as [number, number, number], target: [0.260, -0.296, -0.039] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [2.744, 0.238, 0.768] as [number, number, number], target: [0.260, -0.278, 0.012] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [2.868, 0.206, 0.116] as [number, number, number], target: [0.260, -0.271, 0.044] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [2.721, 0.200, -0.520] as [number, number, number], target: [0.260, -0.270, 0.050] as [number, number, number], fov: 45, timestamp: 4 },
  { position: [2.515, 0.200, -1.153] as [number, number, number], target: [0.260, -0.270, 0.050] as [number, number, number], fov: 45, timestamp: 5 },
  { position: [2.019, 0.200, -1.585] as [number, number, number], target: [0.260, -0.270, 0.050] as [number, number, number], fov: 45, timestamp: 6 },
  { position: [1.500, 0.200, -2.000] as [number, number, number], target: [0.260, -0.270, 0.050] as [number, number, number], fov: 45, timestamp: 7 },
];

// Scene 4: Elevated Rotating View (10 frames)
// Constant speed rise with rotation
const scene4Snapshots = [
  { position: [0.500, 0.500, -2.300] as [number, number, number], target: [0.260, -0.300, 0.060] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [-0.309, 0.833, -2.157] as [number, number, number], target: [0.260, -0.300, 0.060] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [-1.117, 1.166, -2.015] as [number, number, number], target: [0.260, -0.300, 0.060] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [-1.544, 1.406, -1.313] as [number, number, number], target: [0.171, -0.369, 0.039] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [-1.926, 1.636, -0.548] as [number, number, number], target: [0.071, -0.445, 0.016] as [number, number, number], fov: 45, timestamp: 4 },
  { position: [-2.146, 1.827, 0.245] as [number, number, number], target: [-0.014, -0.514, 0.000] as [number, number, number], fov: 45, timestamp: 5 },
  { position: [-1.955, 1.923, 1.105] as [number, number, number], target: [-0.061, -0.561, 0.000] as [number, number, number], fov: 45, timestamp: 6 },
  { position: [-1.643, 1.983, 1.861] as [number, number, number], target: [-0.104, -0.604, 0.000] as [number, number, number], fov: 45, timestamp: 7 },
  { position: [-0.821, 1.891, 2.181] as [number, number, number], target: [-0.127, -0.627, 0.000] as [number, number, number], fov: 45, timestamp: 8 },
  { position: [0.000, 1.800, 2.500] as [number, number, number], target: [-0.150, -0.650, 0.000] as [number, number, number], fov: 45, timestamp: 9 },
];

// Scene 5: Hero Component Focus (6 frames)
// Constant speed zoom into detail
const scene5Snapshots = [
  { position: [-1.640, 0.210, 0.490] as [number, number, number], target: [-0.210, -0.030, 0.530] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [-1.520, 0.198, 0.515] as [number, number, number], target: [-0.208, -0.030, 0.538] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [-1.401, 0.185, 0.540] as [number, number, number], target: [-0.206, -0.030, 0.547] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [-1.283, 0.167, 0.569] as [number, number, number], target: [-0.203, -0.030, 0.556] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [-1.167, 0.145, 0.602] as [number, number, number], target: [-0.201, -0.030, 0.567] as [number, number, number], fov: 45, timestamp: 4 },
  { position: [-1.050, 0.120, 0.590] as [number, number, number], target: [-0.190, -0.020, 0.580] as [number, number, number], fov: 45, timestamp: 5 },
];

// Scene 6: Quick Pullback (5 frames)
// Constant speed exit
const scene6Snapshots = [
  { position: [-1.500, 1.000, 2.500] as [number, number, number], target: [0.200, 0.300, 0.800] as [number, number, number], fov: 45, timestamp: 0 },
  { position: [-0.765, 0.853, 2.022] as [number, number, number], target: [0.255, 0.282, 0.855] as [number, number, number], fov: 45, timestamp: 1 },
  { position: [-0.030, 0.706, 1.545] as [number, number, number], target: [0.310, 0.263, 0.910] as [number, number, number], fov: 45, timestamp: 2 },
  { position: [0.609, 0.556, 0.982] as [number, number, number], target: [0.372, 0.239, 0.972] as [number, number, number], fov: 45, timestamp: 3 },
  { position: [1.000, 0.400, 0.200] as [number, number, number], target: [0.450, 0.200, 1.050] as [number, number, number], fov: 45, timestamp: 4 },
];

/**
 * Complete 6-scene journey with constant speed
 * 
 * Key features:
 * - Equal spacing between consecutive frames in each scene
 * - No stops or jerks - smooth constant velocity
 * - Each axis (x, y, z) moves at its own natural pace
 * - Total: 49 frames across 6 scenes
 * 
 * Scene durations (frames determine speed, not time):
 * - Scene 1: 8 frames - smooth descent
 * - Scene 2: 12 frames - longest, most detailed
 * - Scene 3: 8 frames - horizontal sweep
 * - Scene 4: 10 frames - elevated orbit
 * - Scene 5: 6 frames - hero focus
 * - Scene 6: 5 frames - quick exit
 */
export const IMMERSIVE_SCENES: SceneData[] = [
  {
    id: 'scene1_descent',
    name: 'Smooth Descent',
    description: 'Constant speed descent from overview',
    suggestedSnapshots: 8,
    snapshots: scene1Snapshots,
    duration: 8,
    easing: 'linear', // Constant speed - no easing
  },
  {
    id: 'scene2_close_orbit',
    name: 'Close Circular Orbit',
    description: 'Constant speed circular inspection',
    suggestedSnapshots: 12,
    snapshots: scene2Snapshots,
    duration: 12,
    easing: 'linear', // Constant speed
  },
  {
    id: 'scene3_detail_pan',
    name: 'Horizontal Detail Pan',
    description: 'Constant speed horizontal arc',
    suggestedSnapshots: 8,
    snapshots: scene3Snapshots,
    duration: 8,
    easing: 'linear', // Constant speed
  },
  {
    id: 'scene4_elevated_view',
    name: 'Elevated Rotating View',
    description: 'Constant speed rising spiral',
    suggestedSnapshots: 10,
    snapshots: scene4Snapshots,
    duration: 10,
    easing: 'linear', // Constant speed
  },
  {
    id: 'scene5_hero_focus',
    name: 'Hero Component Focus',
    description: 'Constant speed zoom into detail',
    suggestedSnapshots: 6,
    snapshots: scene5Snapshots,
    duration: 6,
    easing: 'linear', // Constant speed
  },
  {
    id: 'scene6_pullback',
    name: 'Quick Pullback',
    description: 'Constant speed exit',
    suggestedSnapshots: 5,
    snapshots: scene6Snapshots,
    duration: 5,
    easing: 'linear', // Constant speed
  },
];

/**
 * Total duration of all scenes (in frames, not seconds)
 * Speed is locked - duration will be whatever it takes at constant velocity
 */
export const TOTAL_DURATION = IMMERSIVE_SCENES.reduce((sum, scene) => sum + scene.duration, 0);

/**
 * Get scene by ID
 */
export function getSceneById(id: string): SceneData | undefined {
  return IMMERSIVE_SCENES.find(scene => scene.id === id);
}

/**
 * Get merged continuous path with smooth transitions between scenes
 * This creates one seamless journey with equal spacing throughout
 */
export function getMergedContinuousPath(transitionFrames: number = 3) {
  const allSceneSnapshots = IMMERSIVE_SCENES.map(scene => scene.snapshots);
  return mergeScenesWithTransitions(allSceneSnapshots, transitionFrames);
}
