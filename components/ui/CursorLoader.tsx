'use client';

import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Lazy load the cursor component so framer-motion isn't bundled for mobile users if possible
const CustomCursor = dynamic(() => import('./CustomCursor'), { 
  ssr: false 
});

export default function CursorLoader() {
  // Only load custom cursor on devices with a fine pointer (mouse/trackpad)
  // This prevents downloading/running cursor logic on phones/tablets
  const isPointerFine = useMediaQuery('(pointer: fine)');

  if (!isPointerFine) return null;

  return <CustomCursor />;
}
