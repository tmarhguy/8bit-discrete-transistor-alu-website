'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeUp from '../ui/FadeUp';
import VideoPlayer from '../ui/VideoPlayer';
import { featuredVideos, buildVideos, type VideoItem } from '@/lib/data/videos';

export default function VideoShowcase() {
  // Combine videos for the showcase, prioritizing featured and then build/others
  const showcaseVideos = [...featuredVideos, ...buildVideos];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedVideo = showcaseVideos[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseVideos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseVideos.length) % showcaseVideos.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showcaseVideos.length]);

  return (
    <section id="video-showcase" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              See It In Action
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Video Demonstrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Watch the complete build process and see all operations in action
            </p>
          </div>
        </FadeUp>

        {/* Main Video Player Area */}
        <FadeUp delay={0.2}>
          <div className="relative mb-12">
            <motion.div
              key={selectedVideo.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x * velocity.x;
                const swipeConfidenceThreshold = 10000;
                if (swipe < -swipeConfidenceThreshold) {
                  handleNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrev();
                }
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <VideoPlayer
                key={selectedVideo.id}
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                title={selectedVideo.title}
                className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10"
              />
            </motion.div>
            
            {/* Description and Controls */}
            <div className="mt-6 glass glass-border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left: Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-xs font-bold text-accent uppercase tracking-wider">
                     {selectedVideo.category}
                   </span>
                   <h3 className="text-2xl font-bold text-foreground">{selectedVideo.title}</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{selectedVideo.description}</p>
              </div>

              {/* Right: Navigation Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 hover:text-accent transition-all active:scale-95 border border-white/5"
                  aria-label="Previous Video"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <span className="text-zinc-500 font-mono font-medium text-lg min-w-[3rem] text-center">
                  {currentIndex + 1} / {showcaseVideos.length}
                </span>

                <button 
                  onClick={handleNext}
                  className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 hover:text-accent transition-all active:scale-95 border border-white/5"
                  aria-label="Next Video"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
