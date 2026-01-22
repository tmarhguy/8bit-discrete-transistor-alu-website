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
import BuildJourney from '@/components/sections/BuildJourney';
// Loading placeholder for better perceived performance
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center bg-black px-4">
    <div className="w-full max-w-4xl">
      <CardSkeleton />
    </div>
  </div>
);

const MetricsDashboard = dynamic(() => import('@/components/sections/MetricsDashboard'), {
  loading: () => <SectionLoader />,
});

// Lazy load below-fold sections for better initial page load
const DesignPhilosophy = dynamic(() => import('@/components/sections/DesignPhilosophy'), {
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
