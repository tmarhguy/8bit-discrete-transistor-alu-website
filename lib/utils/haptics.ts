/**
 * Haptic Feedback Utilities for Mobile Touch Interactions
 * Provides subtle tactile feedback for user actions
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticOptions {
  duration?: number;
  vibrate?: boolean;
}

/**
 * Trigger haptic feedback if supported by the device
 */
export const triggerHaptic = (
  pattern: HapticPattern = 'light',
  options: HapticOptions = {}
): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  const { duration, vibrate = true } = options;

  // iOS Haptic Feedback API (WebKit)
  if ('Taptic' in window || 'webkit' in window) {
    try {
      // @ts-ignore - iOS-specific API
      if (window?.webkit?.messageHandlers?.haptic) {
        // @ts-ignore
        window.webkit.messageHandlers.haptic.postMessage(pattern);
        return;
      }
    } catch (e) {
      // Silently fail - not critical functionality
    }
  }

  // Vibration API (Android and modern browsers)
  if (vibrate && 'vibrate' in navigator) {
    try {
      const patterns: Record<HapticPattern, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [15, 50, 15, 50, 15],
        error: [30, 100, 30],
      };

      const vibrationPattern = duration || patterns[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (e) {
      // Silently fail - not critical functionality
    }
  }
};

/**
 * Cancel any ongoing haptic feedback
 */
export const cancelHaptic = (): void => {
  if (typeof window === 'undefined') return;
  
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (e) {
      // Silently fail
    }
  }
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'vibrate' in navigator || 
         'Taptic' in window || 
         // @ts-ignore
         !!window?.webkit?.messageHandlers?.haptic;
};

/**
 * Preset haptic feedback functions for common interactions
 */
export const haptics = {
  tap: () => triggerHaptic('light'),
  buttonPress: () => triggerHaptic('medium'),
  swipe: () => triggerHaptic('light'),
  longPress: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  selectionChange: () => triggerHaptic('light'),
  impactLight: () => triggerHaptic('light'),
  impactMedium: () => triggerHaptic('medium'),
  impactHeavy: () => triggerHaptic('heavy'),
};
