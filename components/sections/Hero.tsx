'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black pt-12 sm:pt-20 pb-6"
    >
      {/* 1. Ambient Lighting (Subtle Top Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-black to-black pointer-events-none z-0 opacity-50" />

      {/* 2. Main Product Image (Top) */}
      <motion.div 
        style={{ scale: imageScale, y: imageY }}
        className="relative z-10 w-full max-w-[1400px] h-[30vh] sm:h-[40vh] flex items-center justify-center perspective-[1000px] mt-8 lg:mt-18 mb-16"
      >
        <motion.div 
           initial={{ scale: 0.95, rotateX: 5 }}
           animate={{ scale: 1, rotateX: 0 }}
           transition={{ duration: 1.0, ease: [0.2, 1, 0.3, 1] }}
           className="relative w-full h-full max-w-[50%] mx-auto"
        >
           {/* Spotlights behind image */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-center bg-no-repeat bg-[radial-gradient(circle_farthest-corner,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-[60px]" />
           
            <Image
              src="/media/pcb/renders/alu_slant.webp"
              alt="8-Bit Transistor ALU"
              fill
              className="object-contain object-center drop-shadow-[0_-20px_60px_rgba(212,175,55,0.1)]"
              priority
              quality={90}
            />
        </motion.div>
      </motion.div>
      
      {/* 3. Typography Group (Bottom Center) */}
      <motion.div 
        style={{ opacity: textOpacity, scale: textScale }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto shrink-0 z-20"
      >
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-white mb-4 lg:mb-10">
            8-Bit ALU
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-[#86868b] font-medium max-w-2xl mx-auto mb-6 lg:mb-14 leading-relaxed">
            3,488 transistors (624 discrete MOSFETs + 2,864 inside 74HC logic). Built to answer a 3am question: Could I rebuild a computer as a personal project within a medieval timeline?
          </p>

          {/* Links - Gold */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 lg:mt-20 mb-12">
             <a 
               href="/viewer" 
               className="group relative px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#F2CD5C] hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center gap-3"
             >
               <span>View in 3D</span>
               <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
               </svg>
             </a>
             
             <a 
               href="#build-journey" 
               className="text-[#86868b] hover:text-white transition-colors flex items-center gap-2 text-lg font-medium group px-4 py-2"
             >
               Explore the Journey
               <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
