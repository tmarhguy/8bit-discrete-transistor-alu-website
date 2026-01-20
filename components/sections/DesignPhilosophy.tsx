'use client';

import FadeUp from '../ui/FadeUp';
import TextReveal from '../ui/TextReveal';
import { motion } from 'framer-motion';

export default function DesignPhilosophy() {
  const designDecisions = [
    {
      title: 'Why Discrete Transistors?',
      rationale: 'Building from transistor level provides deep understanding of digital logic fundamentals. While ICs would be simpler, designing each gate from MOSFETs teaches circuit design.',
      tradeoffs: [
        'Complete control over circuit behavior',
        'Understanding from first principles',
        'Unique portfolio piece',
      ],
      colSpan: 'md:col-span-2',
      bgGradient: 'from-blue-500/10 to-purple-500/10'
    },
    {
      title: 'Why Ripple-Carry?',
      rationale: 'Chosen for simplicity and optimization. While slower than lookahead, it requires significantly fewer gates.',
      tradeoffs: [
        '144 Discrete Transistors (Carry Chain)',
        'Simpler verification',
        'Easier to debug',
      ],
      colSpan: 'md:col-span-1',
      bgGradient: 'from-green-500/10 to-teal-500/10'
    },
    {
      title: 'Why 19 Operations?',
      rationale: 'Selected operations cover all essential categories: arithmetic (ADD/SUB), logic (AND/OR), and bit manipulation, providing a complete instruction set.',
      colSpan: 'md:col-span-1',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      title: 'Why 8-bit Architecture?',
      rationale: 'Provides the perfect balance between complexity and capability. Matches classic microprocessors like the 6502 and Z80.',
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
            text="If you struggle to sleep at 2am and your noisy brain suggests building an ALU from discrete transistors up, it's important that you listen."
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-12 max-w-5xl"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {designDecisions.map((decision, index) => (
            <FadeUp key={decision.title} delay={index * 0.1} className={`${decision.colSpan} h-full`}>
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
