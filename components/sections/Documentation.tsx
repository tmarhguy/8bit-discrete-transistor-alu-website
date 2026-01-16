'use client';

import FadeUp from '../ui/FadeUp';
import { projectStats } from '@/lib/data/stats';

export default function Documentation() {
  const resources = [
    {
      title: 'Complete Documentation',
      description: 'Architecture overview, design decisions, and implementation details',
      link: 'https://github.com/tmarhguy/cpu#readme'
    },
    {
      title: 'Opcode Reference',
      description: 'Complete operation table with truth tables and timing diagrams',
      link: 'https://github.com/tmarhguy/cpu/tree/main/spec'
    },
    {
      title: 'KiCad Schematics',
      description: 'Complete PCB designs for all modules with component placement',
      link: 'https://github.com/tmarhguy/cpu/tree/main/schematics'
    },
    {
      title: 'Verilog Implementation',
      description: 'FPGA port with comprehensive testbenches and verification',
      link: 'https://github.com/tmarhguy/cpu/tree/main/hardware'
    },
  ];

  return (
    <section id="documentation" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Documentation & Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive Project Documentation
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-4">
              Complete design files, schematics, simulations, and implementation details.
              All resources available on GitHub.
            </p>
          </div>
        </FadeUp>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {resources.map((resource, index) => (
            <FadeUp key={resource.title} delay={index * 0.1}>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-border rounded-lg p-6 hover:bg-white/5 transition-all hover:scale-105 block"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <span className="text-accent text-sm font-medium">View on GitHub →</span>
              </a>
            </FadeUp>
          ))}
        </div>

        {/* Project Statistics */}
        <FadeUp delay={0.4}>
          <div className="glass glass-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {projectStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* GitHub CTA */}
        <FadeUp delay={0.5}>
          <div className="text-center mt-12">
            <a
              href="https://github.com/tmarhguy/cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-bold text-lg"
            >
              View Full Project on GitHub
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
