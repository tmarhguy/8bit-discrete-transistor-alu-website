'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full spinner"></div>
        <p className="mt-4 text-muted-foreground text-sm text-center">Loading 3D Scene...</p>
      </div>
    </div>
  );
}
