'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import FadeUp from '../ui/FadeUp';
import ImageLightbox from '../ui/ImageLightbox';
import {
  siliconGallery,
  logicGallery,
  hardwareGallery,
  verificationGallery,
  type GalleryItem,
} from '@/lib/data/processGallery';

type TabType = 'silicon' | 'logic' | 'hardware' | 'verification';

export default function ProcessGallery() {
  const [activeTab, setActiveTab] = useState<TabType>('silicon');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const tabs = [
    { id: 'silicon' as TabType, label: 'Micro-Architecture', items: siliconGallery },
    { id: 'logic' as TabType, label: 'Logic Design', items: logicGallery },
    { id: 'hardware' as TabType, label: 'Physical Board', items: hardwareGallery },
    { id: 'verification' as TabType, label: 'Verification', items: verificationGallery },
  ];

  const activeItems = tabs.find((tab) => tab.id === activeTab)?.items || [];
  const currentItem = activeItems[currentIndex];

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
    setDirection(0);
  }, [activeTab]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = activeItems.length - 1;
    if (newIndex >= activeItems.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  const openLightbox = () => {
    setLightboxImages(activeItems.map((item) => item.image));
    setLightboxIndex(currentIndex);
    setShowLightbox(true);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section id="process-gallery" className="relative py-24 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-sm sm:text-base mb-4 uppercase tracking-widest font-bold">
              Visual Documentation
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-white tracking-tight">
              Process Gallery
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light">
              Explore the engineering journey from silicon level to physical assembly.
            </p>
          </div>
        </FadeUp>

        {/* Categories Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-xs transition-colors ${
                  activeTab === tab.id ? 'text-black/60 font-bold' : 'text-zinc-600 group-hover:text-zinc-400'
                }`}>
                  {tab.items.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel View */}
        {activeItems.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 shadow-2xl group">
              
              {/* Main Content Animation */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  onClick={openLightbox}
                >
                  {currentItem.type === 'video' ? (
                    <video
                      src={currentItem.image}
                      poster={currentItem.poster}
                      className="w-full h-full object-contain bg-black"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={currentItem.image}
                      alt={currentItem.title}
                      fill
                      className="object-contain p-4 bg-zinc-900/20"
                      priority
                    />
                  )}
                  
                  {/* Overlay Gradient for Text Readability */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Information Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col md:flex-row justify-between items-end gap-4 pointer-events-none">
                <div className="text-left pointer-events-auto">
                   <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        {currentItem.category}
                      </span>
                      <span className="text-zinc-400 text-xs font-mono">
                         {String(currentIndex + 1).padStart(2, '0')} / {String(activeItems.length).padStart(2, '0')}
                      </span>
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentItem.title}</h3>
                   <p className="text-zinc-300 max-w-xl text-sm md:text-base border-l-2 border-[#D4AF37] pl-4">
                     {currentItem.description}
                   </p>
                </div>

                {/* Slideshow Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); openLightbox(); }}
                  className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-black font-bold text-sm tracking-wide hover:bg-white hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  OPEN SLIDESHOW
                </button>
              </div>

            </div>

            {/* Thumbnails Strip (Optional visual cue) */}
            <div className="flex justify-center gap-2 mt-8">
              {activeItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            
          </div>
        ) : (
          <div className="text-center py-20">
             <p className="text-zinc-500">No content available for this section.</p>
          </div>
        )}

      </div>

      {/* Lightbox Component */}
      <ImageLightbox
        images={lightboxImages}
        types={activeItems.map((item) => item.type)}
        currentIndex={lightboxIndex}
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrevious={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
        captions={activeItems.map((item) => item.description || item.title)}
      />
    </section>
  );
}
