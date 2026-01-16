'use client';

import FadeUp from '../ui/FadeUp';
import LottieAnimation from '@/components/ui/LottieAnimation';
import binaryFlowAnimation from '@/public/animations/binary-flow.json';

export default function Architecture() {
  const components = [
    {
      title: '1-Bit Half Adder',
      transistors: '~14 transistors',
      description: 'XOR + AND gates'
    },
    {
      title: '1-Bit Full Adder',
      transistors: '~28 transistors',
      description: '2× Half Adders + OR'
    },
    {
      title: '8-Bit Ripple Adder',
      transistors: '~224 transistors',
      description: '8× Full Adders cascaded'
    },
    {
      title: 'Complete ALU Core',
      transistors: '3,800+ transistors',
      description: 'Adder + Logic + Control'
    },
  ];

  const features = [
    {
      title: 'Bottom-Up Design',
      description: 'Built from fundamental 1-bit adders, systematically scaled to 8-bit operations'
    },
    {
      title: 'Ripple-Carry Adder',
      description: '8-bit addition with carry propagation through cascaded full adders'
    },
    {
      title: '2\'s Complement',
      description: 'Efficient subtraction using XOR inversion and carry-in manipulation'
    },
    {
      title: 'Modular Control',
      description: 'Centralized control unit with 4-bit opcode supporting 16+ operations'
    },
  ];

  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              System Architecture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From Transistors to Complete System
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-4">
              Every component designed with transistor-level understanding, optimized for efficiency
              while maintaining full functionality.
            </p>
          </div>
        </FadeUp>

        {/* Data Flow Visualization */}
        <FadeUp delay={0.1}>
          <div className="w-full max-w-4xl mx-auto mb-16 h-32 relative overflow-hidden glass glass-border rounded-lg flex items-center justify-center">
             <div className="absolute inset-0 opacity-30">
                <LottieAnimation animationData={binaryFlowAnimation} />
             </div>
             <p className="relative z-10 text-accent font-mono text-sm tracking-widest uppercase">
                &lt; 8-Bit Data Bus Architecture &gt;
             </p>
          </div>
        </FadeUp>

        {/* Component Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {components.map((component, index) => (
            <FadeUp key={component.title} delay={index * 0.1}>
              <div className="glass glass-border rounded-lg p-6 hover:bg-white/5 transition-colors">
                <div className="text-accent text-4xl font-bold mb-2">{index + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{component.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{component.transistors}</p>
                <p className="text-sm text-muted-foreground">{component.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Design Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FadeUp key={feature.title} delay={0.4 + index * 0.1}>
              <div className="glass glass-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
