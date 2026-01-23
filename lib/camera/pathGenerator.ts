/**
 * Parametric camera path generator for ultra-smooth 3D camera movement
 * 
 * Uses mathematical curves (Catmull-Rom splines, Bezier curves) to generate
 * perfectly smooth camera positions in real-time without pre-recorded data.
 */

import * as THREE from 'three';
import { CameraSnapshot } from './types';

/**
 * Define keyframes that the camera should pass through
 * These are the "control points" for our smooth curve
 * 
 * OPTIMIZED FOR SMOOTHNESS:
 * - Only 12 keyframes total (2 per scene) for maximum smoothness
 * - Catmull-Rom splines naturally create smooth curves BETWEEN keyframes
 * - Don't over-constrain the spline with too many points
 * 
 * THE GOLDEN RULE: Use the MINIMUM number of keyframes that define your 
 * creative intent. The spline will handle the smoothness automatically.
 * 
 * Structure: 2 keyframes per scene = 12 total keyframes
 * This gives us good control over each scene's start/end while maintaining
 * the smoothest possible motion.
 */
export const CAMERA_KEYFRAMES = [
  // Scene 1: Descent (Total: 5.0s - Cinematic Override)
  { position: [0.950, 28.930, 0.900], target: [0.200, 0.300, 0.300], fov: 45, duration: 5.0 }, // Intro fall (0->1)
  { position: [0.950, 0.900, 0.900], target: [0.200, 0.300, 0.300], fov: 45, duration: 1.2 }, // Settle -> Orbit Start (1->2)

  // Scene 2: Circular Orbit
  { position: [0.900, 0.850, 0.300], target: [0.200, 0.300, 0.300], fov: 45, duration: 2.1 }, // Arc 1 (2->3)
  { position: [0.100, 0.800, 0.950], target: [0.200, 0.300, 0.300], fov: 45, duration: 2.7 }, // Arc 2 -> Pan Start (3->4)

  // Scene 3: Horizontal Pan
  { position: [1.200, 0.800, 1.700], target: [0.250, 0.280, 0.250], fov: 45, duration: 2.6 }, // Pan start -> Pan mid (4->5)
  { position: [2.270, 0.750, 1.000], target: [0.260, 0.270, 0.200], fov: 45, duration: 1.5 }, // Pan end -> Elevated Start (5->6)

  // Scene 4: Elevated View -> Component Focus
  { position: [1.600, 0.900, 0.700], target: [0.200, 0.300, 0.200], fov: 45, duration: 4.0 }, // Start move -> High Point (6->7) (sped up from 7.5s)
  { position: [-2.000, 1.700, 0.300], target: [0.150, 0.350, 0.150], fov: 45, duration: 3.8 }, // High point -> Approach (7->8)

  // Scene 5: Component Focus
  { position: [-0.600, 1.300, 1.500], target: [0.180, 0.280, 0.180], fov: 45, duration: 3.9 }, // Approach -> Close up (8->9)
  { position: [1.200, 0.900, 0.900], target: [0.260, 0.220, 0.260], fov: 42, duration: 0.8 }, // Close up -> Exit Start (9->10)

  // Scene 6: Pullback / Exit
  { position: [1.400, 0.900, 0.600], target: [0.260, 0.220, 0.260], fov: 45, duration: 5.5 }, // Start exit -> Final (10->11)
  { position: [-1.200, 1.250, 0.800], target: [0.260, 0.220, 0.260], fov: 50, duration: 0.0 }, // Final shot (End)
];

// Total duration is now sum of all segments
const TOTAL_DURATION = CAMERA_KEYFRAMES.reduce((sum, kf) => sum + (kf.duration || 0), 0);

/**
 * Catmull-Rom spline interpolation for smooth curves through points
 * This ensures C1 continuity (smooth velocity) through all keyframes
 */
export class CameraPathGenerator {
  private positionCurve: THREE.CatmullRomCurve3;
  private targetCurve: THREE.CatmullRomCurve3;
  private totalDuration: number;
  private keyframeTimes: number[];
  private curveKnots: number[];
  
  constructor(keyframes = CAMERA_KEYFRAMES, duration = TOTAL_DURATION) {
    this.totalDuration = duration;
    
    // 1. Create Curves
    // Use 'centripetal' Catmull-Rom: guarantees no overshoot, simplified physics
    const positionPoints = keyframes.map(kf => new THREE.Vector3(...kf.position));
    this.positionCurve = new THREE.CatmullRomCurve3(positionPoints, false, 'centripetal', 0.5);
    
    const targetPoints = keyframes.map(kf => new THREE.Vector3(...kf.target));
    this.targetCurve = new THREE.CatmullRomCurve3(targetPoints, false, 'centripetal', 0.5);

    // 2. Calculate Keyframe Timings (Cumulative Duration)
    // We want to hit Keyframe N exactly at Time T_N
    this.keyframeTimes = [0];
    let timeAccumulator = 0;
    // Note: The duration on keyframe[i] is the time to reach keyframe[i+1] (or segment duration)
    // We map 1:1. The structure above implies "duration TO next".
    // Actually, let's treat duration on index `i` as the duration of the segment following point `i`.
    // The last point's duration is unused or irrelevant loop.
    for (let i = 0; i < keyframes.length - 1; i++) {
      timeAccumulator += keyframes[i].duration || 2.0;
      this.keyframeTimes.push(timeAccumulator);
    }
    // Update total duration to match exact sum
    this.totalDuration = timeAccumulator;

    // 3. Calculate Curve Parameter (t) for each Keyframe (Knots)
    // For centripetal splines, the 't' value of a keyframe is proportional to distance^0.5
    // We must replicate Three.js internal knot calculation to knowing exactly which 't' corresponds to which keyframe.
    this.curveKnots = [0];
    let knotAccumulator = 0;
    const power = 0.5; // Centripetal
    
    for (let i = 0; i < positionPoints.length - 1; i++) {
      const dist = positionPoints[i].distanceTo(positionPoints[i+1]);
      knotAccumulator += Math.pow(dist, power);
      this.curveKnots.push(knotAccumulator);
    }
    
    // Normalize knots to [0, 1] range to match curve.getPoint(t)
    const maxKnot = this.curveKnots[this.curveKnots.length - 1];
    this.curveKnots = this.curveKnots.map(k => k / maxKnot);
  }

  /**
   * Clamp camera position so it never goes below the look-at target (Y).
   */
  protected clampPositionAboveTarget(snapshot: CameraSnapshot): CameraSnapshot {
    const [px, py, pz] = snapshot.position;
    const [, ty] = snapshot.target;
    // Keep minimum height relative to board (y=0) and target
    const minY = Math.max(0.1, ty + 0.1); 
    if (py < minY) {
      return {
        ...snapshot,
        position: [px, minY, pz],
      };
    }
    return snapshot;
  }
  
  /**
   * Map real time to curve parameter 't'
   * This ensures we hit exact keyframes at exact times
   */
  private getTimeToParameter(time: number): number {
    // 1. Find which segment we are in
    let segmentIndex = 0;
    while (segmentIndex < this.keyframeTimes.length - 1 && time > this.keyframeTimes[segmentIndex + 1]) {
      segmentIndex++;
    }
    
    // 2. Calculate local progress (0..1) within this segment
    const startTime = this.keyframeTimes[segmentIndex];
    const endTime = this.keyframeTimes[segmentIndex + 1] || this.totalDuration;
    const segmentDuration = endTime - startTime;
    const localProgress = (time - startTime) / segmentDuration;
    
    // 3. Map to curve parameter space
    // Interpolate between the parameter values (knots) of the start and end keyframes
    const startKnot = this.curveKnots[segmentIndex];
    const endKnot = this.curveKnots[segmentIndex + 1];
    
    // Smooth the local progress for nicer acceleration/deceleration within the scene?
    // User asked for fixed Transition Times. Linear mapping ensures we hit the marks exactly.
    // Adding easing here might distort the duration control. Let's stick to Linear Time -> Knot mapping.
    // The Spline ITSELF handles the spatial smoothing.
    
    return THREE.MathUtils.lerp(startKnot, endKnot, localProgress);
  }

  getSnapshotAtTime(time: number): CameraSnapshot {
    const safeTime = THREE.MathUtils.clamp(time, 0, this.totalDuration);
    const t = this.getTimeToParameter(safeTime);
    
    const position = this.positionCurve.getPoint(t);
    const target = this.targetCurve.getPoint(t);
    
    return this.clampPositionAboveTarget({
      position: [position.x, position.y, position.z],
      target: [target.x, target.y, target.z],
      fov: 45,
      timestamp: time,
    });
  }
  
  /**
   * Get camera snapshot at normalized progress (0 to 1)
   * @param progress - Normalized progress (0 = start, 1 = end)
   */
  getSnapshotAtProgress(progress: number): CameraSnapshot {
    const time = progress * this.totalDuration;
    return this.getSnapshotAtTime(time);
  }
  
  /**
   * Get total duration of the path in seconds
   */
  getDuration(): number {
    return this.totalDuration;
  }
  
  /**
   * Get the curve length (useful for constant-speed traversal)
   */
  getPathLength(): number {
    return this.positionCurve.getLength();
  }
  
  /**
   * Get snapshot at a specific arc-length distance along the path
   * This ensures constant velocity regardless of keyframe spacing
   * @param distance - Distance along the curve (0 to getPathLength())
   */
  getSnapshotAtDistance(distance: number): CameraSnapshot {
    const totalLength = this.getPathLength();
    const t = THREE.MathUtils.clamp(distance / totalLength, 0, 1);
    
    // Use arc-length parameterization for constant speed
    const position = this.positionCurve.getPointAt(t);
    const target = this.targetCurve.getPointAt(t);
    
    return this.clampPositionAboveTarget({
      position: [position.x, position.y, position.z],
      target: [target.x, target.y, target.z],
      fov: 45,
      timestamp: t * this.totalDuration,
    });
  }
  
  /**
   * Get velocity (direction of movement) at a specific time
   * Useful for motion blur or orientation effects
   */
  getVelocityAtTime(time: number): THREE.Vector3 {
    const t = THREE.MathUtils.clamp(time / this.totalDuration, 0, 1);
    return this.positionCurve.getTangent(t);
  }
}



/**
 * Create a default path generator instance
 * @param constantVelocity - If true, uses unified-velocity generator (recommended for smoothest motion)
 * @param duration - Total duration of the path in seconds
 */
export function createPathGenerator(
  constantVelocity = true, // parameter kept for compatibility but ignored
  duration = 60 // parameter kept but ignored in favor of calculated duration
): CameraPathGenerator {
  // Always use the new timed generator which handles both smoothing and precise timing
  return new CameraPathGenerator();
}
