/**
 * Camera coordinate types for immersive playback system
 */

export interface CameraSnapshot {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  timestamp: number; // Relative timestamp within scene (seconds)
}

export interface SceneData {
  id: string;
  name: string;
  description: string;
  suggestedSnapshots: number;
  snapshots: CameraSnapshot[];
  duration: number; // Total duration in seconds
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' | 'easeInOutQuart';
}

export interface PlaybackState {
  isPlaying: boolean;
  currentSceneIndex: number;
  currentTime: number; // Time within current scene (0 to scene.duration)
  totalProgress: number; // 0 to 1 across entire 30-second journey
}
