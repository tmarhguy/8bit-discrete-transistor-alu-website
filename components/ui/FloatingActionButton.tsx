'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { haptics } from '@/lib/utils/haptics';

interface FABProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  showOnScroll?: boolean;
  scrollThreshold?: number;
}

/**
 * Floating Action Button (FAB) - Robust Mobile Version
 * Simplified structure to ensure reliable touch handling on mobile devices.
 */
export default function FloatingActionButton({
  href,
  onClick,
  icon,
  label,
  position = 'bottom-right',
  showOnScroll = true,
  scrollThreshold = 300,
}: FABProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const shouldShow = window.scrollY > scrollThreshold;
      setIsVisible(shouldShow);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold]);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const handleClick = () => {
    haptics.buttonPress();
    onClick?.();
  };

  // Common button styles
  const baseStyles = "flex items-center gap-3 bg-[#D4AF37] text-black font-bold rounded-full shadow-2xl shadow-[#D4AF37]/30 transition-all active:scale-95 touch-manipulation z-50";
  const sizeStyles = "h-14 px-5 min-w-[56px]"; // Fixed height for reliable hit target

  const ButtonContent = () => (
    <>
      <div className="flex items-center justify-center w-6 h-6">
        {icon || (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        )}
      </div>
      <span className="whitespace-nowrap text-sm font-bold block">
        {label}
      </span>
    </>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`fixed ${positionClasses[position]} z-[9999] pointer-events-auto`}
        >
          {href ? (
            // FORCE NATIVE ANCHOR TAG - The nuclear option for reliability
            <a 
              href={href} 
              className={`${baseStyles} ${sizeStyles} hover:bg-[#F2CD5C] no-underline`}
              aria-label={label}
            >
              <ButtonContent />
            </a>
          ) : (
            <button
              onClick={handleClick}
              className={`${baseStyles} ${sizeStyles} hover:bg-[#F2CD5C]`}
              aria-label={label}
              type="button"
            >
              <ButtonContent />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
