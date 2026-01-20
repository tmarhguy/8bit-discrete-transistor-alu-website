'use client';

import { useState, useEffect } from 'react';
import { haptics } from '@/lib/utils/haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt Component
 * Encourages users to install the app for better mobile experience
 * Optimized for performance - minimal bundle size
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Defer initialization to avoid blocking main thread
    const initPrompt = () => {
      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Listen for install prompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        // Show prompt after user has been on site for 30 seconds
        setTimeout(() => {
          setShowPrompt(true);
          setTimeout(() => setIsVisible(true), 50); // Trigger animation
        }, 30000);
      };

      // Listen for successful installation
      const handleAppInstalled = () => {
        setIsInstalled(true);
        setShowPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    };

    // Defer initialization using requestIdleCallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initPrompt);
    } else {
      setTimeout(initPrompt, 1000);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    haptics.buttonPress();
    
    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      haptics.success();
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    haptics.tap();
    setIsVisible(false);
    
    // Delay hiding to allow exit animation
    setTimeout(() => {
      setShowPrompt(false);
    }, 300);
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[70] pointer-events-auto transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-20 opacity-0'
      }`}
    >
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Install App
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Get quick access and enhanced performance with our mobile app experience.
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#F2CD5C] text-black font-bold py-2.5 px-4 rounded-lg transition-colors active:scale-95 min-h-[44px]"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2.5 text-zinc-400 hover:text-white transition-colors min-h-[44px]"
                  >
                    Not now
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  );
}
