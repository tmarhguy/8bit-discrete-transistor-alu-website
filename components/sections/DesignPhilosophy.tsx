'use client';

import FadeUp from '../ui/FadeUp';
import TextReveal from '../ui/TextReveal';
import { motion } from 'framer-motion';

export default function DesignPhilosophy() {
  const designDecisions = [
    {
      title: 'The Pursuit of Verifiability',
      rationale: 'Initial designs relied on 74xx ICs as temporary placeholders to prove circuit behavior. The current build intentionally bridges the gap: 624 discrete MOSFET gates live on the custom boards while 2,864 transistors remain inside trusted 74HC logic ICs for routing and arithmetic. This hybrid stage lets me verify the discrete logic without sacrificing a shipped system, and future iterations can ultimately migrate more blocks to discrete MOSFET meshes.',
      tradeoffs: [
        'Hybrid build (624 discrete + 2,864 IC)',
        'Physical verifiability for MOSFET gates',
        'IC-based routing keeps delivery on track',
      ],
      colSpan: 'md:col-span-2',
      bgGradient: 'from-blue-500/10 to-purple-500/10'
    },
    {
      title: 'MOSFET-Level Efficiency',
      rationale: 'Textbook logic gates are inefficient in silicon. By ignoring standard gate-level design and optimizing at the transistor level (NAND/NOR topologies), I reduced the complexity of a single MUX from 66 to 42 transistors. This 36% reduction bridges the gap between amateur schematics and genuine VLSI efficiency.',
      tradeoffs: [
        'Custom Transistor Topologies',
        '36% Silicon Reduction',
        'Transmission Gate Logic',
      ],
      colSpan: 'md:col-span-1',
      bgGradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      title: 'Pragmatic Constraint',
      rationale: 'Engineering without constraint is a fantasy. This 19-operation ISA represents a necessary compromise—sacrificing the theoretical elegance of a larger instruction set for a design that remains robust and architecturally sound.',
      colSpan: 'md:col-span-1',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      title: 'The Goldilocks Architecture',
      rationale: 'Two bits is a toy; thirty-two is a career. Eight bits represents the absolute limit of what a solo sophomore can verify alone. It mirrors the constraints that shaped legendary chips like the 6502, balancing the ambition of a CPU with the reality of one student\'s bandwidth.',
      tradeoffs: [
        'Designed Solo',
        'Sophomore Year Project',
        '3,488 Total Transistors (624 discrete + 2,864 IC)',
      ],
      colSpan: 'md:col-span-2',
      bgGradient: 'from-indigo-500/10 to-blue-500/10'
    },
  ];

  return (
    <section id="design-philosophy" className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-style Large Header with Text Reveal */}
        <div className="mb-32">
          <FadeUp>
            <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-6">
              Engineering Mindset
            </p>
          </FadeUp>
          <TextReveal 
            text="If you struggle to sleep at 3am and your noisy brain suggests building an ALU from discrete transistors up, it's important that you listen."
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-12 max-w-5xl"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {designDecisions.map((decision, index) => (
            <FadeUp key={decision.title} delay={index * 0.001} className={`${decision.colSpan} h-full`}>
              <div className={`h-full relative overflow-hidden rounded-3xl p-8 md:p-12 border border-white/10 bg-gradient-to-br ${decision.bgGradient} backdrop-blur-3xl transition-transform hover:scale-[1.01] duration-500`}>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{decision.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">{decision.rationale}</p>
                  </div>
                  
                  {decision.tradeoffs && (
                    <div className="space-y-3">
                      {decision.tradeoffs.map((t) => (
                        <div key={t} className="flex items-center gap-3 text-sm font-medium text-white/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Performance Metrics - Minimalist */}
        <FadeUp>
          <div className="border-t border-white/10 pt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                { label: 'Gate Response', value: '~10ns', detail: 'Simulation Target' },
                { label: 'Architecture', value: 'Combinational', detail: 'Pure Logic' },
                { label: 'Power Draw', value: '~2.5W', detail: 'Efficiency' },
              ].map((stat) => (
                <div key={stat.label} className="text-center md:text-left group cursor-default">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50">
                    {stat.value}
                  </div>
                  <div className="text-xl font-medium text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
