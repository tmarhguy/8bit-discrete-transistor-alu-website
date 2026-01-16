export default function Footer() {
  const projectLinks = [
    { label: 'Architecture', href: '#architecture' },
    { label: 'Specifications', href: '#specifications' },
    { label: 'Hardware', href: '#hardware' },
    { label: 'Documentation', href: '#documentation' },
  ];

  const resourceLinks = [
    { label: 'GitHub Repository', href: 'https://github.com/tmarhguy/cpu' },
    { label: 'KiCad Files', href: 'https://github.com/tmarhguy/cpu/tree/main/schematics' },
    { label: 'Verilog Code', href: 'https://github.com/tmarhguy/cpu/tree/main/hardware' },
    { label: 'Test Vectors', href: 'https://github.com/tmarhguy/cpu/tree/main/test' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Project Info */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">8-Bit Transistor ALU</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A complete Arithmetic Logic Unit designed and built from 3,800+ discrete transistors.
              Computer Engineering project from Penn Engineering.
            </p>
          </div>

          {/* Project Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Project</h4>
            <ul className="space-y-2">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
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
            <ul className="space-y-2">
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
              href="https://github.com/tmarhguy/cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2026 8-Bit Transistor ALU Project. Built with passion for hardware.
          </p>
        </div>
      </div>
    </footer>
  );
}
