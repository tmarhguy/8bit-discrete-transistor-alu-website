'use client';

import FadeUp from '../ui/FadeUp';
import Image from 'next/image';

export default function FutureOptimizations() {
  return (
    <section id="future-optimizations" className="relative py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <div className="space-y-4">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                Feasibility Study
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5DEB3]">
                  Path to Realistic Feasibility
                </span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="prose prose-invert text-gray-400 leading-relaxed text-lg">
                <p className="mb-6">
                  While a fully discrete implementation of ~3,488 hand-soldered components would be a marvel of patience, it borders on the irrational for a solo, self-funded project. The sheer volume of connections introduces significant risks of electrical noise and signal degradation that could jeopardize the entire system.
                </p>
                <p>
                  To bridge the gap between theoretical purity and physical reality, I have adopted a <strong className="text-white">Hybrid Architecture</strong>. This approach ruthlessly prioritizes reliability without sacrificing the educational core of the project.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {/* Discrete Core Card */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                       <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       Fully Discrete Core
                    </h3>
                    <p className="text-sm text-gray-300">
                      The heart of the ALU—the <strong>8-bit Full Adder</strong>—is built from <strong className="text-white">368 discrete MOSFETs</strong>. All logical operations (NAND, NOR) also remain 100% discrete.
                    </p>
                  </div>
                </div>

                {/* Hybrid Support Card */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative z-10">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                       <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                       74xx Optimization
                    </h3>
                    <p className="text-sm text-gray-300">
                      <strong>Multiplexers</strong> and <strong>XORs</strong> utilize 74xx series chips to eliminate noise and reduce cost/size, ensuring a "Production Ready" build.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Visual/Quote Column */}
          <FadeUp delay={0.3}>
            <div className="relative">
               {/* Decorative Elements */}
               <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#D4AF37] rounded-full blur-[128px] opacity-10" />
               <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500 rounded-full blur-[128px] opacity-10" />

               <div className="glass glass-border rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                  
                  <blockquote className="relative z-10">
                    <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed mb-8">
                      "I have reconsidered the use of 74xx Muxes and XORs to cut electrical noise, reduce cost, and save time. <br/><br/>
                      However, the <span className="text-[#D4AF37] not-italic font-bold">Full Adder (368 MOSFETs)</span> remains fully discrete. <br/><br/>
                      To maintain engineering rigor, all multiplexers and XORs are being designed as discrete components in a separate branch. These implementations are validated via <span className="text-white not-italic">SPICE and RTL</span>, but will be integrated as 74xx series chips on the final ALU board."
                    </p>
                    <footer className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full border border-white/10 overflow-hidden shrink-0">
                        <Image
                          src="/media/images/profile.png"
                          alt="Tyrone Marhguy"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div className="text-white font-bold">Tyrone Marhguy</div>
                        <div className="text-xs text-[#D4AF37] uppercase tracking-wider">Computer Engineering Student</div>
                      </div>
                    </footer>
                  </blockquote>

                  {/* Tech verification badge */}
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-3">
                     <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                       SPICE Verified
                     </span>
                     <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                       RTL Validated
                     </span>
                     <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                       PCB Ready
                     </span>
                  </div>
               </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
