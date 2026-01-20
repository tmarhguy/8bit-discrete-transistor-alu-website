import { Mail, Globe, Linkedin, Twitter, Newspaper, Instagram } from 'lucide-react';

export default function Footer() {
  const projectLinks = [
    { label: 'Architecture', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/blob/main/docs/ARCHITECTURE.md' },
    { label: 'Specifications', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/spec' },
    { label: 'Hardware', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/schematics' },
    { label: 'Documentation', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/docs' },
  ];

  const resourceLinks = [
    { label: 'GitHub Repository', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu' },
    { label: 'KiCad Files', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/schematics/kicad' },
    { label: 'Verilog Code', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/sim/FPGA' },
    { label: 'Test Vectors', href: 'https://github.com/tmarhguy/8bit-discrete-transistor-alu/tree/main/test/vectors' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Project Info */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              <a href="https://alu.tmarhguy.com" className="hover:text-primary transition-colors">
                8-Bit Transistor ALU
              </a>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              A complete Arithmetic Logic Unit designed and built from 3,488 transistors.
              Demonstrating first-principles computer architecture.
            </p>
          </div>

          {/* The Maker */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">The Maker</h4>
            <div className="space-y-2">
              <a href="https://tmarhguy.com" target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-foreground hover:text-primary transition-colors w-fit">
                Tyrone Marhguy
              </a>
              <div className="text-xs text-muted-foreground">
                <a href="https://cmpe.seas.upenn.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Computer Engineering BSE
                </a>
                <br />
                <a href="https://upenn.edu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  University of Pennsylvania
                </a>
              </div>
              <p className="text-xs text-muted-foreground italic pt-1">Personal Project</p>
              
              <div className="flex items-center gap-3 pt-3">
                <a href="mailto:tmarhguy@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" title="Email">
                  <Mail size={18} />
                </a>
                <a href="https://tmarhguy.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Portfolio">
                  <Globe size={18} />
                </a>
                <a href="https://linkedin.com/in/tmarhguy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="https://twitter.com/marhguy_tyrone" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com/tmarhguy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://tmarhguy.substack.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Substack">
                  <Newspaper size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Project Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Project</h4>
            <ul className="space-y-2" aria-label="Project navigation">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2" aria-label="External resources">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Computer Engineering project demonstrating transistor-level understanding and system design principles.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.seas.upenn.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Penn Engineering
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://github.com/tmarhguy/8bit-discrete-transistor-alu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            3,488 transistors. Hand-routed. Built to answer a 3am question: <em>Could I rebuild a computer, solo, in a medieval timeline? </em>
            The answer? Yes. Computers would be invented long before cars and quarter zips!
            <br/><br/>
            © 2026 <a href="https://alu.tmarhguy.com" className="hover:text-foreground transition-colors">8-Bit Transistor ALU Project</a>. Built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
