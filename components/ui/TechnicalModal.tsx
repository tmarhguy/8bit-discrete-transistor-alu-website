'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  schematic?: string;
  pcbLayout?: string;
  render3d?: string;
  description?: string;
  specs?: { label: string; value: string }[];
  designNotes?: string[];
}

export default function TechnicalModal({
  isOpen,
  onClose,
  title,
  schematic,
  pcbLayout,
  render3d,
  description,
  specs,
  designNotes,
}: TechnicalModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-6xl w-full glass glass-border rounded-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 pr-12">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-muted-foreground mb-6">{description}</p>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {schematic && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Schematic</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <Image
                    src={schematic}
                    alt={`${title} schematic`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {pcbLayout && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">PCB Layout</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <Image
                    src={pcbLayout}
                    alt={`${title} PCB layout`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {render3d && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">3D Render</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <Image
                    src={render3d}
                    alt={`${title} 3D render`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          {specs && specs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground text-sm">{spec.label}</span>
                    <span className="text-foreground font-medium text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Notes */}
          {designNotes && designNotes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Design Notes</h3>
              <ul className="space-y-2">
                {designNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Download Button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button className="w-full sm:w-auto px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium">
              Download Schematics
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
