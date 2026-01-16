'use client';

import FadeUp from '../ui/FadeUp';
import MetricCard from '../ui/MetricCard';

export default function MetricsDashboard() {
  const metrics = [
    {
      value: 3800,
      label: 'Transistors',
      description: 'Discrete components',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      animateValue: true,
    },
    {
      value: 19,
      label: 'Operations',
      description: 'Arithmetic & logic',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      animateValue: true,
    },
    {
      value: 8,
      label: 'PCB Boards',
      description: 'Custom designed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      animateValue: true,
    },
    {
      value: '12',
      label: 'Weeks',
      description: 'Development time',
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      animateValue: false,
    },
  ];

  return (
    <section id="metrics" className="relative py-24 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              By The Numbers
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Project Metrics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive 8-bit ALU built from scratch with meticulous attention to detail
            </p>
          </div>
        </FadeUp>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
              description={metric.description}
              icon={metric.icon}
              delay={index * 0.1}
              suffix={metric.suffix}
              animateValue={metric.animateValue}
            />
          ))}
        </div>

        {/* Additional Stats */}
        <FadeUp delay={0.6}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass glass-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Hand-soldered components</div>
            </div>
            <div className="glass glass-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">3 Tools</div>
              <div className="text-sm text-muted-foreground">KiCad, Electric VLSI, Logisim</div>
            </div>
            <div className="glass glass-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">8-bit</div>
              <div className="text-sm text-muted-foreground">Data path width</div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
