'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import BuildJourney from '@/components/sections/BuildJourney';
import MetricsDashboard from '@/components/sections/MetricsDashboard';
import DesignPhilosophy from '@/components/sections/DesignPhilosophy';
import Architecture from '@/components/sections/Architecture';
import ProcessGallery from '@/components/sections/ProcessGallery';
import ExplodedView from '@/components/sections/ExplodedView';
import TechnicalSpecs from '@/components/sections/TechnicalSpecs';
import Specifications from '@/components/sections/Specifications';
import Hardware from '@/components/sections/Hardware';
import VideoShowcase from '@/components/sections/VideoShowcase';
import TestingStrategy from '@/components/sections/TestingStrategy';
import LogisimSimulation from '@/components/sections/LogisimSimulation';

import Documentation from '@/components/sections/Documentation';
import Footer from '@/components/sections/Footer';

// Dynamically import Scene to avoid SSR issues with Three.js
export default function Home() {
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

        {/* Hero Section */}
        <div className="relative">
          <Hero />
          {/* 3D Scene Removed for Performance - Available at /viewer */}
        </div>

        {/* Main Content */}
        <main>
          <BuildJourney />
          <MetricsDashboard />
          <DesignPhilosophy />
          <Architecture />
          <ProcessGallery />
          <ExplodedView />
          <TechnicalSpecs />
          <Specifications />
          <Hardware />
          <VideoShowcase />
          <TestingStrategy />
          <LogisimSimulation />

          <Documentation />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
