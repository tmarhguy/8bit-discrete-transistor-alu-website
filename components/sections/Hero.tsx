'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import FadeUp from '../ui/FadeUp';
import { heroStats } from '@/lib/data/stats';
import LottieAnimation from '@/components/ui/LottieAnimation';
import rippleAnimation from '@/public/animations/alu-ripple.json';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background - will be added via Scene component in main page */}
      <div className="absolute inset-0 z-0" id="hero-3d-background" />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <FadeUp>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 uppercase tracking-wider">
            Computer Engineering Project
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
              8-BIT
            </span>
            <br />
            <span className="text-foreground">TRANSISTOR ALU</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive arithmetic logic unit constructed from 3,800+ discrete transistors.
            Engineered from first principles.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Supporting 19 operations including arithmetic, logic, and bit manipulation.
            All design decisions justified through comprehensive transistor cost analysis.
          </p>
        </FadeUp>

        {/* Instant Visuals (PCB, Schematic, VLSI, Simulation) */}
        <FadeUp delay={0.35}>
          <div className="flex justify-center gap-4 mb-10">
            {/* PCB Layout */}
            <div className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg transform rotate-[-8deg] hover:rotate-0 transition-transform hover:z-20 hover:scale-110">
               <Image 
                 src="/media/design/kicad/design_kicad_alu_pcb_layout.png" 
                 alt="PCB Layout" 
                 fill
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
               <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 PCB Layout (KiCad)
               </div>
            </div>

            {/* VLSI Design */}
            <div className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-transform hover:z-20 hover:scale-110">
               <Image 
                 src="/media/design/vlsi/design_electric_xor.png" 
                 alt="VLSI Design" 
                 fill
                 className="object-cover scale-150"
                 priority
               />
               <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 VLSI Optimization
               </div>
            </div>

            {/* Schematic */}
            <div className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg transform rotate-[3deg] hover:rotate-0 transition-transform hover:z-20 hover:scale-110">
               <Image 
                 src="/media/design/kicad/design_kicad_alu_schematic.jpg" 
                 alt="Schematic" 
                 fill
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
               <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 Schematic Design
               </div>
            </div>

            {/* Simulation */}
            <div className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg transform rotate-[8deg] hover:rotate-0 transition-transform hover:z-20 hover:scale-110">
               <Image 
                 src="/media/simulations/logisim/sim_logisim_evolution_full.png" 
                 alt="Logisim Simulation" 
                 fill
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
               <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 Logisim Simulation
               </div>
            </div>
          </div>
        </FadeUp>

        {/* CTA Buttons */}
        <FadeUp delay={0.4}>
          <div className="relative">
            {/* Ripple Animation Backend */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none -z-10">
              <LottieAnimation animationData={rippleAnimation} />
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <a
                href="#architecture"
                className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Explore Architecture
              </a>
              <a
                href="#hardware"
                className="px-6 py-3 glass glass-border rounded-lg hover:bg-white/10 transition-colors font-medium text-foreground"
              >
                View Hardware
              </a>
              <a
                href="https://github.com/tmarhguy/cpu"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass glass-border rounded-lg hover:bg-white/10 transition-colors font-medium text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </FadeUp>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {heroStats.map((stat, index) => (
            <FadeUp key={stat.label} delay={0.5 + index * 0.1}>
              <div className="glass glass-border rounded-lg p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Scroll Indicator */}
        <FadeUp delay={0.9}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16"
          >
            <a href="#architecture" className="inline-block">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </motion.div>
        </FadeUp>
      </div>

      {/* Instructions Badge */}

    </section>
  );
}
