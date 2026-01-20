'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for the trailing ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is touch - disable custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      // Compensate for html zoom: 0.85
      const zoom = 0.85;
      cursorX.set(e.clientX / zoom);
      cursorY.set(e.clientY / zoom);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Efficient selector-based check instead of expensive getComputedStyle
      const isClickable = !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');

      setIsHovering(isClickable);
    };

    const handleMouseDown = () => setIsHovering(true);
    const handleMouseUp = () => setIsHovering(false); // Can refine this logic if needed

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    // window.addEventListener('mousedown', handleMouseDown);
    // window.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor globally
    document.documentElement.style.cursor = 'none';
    
    // Add global style for forcing none (sometimes computed style wins)
    const style = document.createElement('style');
    style.innerHTML = `
      * { 
        cursor: none !important; 
      }
      /* Ensure default cursor is hidden even on specific elements unless we want to show it */
      body, html, a, button, input, textarea, select {
        cursor: none !important;
      }
    `;
    style.id = 'cursor-style';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.style.cursor = 'auto';
      const existingStyle = document.getElementById('cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        style={{
          x: cursorX,
          y: cursorY,
          zIndex: 2147483647, // Max int to ensure visibility
        }}
        animate={{
          scale: isHovering ? 0.8 : 1
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transform origin-top-left"
        >
          {/* Arrow with tip at 0,0 */}
          <path 
            d="M0 0 L7 22 L11 11 L22 7 L0 0 Z" 
            fill="#D4AF37" 
            stroke="white" 
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </>
  );
}
