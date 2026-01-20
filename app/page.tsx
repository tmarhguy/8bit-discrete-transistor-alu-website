'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LazyRender from '@/components/ui/LazyRender';

const VerticalNav = dynamic(() => import('@/components/ui/VerticalNav'), { ssr: false });
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
const BuildJourney = dynamic(() => import('@/components/sections/BuildJourney'));
const MetricsDashboard = dynamic(() => import('@/components/sections/MetricsDashboard'));

// Lazy load below-fold sections for better initial page load
const DesignPhilosophy = dynamic(() => import('@/components/sections/DesignPhilosophy'));
const Architecture = dynamic(() => import('@/components/sections/Architecture'));
const ProcessGallery = dynamic(() => import('@/components/sections/ProcessGallery'));

const TechnicalSpecs = dynamic(() => import('@/components/sections/TechnicalSpecs'));
const Specifications = dynamic(() => import('@/components/sections/Specifications'));
const Hardware = dynamic(() => import('@/components/sections/Hardware'));
const VideoShowcase = dynamic(() => import('@/components/sections/VideoShowcase'));
const TestingStrategy = dynamic(() => import('@/components/sections/TestingStrategy'));
const LogisimSimulation = dynamic(() => import('@/components/sections/LogisimSimulation'));
const Documentation = dynamic(() => import('@/components/sections/Documentation'));
const Footer = dynamic(() => import('@/components/sections/Footer'));

// Dynamically import Scene to avoid SSR issues with Three.js
export default function Home() {
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return (
    <ErrorBoundary>
      <div className="relative">
        {/* Skip to main content link for accessibility */}
        <a
          href="#architecture"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-lg"
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <Navbar />
        {isDesktop && <VerticalNav />}

        {/* Hero Section */}
        <div className="relative">
          <Hero />
          {/* 3D Scene Removed for Performance - Available at /viewer */}
        </div>

        {/* Main Content */}
        <main>
          <BuildJourney />
          <MetricsDashboard />
          
          <LazyRender rootMargin="200px">
            <DesignPhilosophy />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <Architecture />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <ProcessGallery />
          </LazyRender>



          <LazyRender rootMargin="200px">
            <TechnicalSpecs />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <Specifications />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <Hardware />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <VideoShowcase />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <TestingStrategy />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <LogisimSimulation />
          </LazyRender>

          <LazyRender rootMargin="200px">
            <Documentation />
          </LazyRender>
        </main>

        {/* Footer */}
        <LazyRender rootMargin="100px">
          <Footer />
        </LazyRender>
      </div>
    </ErrorBoundary>
  );
}
