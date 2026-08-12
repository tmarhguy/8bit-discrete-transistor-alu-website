'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#build-journey', label: 'Build Journey' },
    { href: '#future-optimizations', label: 'Feasibility' },
    { href: '#architecture', label: 'Architecture' },
    { href: '#testing-strategy', label: 'Testing' },
    { href: '#video-showcase', label: 'Videos' },
    { href: '/viewer', label: '3D Viewer', isRoute: true },
    { href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu', label: 'GitHub', external: true },
    { href: 'https://tmarhguy.com', label: 'About Me', external: true, highlight: true },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass glass-border shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-foreground" 
            aria-label="8-bit Transistor ALU Home"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            8-bit Transistor ALU
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = link.isRoute && pathname === link.href;
              // @ts-ignore
              const isHighlighted = link.highlight || isActive;
              
              return link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isHighlighted ? 'text-[#D4AF37] font-semibold' : 'text-muted-foreground'
                  } hover:text-[#D4AF37] transition-colors`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`${
                    // @ts-ignore
                    link.highlight ? 'text-[#D4AF37] font-semibold' : 'text-muted-foreground'
                  } hover:text-[#D4AF37] transition-colors`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-foreground hover:text-[#D4AF37] transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass glass-border border-t"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block transition-colors py-3 ${
                    // @ts-ignore
                    link.highlight ? 'text-[#D4AF37] font-semibold' : 'text-muted-foreground hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block transition-colors py-3 ${
                    // @ts-ignore
                    link.highlight ? 'text-[#D4AF37] font-semibold' : 'text-muted-foreground hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
