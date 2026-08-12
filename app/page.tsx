'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LazyRender from '@/components/ui/LazyRender';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';

const VerticalNav = dynamic(() => import('@/components/ui/VerticalNav'), { ssr: false });
const FloatingActionButton = dynamic(() => import('@/components/ui/FloatingActionButton'), { ssr: false });
const PWAInstallPrompt = dynamic(() => import('@/components/ui/PWAInstallPrompt'), { ssr: false });
import RegisterServiceWorker from '@/app/register-sw';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';

// Loading placeholder for better perceived performance
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center bg-black px-4">
    <div className="w-full max-w-4xl">
      <CardSkeleton />
    </div>
  </div>
);

// Custom loader for BuildJourney to differentiate from generic sections and match the dark gradient
const BuildJourneyLoader = () => (
  <div className="relative py-24 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden min-h-[800px] flex flex-col items-center justify-center">
     <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
           <div className="h-10 w-64 bg-zinc-900 rounded-lg mx-auto animate-pulse" />
           <div className="h-6 w-96 bg-zinc-900/50 rounded-lg mx-auto animate-pulse" />
        </div>
        
        {/* Timeline placeholder */}
        <div className="w-full h-1 bg-zinc-900 relative my-12" />
        
        {/* Content Placeholder */}
        <div className="glass glass-border rounded-2xl p-8 min-h-[500px]">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
             <div className="space-y-6">
                <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
                <div className="space-y-3">
                   <div className="h-4 w-full bg-zinc-800/50 rounded animate-pulse" />
                   <div className="h-4 w-[90%] bg-zinc-800/50 rounded animate-pulse" />
                   <div className="h-4 w-[95%] bg-zinc-800/50 rounded animate-pulse" />
                </div>
             </div>
             <div className="bg-zinc-900 rounded-xl h-full min-h-[400px] animate-pulse" />
           </div>
        </div>
     </div>
  </div>
);

const BuildJourney = dynamic(() => import('@/components/sections/BuildJourney'), {
  loading: () => <BuildJourneyLoader />,
});

const MetricsDashboard = dynamic(() => import('@/components/sections/MetricsDashboard'), {
  loading: () => <SectionLoader />,
});

// Lazy load below-fold sections for better initial page load
const DesignPhilosophy = dynamic(() => import('@/components/sections/DesignPhilosophy'), {
  loading: () => <SectionLoader />,
});

const FutureOptimizations = dynamic(() => import('@/components/sections/FutureOptimizations'), {
  loading: () => <SectionLoader />,
});

const Architecture = dynamic(() => import('@/components/sections/Architecture'), {
  loading: () => <SectionLoader />,
});

const ProcessGallery = dynamic(() => import('@/components/sections/ProcessGallery'), {
  loading: () => <SectionLoader />,
});

const TechnicalSpecs = dynamic(() => import('@/components/sections/TechnicalSpecs'), {
  loading: () => <SectionLoader />,
});

const Specifications = dynamic(() => import('@/components/sections/Specifications'), {
  loading: () => <SectionLoader />,
});

const Hardware = dynamic(() => import('@/components/sections/Hardware'), {
  loading: () => <SectionLoader />,
});

const VideoShowcase = dynamic(() => import('@/components/sections/VideoShowcase'), {
  loading: () => <SectionLoader />,
});

const TestingStrategy = dynamic(() => import('@/components/sections/TestingStrategy'), {
  loading: () => <SectionLoader />,
});

const LogisimSimulation = dynamic(() => import('@/components/sections/LogisimSimulation'), {
  loading: () => <SectionLoader />,
});

const Documentation = dynamic(() => import('@/components/sections/Documentation'), {
  loading: () => <SectionLoader />,
});

const Footer = dynamic(() => import('@/components/sections/Footer'), {
  loading: () => <SectionLoader />,
});

// Dynamically import Scene to avoid SSR issues with Three.js
export default function Home() {
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return (
    <ErrorBoundary>
      <RegisterServiceWorker />
      <div className="relative">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-lg"
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <Navbar />
        {isDesktop && <VerticalNav />}
        
        {/* FAB for quick access to 3D Viewer (Desktop & Mobile) */}
          <FloatingActionButton
            href="/viewer"
            label="View in 3D"
            position="bottom-right"
            showOnScroll={true}
            scrollThreshold={400}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            }
          />

        {/* Hero Section */}
        <div className="relative">
          <Hero />
          {/* 3D Scene Removed for Performance - Available at /viewer */}
        </div>

        {/* Main Content */}
        <main id="main" className="pb-[100vh]">
          <BuildJourney />
          <MetricsDashboard />
          
          <LazyRender rootMargin="400px">
            <FutureOptimizations />
          </LazyRender>
          
          <LazyRender rootMargin="400px">
            <DesignPhilosophy />
          </LazyRender>



          <LazyRender rootMargin="400px">
            <Architecture />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <ProcessGallery />
          </LazyRender>



          <LazyRender rootMargin="400px">
            <TechnicalSpecs />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <Specifications />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <Hardware />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <VideoShowcase />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <TestingStrategy />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <LogisimSimulation />
          </LazyRender>

          <LazyRender rootMargin="400px">
            <Documentation />
          </LazyRender>
        </main>

        {/* Footer */}
        <LazyRender rootMargin="100px">
          <Footer />
        </LazyRender>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </ErrorBoundary>
  );
}
