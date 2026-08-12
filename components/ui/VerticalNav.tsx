'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'build-journey', label: 'Timeline' },
  { id: 'future-optimizations', label: 'Feasibility' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'process-gallery', label: 'Gallery' },
  { id: 'testing-strategy', label: 'Testing' },
  { id: 'video-showcase', label: 'Videos' },
];

export default function VerticalNav() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Visibility: Show after passing 80vh (Hero mostly gone)
      const shouldShow = window.scrollY > window.innerHeight * 0.8;
      setIsVisible(shouldShow);

      // Active Section Detection
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
        >
          <div className="flex flex-col space-y-6">
            {sections.map((section, index) => {
               const isActive = activeSection === section.id;
               return (
                 <a 
                   key={section.id} 
                   href={`#${section.id}`}
                   aria-label={`Navigate to ${section.label} section`}
                   className="group flex items-center gap-4"
                 >
                   {/* Label */}
                   <span 
                     className={`
                       text-xs font-medium uppercase tracking-widest transition-all duration-300
                       ${isActive ? 'text-[#D4AF37] opacity-100 translate-x-0' : 'text-gray-500 opacity-60 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                     `}
                   >
                     {section.label}
                   </span>
                   
                   {/* Indicator Line/Dot */}
                   <div 
                     className={`
                       h-[1px] transition-all duration-300
                       ${isActive ? 'w-12 bg-[#D4AF37]' : 'w-6 bg-gray-700 group-hover:bg-gray-500 group-hover:w-8'}
                     `}
                   />
                 </a>
               );
            })}
          </div>
          
          {/* Vertical Decorator Line */}
          <div className="absolute top-0 bottom-0 left-[calc(100%+1rem)] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
