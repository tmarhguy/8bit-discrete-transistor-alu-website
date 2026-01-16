'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

  const openLightbox = (items: GalleryItem[], startIndex: number) => {
    setLightboxImages(items.map((item) => item.image));
    setLightboxIndex(startIndex);
    setShowLightbox(true);
  };

  return (
    <section id="process-gallery" className="relative py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              Visual Documentation
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Process Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore the complete development process through detailed images and screenshots
            </p>
          </div>
        </FadeUp>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-background'
                  : 'glass glass-border text-foreground hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm opacity-75">({tab.items.length})</span>
            </button>
          ))}
        </div>

        {/* Masonry Gallery Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {activeItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid group relative rounded-lg overflow-hidden cursor-pointer bg-muted/20 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 border border-white/5 hover:border-accent/50"
              onClick={() => openLightbox(activeItems, index)}
            >
              {/* Media Container */}
              <div className="relative">
                {item.type === 'video' ? (
                  <div className="relative w-full aspect-video bg-black/50 flex items-center justify-center">
                    <video
                      src={item.image}
                      poster={item.poster}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-semibold mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Type Indicator (if video) */}
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {activeItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items in this category yet</p>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        types={activeItems.map(item => item.type)}
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
