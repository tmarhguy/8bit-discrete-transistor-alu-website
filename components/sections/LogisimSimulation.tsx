'use client';

import { useState, useEffect } from 'react';
import FadeUp from '../ui/FadeUp';
import VideoPlayer from '../ui/VideoPlayer';
import ImageLightbox from '../ui/ImageLightbox';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Zap, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LogisimSimulation() {
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const simulationVideos = [
    {
      src: '/media/videos/simulations/schematics_draw_demo.mp4',
      title: 'Schematic Entry Process',
      description: 'Designing the ALU schematics in the EDA tool. This demonstration captures the detailed process of creating the circuit diagrams.',
      poster: '/media/simulations/logisim/sim_logisim_evolution_full.webp',
    },
    {
      src: '/media/videos/simulations/sim_logisim_counter_running.mp4',
      title: 'Logisim ALU Simulation',
      description: 'Counter-driven test sequence cycling through all 19 operations with visual output verification',
      poster: '/media/simulations/logisim/sim_logisim_alu_layout.webp',
    },
  ];

  // Video keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if lightbox is not open to avoid conflict
      if (showLightbox) return;
      
      if (e.key === 'ArrowLeft') {
        setCurrentVideoIndex((prev) => (prev - 1 + simulationVideos.length) % simulationVideos.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentVideoIndex((prev) => (prev + 1) % simulationVideos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, simulationVideos.length]);

  const simulationFeatures = [
    {
      title: 'Complete System Model',
      description: 'Full 8-bit ALU with all 19 operations implemented in Logisim Evolution',
      icon: <Wrench className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />,
    },
    {
      title: 'Automated Testing',
      description: 'Counter-driven test sequences validate all operations systematically',
      icon: <Zap className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />,
    },
    {
      title: 'Visual Verification',
      description: 'LED displays show inputs, outputs, and flags in real-time',
      icon: <Eye className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />,
    },
    {
      title: 'Timing Analysis',
      description: 'Simulation validates propagation delays and critical paths',
      icon: <Clock className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />,
    },
  ];

  const simulationResults = [
    {
      operation: 'Arithmetic (ADD, SUB)',
      status: 'Verified',
      notes: 'All carry and overflow cases tested',
    },
    {
      operation: 'Logic (AND, OR, XOR)',
      status: 'Verified',
      notes: 'Bitwise operations confirmed',
    },
    {
      operation: 'Shifts (LSL, LSR, ASR)',
      status: 'Verified',
      notes: 'Available as arithmetic/logical shifts',
    },
    {
      operation: 'Special (REV, CMP)',
      status: 'Verified',
      notes: 'Bit reversal and comparison logic',
    },
    {
      operation: 'Flags (C, E, L, G)',
      status: 'Verified',
      notes: 'All flag conditions tested',
    },
  ];

  const hardwareMapping = [
    {
      logisim: 'Logic Gates',
      hardware: 'Discrete Transistor Circuits',
      mapping: '1:1 functional equivalence',
    },
    {
      logisim: 'Multiplexers',
      hardware: '74HC157 ICs',
      mapping: 'Direct IC replacement',
    },
    {
      logisim: 'Registers',
      hardware: '74HC595 Shift Registers',
      mapping: 'Serial-to-parallel conversion',
    },
    {
      logisim: 'Adder',
      hardware: 'Custom Ripple-Carry Adder',
      mapping: 'Transistor-level implementation',
    },
  ];

  const screenshots = [
    '/media/simulations/logisim/sim_logisim_evolution_full.webp',
    '/media/simulations/logisim/sim_logisim_alu_layout.webp',
  ];

  const openLightbox = (startIndex: number = 0) => {
    setLightboxImages(screenshots);
    setLightboxIndex(startIndex);
    setShowLightbox(true);
  };

  return (
    <section id="logisim-simulation" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              Digital Validation
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Logisim Simulation
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Complete system validation using Logisim Evolution before hardware fabrication
            </p>
          </div>
        </FadeUp>

        {/* Simulation Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {simulationFeatures.map((feature, index) => (
            <FadeUp key={feature.title} delay={0.1 * index}>
              <div className="glass glass-border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Simulation Video */}
        <FadeUp delay={0.3}>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Simulation in Action</h3>
              
              {/* Video Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + simulationVideos.length) % simulationVideos.length)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
                <span className="text-sm font-mono text-muted-foreground">
                  {currentVideoIndex + 1} / {simulationVideos.length}
                </span>
                <button
                  onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % simulationVideos.length)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </div>
            </div>

            <motion.div 
              className="relative aspect-video rounded-lg overflow-hidden bg-black/50 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x * velocity.x;
                const swipeConfidenceThreshold = 10000;
                if (swipe < -swipeConfidenceThreshold) {
                  setCurrentVideoIndex((prev) => (prev + 1) % simulationVideos.length);
                } else if (swipe > swipeConfidenceThreshold) {
                  setCurrentVideoIndex((prev) => (prev - 1 + simulationVideos.length) % simulationVideos.length);
                }
              }}
            >
              <VideoPlayer
                key={simulationVideos[currentVideoIndex].src}
                src={simulationVideos[currentVideoIndex].src}
                poster={simulationVideos[currentVideoIndex].poster}
                title={simulationVideos[currentVideoIndex].title}
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVideoIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-1">
                    {simulationVideos[currentVideoIndex].title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {simulationVideos[currentVideoIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </FadeUp>

        {/* Simulation Results */}
        <FadeUp delay={0.4}>
          <div className="glass glass-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Verification Results</h3>
            <div className="space-y-3">
              {simulationResults.map((result, index) => (
                <motion.div
                  key={result.operation}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{result.operation}</div>
                    <div className="text-sm text-muted-foreground">{result.notes}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 font-semibold">{result.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Hardware Mapping */}
        <FadeUp delay={0.5}>
          <div className="glass glass-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Logisim to Hardware Mapping</h3>
            <p className="text-muted-foreground mb-6">
              How Logisim components translate to physical hardware implementation
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Logisim Component</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Hardware Implementation</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {hardwareMapping.map((map, index) => (
                    <motion.tr
                      key={map.logisim}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 px-4 text-muted-foreground">{map.logisim}</td>
                      <td className="py-3 px-4 text-accent font-mono text-sm">{map.hardware}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{map.mapping}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        {/* Screenshots */}
        <FadeUp delay={0.6}>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Simulation Screenshots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={`${screenshot}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={screenshot}
                    alt={`Logisim simulation ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Key Insights */}
        <FadeUp delay={0.7}>
          <div className="glass glass-border rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Key Insights from Simulation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Design Validation</h4>
                <p className="text-sm text-muted-foreground">
                  All operations work correctly in simulation, giving confidence before hardware fabrication
                </p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Timing Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Propagation delays measured and validated against design targets
                </p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Test Coverage</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive test vectors cover edge cases and boundary conditions
                </p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Hardware Blueprint</h4>
                <p className="text-sm text-muted-foreground">
                  Simulation serves as reference for hardware debugging and validation
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrevious={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </section>
  );
}
