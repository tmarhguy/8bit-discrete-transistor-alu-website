'use client';

import Link from 'next/link';
import HybridPCBViewer from '@/components/3d/HybridPCBViewer';

// Note: The HybridPCBViewer handles its own state (Exploded vs Assembled)
// and handles the loading of the heavy 3D scene securely.
// This page wrapper just provides the route and the "Back" navigation.

export default function ViewerPage() {
  return (
    <div 
      id="full-screen-viewer"
      className="relative overflow-hidden bg-background w-screen h-[100dvh] supports-[height:100svh]:h-[100svh]"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)', 
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Back to Home Link */}
      <Link
        href="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 glass glass-border px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-foreground hover:bg-white/5 transition-colors text-xs md:text-sm font-medium"
        style={{ marginTop: 'env(safe-area-inset-top)', marginLeft: 'env(safe-area-inset-left)' }}
      >
        ← Back
      </Link>

      {/* Hybrid Viewer (Handles Mode Toggles & Layout) */}
      <HybridPCBViewer initialMode="3D_ASSEMBLED" />
    </div>
  );
}

