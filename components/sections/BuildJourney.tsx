'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FadeUp from '../ui/FadeUp';
import InteractiveGallery from '../ui/InteractiveGallery';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { haptics } from '@/lib/utils/haptics';
import { buildJourneyStages } from '@/lib/data/buildJourney';
import { BuildJourneyStage } from '@/lib/data/buildJourney';

function TimelineNode({ 
  stage, 
  index, 
  isSelected 
}: { 
  stage: BuildJourneyStage; 
  index: number; 
  isSelected: boolean;
}) {
  const isCompleted = stage.status === 'completed';
  const isUpcoming = stage.status === 'upcoming';
  const isInProgress = stage.status === 'in-progress';

  return (
    <motion.div
      className="relative flex flex-col items-center group cursor-pointer flex-shrink-0"
      style={{ width: 60 }}
    >
      {/* Node Circle */}
      <motion.div
        className={`
          relative rounded-full border-4 transition-all duration-300
          ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 z-10' : ''}
          ${isCompleted 
            ? 'bg-[#D4AF37] border-[#F5DEB3] shadow-[0_0_20px_rgba(212,175,55,0.5)]' 
            : isUpcoming
            ? 'bg-zinc-800 border-zinc-600 border-dashed'
            : 'bg-amber-600 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
          }
        `}
        style={{ 
          width: 60,
          height: 60,
        }}
      >
      <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${isCompleted ? 'text-white' : 'text-white/60'}`}>
            {index + 1}
          </span>
        </div>
      </motion.div>

      {/* Label - always visible */}
      <div className={`absolute top-full mt-4 text-center pointer-events-none w-32 left-1/2 -translate-x-1/2 hidden md:block ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        <motion.p 
          className={`text-xs font-semibold transition-colors mb-1 line-clamp-2 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}
        >
          {stage.title}
        </motion.p>
        <p className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">
          {stage.duration}
        </p>
      </div>
    </motion.div>
  );
}

function DetailPanel({ 
  stage, 
  onNext, 
  onPrev 
}: { 
  stage: BuildJourneyStage | null;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  if (!stage) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg">Select a milestone to see details</p>
      </div>
    );
  }

  const isCompleted = stage.status === 'completed';
  const isUpcoming = stage.status === 'upcoming';

  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
    >
      {/* Left: Content */}
      <div className="flex flex-col justify-center space-y-6">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onPrev?.(); haptics.tap(); }}
                disabled={!onPrev}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed group min-w-[48px] min-h-[48px] flex items-center justify-center"
                title="Previous Milestone"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
              </button>
              <button
                onClick={() => { onNext?.(); haptics.tap(); }}
                disabled={!onNext}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed group min-w-[48px] min-h-[48px] flex items-center justify-center"
                title="Next Milestone"
                aria-label="Next Milestone"
              >
                <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
              </button>
              <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold hidden sm:inline">
                Navigate Timeline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
              ${isCompleted ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20' : ''}
              ${isUpcoming ? 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 border-dashed' : ''}
              ${stage.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : ''}
            `}>
              {stage.status === 'completed' ? 'Verified' : stage.status === 'upcoming' ? 'Planned' : 'In Progress'}
            </span>
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-3">
            {stage.title}
          </h3>
          
          <p className="text-lg text-gray-400">
            {stage.description}
          </p>
        </div>

        {/* Content */}
        <div className="text-gray-300 space-y-2">
          {stage.content.split('\n').map((paragraph, i) => {
            // Convert **text** to <strong>text</strong>
            const htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
              <p 
                key={i} 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          })}
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            {isCompleted ? 'Technologies Used' : 'Required Tooling'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {stage.tools.map(tool => (
              <span 
                key={tool}
                className="px-3 py-1 text-xs rounded-md bg-white/5 text-white/80 border border-white/10"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Duration */}
        {stage.duration && (
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-white/5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isCompleted ? 'Completion Time:' : 'Est. Duration:'} {stage.duration}</span>
          </div>
        )}
      </div>

      {/* Right: Media */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 min-h-[400px]">
        <div className="h-full w-full p-4">
          <InteractiveGallery 
            images={[
              ...(stage.video ? [stage.video] : []), 
              stage.image, 
              ...(stage.detailImages || [])
            ].filter(Boolean)} 
            title={stage.title}
            poster={stage.image}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function BuildJourney() {
  const [selectedStage, setSelectedStage] = useState<BuildJourneyStage | null>(buildJourneyStages[0]);

  const handleStageSelect = (stage: BuildJourneyStage) => {
    haptics.selectionChange();
    setSelectedStage(stage);
  };

  const handleNext = () => {
    const currentIndex = buildJourneyStages.findIndex(s => s.id === selectedStage?.id);
    if (currentIndex < buildJourneyStages.length - 1) {
      haptics.selectionChange();
      setSelectedStage(buildJourneyStages[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = buildJourneyStages.findIndex(s => s.id === selectedStage?.id);
    if (currentIndex > 0) {
      haptics.selectionChange();
      setSelectedStage(buildJourneyStages[currentIndex - 1]);
    }
  };

  return (
    <section id="build-journey" className="relative py-24 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Build <span className="text-[#D4AF37]">Timeline</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From MOSFET simulations to full system assembly. Click each milestone to explore the journey.
            </p>
          </div>
        </FadeUp>

        {/* Horizontal Timeline Dock */}
        <FadeUp delay={0.2}>
          <div className="mb-16 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-8 scrollbar-hide relative snap-x snap-mandatory">
            {/* Scroll Hint for Mobile */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 lg:hidden pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 animate-pulse">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-xs text-white/60 font-medium">Scroll timeline</span>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
            
            <div className="relative mx-auto w-max lg:w-auto lg:max-w-5xl mt-12 lg:mt-0">
              {/* Timeline Line */}
              <div className="absolute top-[30px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Nodes */}
              <div className="relative flex justify-between items-start px-8 py-4 gap-4 lg:gap-0">
                {buildJourneyStages.map((stage, index) => {
                  const isSelected = selectedStage?.id === stage.id;
                  return (
                    <div
                      key={stage.id}
                      onClick={() => handleStageSelect(stage)}
                      className="snap-center"
                    >
                      <TimelineNode 
                        stage={stage} 
                        index={index} 
                        isSelected={isSelected}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Detail Panel */}
        <FadeUp delay={0.4}>
          <div className="glass glass-border rounded-2xl p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <DetailPanel 
                stage={selectedStage} 
                onPrev={(() => {
                  const currentIndex = buildJourneyStages.findIndex(s => s.id === selectedStage?.id);
                  if (currentIndex > 0) {
                    return handlePrev;
                  }
                  return undefined;
                })()}
                onNext={(() => {
                  const currentIndex = buildJourneyStages.findIndex(s => s.id === selectedStage?.id);
                  if (currentIndex < buildJourneyStages.length - 1) {
                    return handleNext;
                  }
                  return undefined;
                })()}
              />
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
