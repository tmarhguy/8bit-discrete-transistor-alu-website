'use client';

export default function LoadingSpinner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full spinner"></div>
      {children}
    </div>
  );
}
