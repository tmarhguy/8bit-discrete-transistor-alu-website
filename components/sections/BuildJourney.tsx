'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeUp from '../ui/FadeUp';
import InteractiveGallery from '../ui/InteractiveGallery';
import { buildJourneyStages } from '@/lib/data/buildJourney';
import { BuildJourneyStage } from '@/lib/data/buildJourney';

function RoadmapCard({ stage, index }: { stage: BuildJourneyStage; index: number }) {
  const isCompleted = stage.status === 'completed';
  const isUpcoming = stage.status === 'upcoming';

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Mobile Timeline Dot (Hidden on Desktop) */}
      <div className="absolute left-[-5px] top-0 w-4 h-4 rounded-full bg-accent md:hidden border-4 border-background z-10" />

      <FadeUp delay={index * 0.1}>
        <div 
          className={`
            relative rounded-xl overflow-hidden border transition-all duration-300
            ${isCompleted 
              ? 'bg-black/40 backdrop-blur-md border-white/10 hover:border-accent/30' 
              : 'bg-[url("/grid.svg")] bg-zinc-950/80 border-dashed border-white/20'
            }
          `}
        >
          {/* Header */}
          <div className={`p-6 border-b ${isCompleted ? 'border-white/5' : 'border-white/10 border-dashed'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-5xl font-bold opacity-10 ${isCompleted ? 'text-accent' : 'text-white'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  {isUpcoming && (
                    <span className="text-xs font-mono text-accent uppercase tracking-widest mb-1 block">
                      Target Protocol
                    </span>
                  )}
                  <h3 className={`text-2xl font-bold ${isCompleted ? 'text-white' : 'text-white/70 font-mono'}`}>
                    {stage.title}
                  </h3>
                </div>
              </div>
              
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/20' : ''}
                ${isUpcoming ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 border-dashed' : ''}
                ${stage.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : ''}
              `}>
                {stage.status === 'completed' ? 'Verified' : stage.status === 'upcoming' ? 'Planned' : 'In Progress'}
              </div>
            </div>
            
            <p className={`${isCompleted ? 'text-muted-foreground' : 'text-white/50 font-mono'} max-w-2xl`}>
              {stage.description}
            </p>
          </div>

          {/* Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-white/10">
            {/* Left: Text & Specs */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className={`prose prose-invert prose-sm mb-6 ${isUpcoming ? 'font-mono text-white/60' : 'text-muted-foreground'}`}>
                   {stage.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-2">{paragraph}</p>
                   ))}
                </div>

                {/* Tools */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                    {isCompleted ? 'Technologies Used' : 'Required Tooling'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.tools.map(tool => (
                      <span 
                        key={tool}
                        className={`px-2 py-1 text-xs rounded-md ${
                          isCompleted 
                            ? 'bg-white/5 text-white/80' 
                            : 'border border-white/10 text-white/40 font-mono'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {stage.duration && (
                <div className="flex items-center gap-2 text-xs text-white/40 pt-6 border-t border-white/5">
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{isCompleted ? 'Completion Time:' : 'Est. Duration:'} {stage.duration}</span>
                </div>
              )}
            </div>

            {/* Right: Media Gallery */}
            <div className="relative min-h-[300px] bg-black/20">
               {isUpcoming && !stage.image.includes('placeholder') ? (
                  // Blueprint overlay for upcoming real assets
                 <div className="absolute inset-0 z-10 bg-blue-900/10 mix-blend-overlay pointer-events-none" />
               ) : null}
               
              <div className="h-full w-full p-4">
                 <InteractiveGallery 
                   images={[
                     ...(stage.video ? [stage.video] : []), 
                     stage.image, 
                     ...(stage.detailImages || [])
                   ].filter(Boolean)} 
                   title={stage.title}
                 />
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

export default function BuildJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="build-journey" className="relative py-32 overflow-hidden" ref={containerRef}>
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent dashed opacity-20" />
        <div className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent dashed opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
           <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Build <span className="text-accent">Timeline</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A transparent view into the engineering journey. From initial MOSFET simulations 
              to the upcoming fabrication of 3,800+ components.
            </p>
          </div>
        </FadeUp>

        <div className="relative grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 md:gap-12">
          {/* Timeline Track (Desktop) */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" />
            <motion.div 
               style={{ scaleY: scrollYProgress }} 
               className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-accent origin-top"
            />
            
            <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-24 py-12">
               {buildJourneyStages.map((_, i) => (
                 <div key={i} className="w-3 h-3 rounded-full bg-zinc-800 border-2 border-white/20 z-10" />
               ))}
            </div>
          </div>

          {/* Cards Column */}
          <div className="flex flex-col gap-16 md:gap-24 relative">
             {/* Mobile Timeline Line */}
             <div className="absolute left-[3px] top-6 bottom-6 w-px bg-white/10 md:hidden" />
             
             {buildJourneyStages.map((stage, index) => (
               <RoadmapCard key={stage.id} stage={stage} index={index} />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
