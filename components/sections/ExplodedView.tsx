'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeUp from '../ui/FadeUp';
import TechnicalModal from '../ui/TechnicalModal';
import { models } from '@/lib/data/models';

export default function ExplodedView() {
  const [isExploded, setIsExploded] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const boardDetails = {
    'Main Control': {
      schematic: '/media/schematics/full/schematic_control_complete.png',
      pcbLayout: '/media/design/kicad/design_kicad_control_schematic.png',
      render3d: '/media/renders/3d/render_3d_control_top.png',
      description: 'Primary control board managing system operations with Arduino and 74HC logic',
      specs: [
        { label: 'Microcontroller', value: 'Arduino Nano' },
        { label: 'Logic ICs', value: '74HC595, 74HC165' },
        { label: 'I/O Pins', value: '16 digital' },
        { label: 'Power', value: '5V regulated' },
      ],
      designNotes: [
        'Serial communication for input/output',
        'Shift registers for efficient pin usage',
        'Debounced button inputs',
        'LED status indicators',
      ],
    },
    'Main Logic': {
      schematic: '/media/schematics/full/schematic_alu_complete.png',
      pcbLayout: '/media/design/kicad/design_kicad_alu_schematic.png',
      render3d: '/media/renders/3d/render_3d_alu_top.png',
      description: 'Core ALU with 3,800+ discrete transistors implementing all arithmetic and logic operations',
      specs: [
        { label: 'Transistors', value: '3,800+' },
        { label: 'Operations', value: '19 total' },
        { label: 'Data Width', value: '8-bit' },
        { label: 'Propagation Delay', value: '~50ns' },
      ],
      designNotes: [
        'Ripple-carry adder architecture',
        'Discrete transistor logic gates',
        'Optimized for transistor count',
        'Full 2\'s complement support',
      ],
    },
    'Flags': {
      schematic: '/media/schematics/full/schematic_flags_complete.png',
      pcbLayout: '/media/design/kicad/design_kicad_flags_schematic.png',
      render3d: '/media/renders/3d/render_3d_flags_top.png',
      description: 'Status flag indicators showing Carry, Zero, and Negative conditions',
      specs: [
        { label: 'Flags', value: 'C, Z, N' },
        { label: 'LED Drivers', value: '74HC595' },
        { label: 'Indicators', value: 'RGB LEDs' },
        { label: 'Update Rate', value: 'Real-time' },
      ],
      designNotes: [
        'Carry flag from MSB adder',
        'Zero detection via NOR gate',
        'Negative from sign bit',
        'Visual feedback for debugging',
      ],
    },
  };

  const handleBoardClick = (boardName: string) => {
    setSelectedBoard(boardName);
    setShowModal(true);
  };

  return (
    <section id="exploded-view" className="relative py-24 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              Interactive Exploration
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              System Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore the modular design with detailed views of each component board
            </p>
          </div>
        </FadeUp>

        {/* Toggle Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className="px-8 py-4 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium text-lg"
          >
            {isExploded ? 'Assemble View' : 'Explode View'}
          </button>
        </div>

        {/* Exploded View Visualization */}
        <div className="relative min-h-[600px] flex items-center justify-center mb-16">
          <div className="relative w-full max-w-4xl aspect-video">
            {/* Placeholder for actual 3D models or images */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isExploded ? 1.2 : 1,
                }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                {/* Main boards representation */}
                {models.slice(0, 3).map((model, index) => (
                  <motion.div
                    key={model.name}
                    animate={{
                      y: isExploded ? (index - 1) * 120 : 0,
                      x: isExploded ? (index - 1) * 80 : 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => handleBoardClick(model.name)}
                    style={{ zIndex: 3 - index }}
                  >
                    <div className="glass glass-border rounded-lg p-8 hover:bg-white/10 transition-colors">
                      <div className="text-center">
                        <div className="w-48 h-32 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.slice(0, 3).map((model, index) => (
            <FadeUp key={model.name} delay={0.1 * index}>
              <div
                className="glass glass-border rounded-lg p-6 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleBoardClick(model.name)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">{model.name}</h3>
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                <div className="text-xs text-accent font-mono">{model.details}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Technical Modal */}
      <AnimatePresence>
        {showModal && selectedBoard && boardDetails[selectedBoard as keyof typeof boardDetails] && (
          <TechnicalModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={selectedBoard}
            {...boardDetails[selectedBoard as keyof typeof boardDetails]}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
