'use client';

import FadeUp from '../ui/FadeUp';

export default function Hardware() {
  const boards = [
    {
      name: 'Main Control',
      quantity: '×1',
      description: 'Central control unit with Arduino integration for operation selection',
      tech: 'Arduino + 74HC logic'
    },
    {
      name: 'Main Logic',
      quantity: '×1',
      description: 'Core ALU implementation with 8-bit adder and logic circuits',
      tech: '3,800+ discrete transistors'
    },
    {
      name: 'Add/Sub Module',
      quantity: '×1',
      description: 'Dedicated arithmetic unit with 2\'s complement support',
      tech: '74HC283 + XOR array'
    },
    {
      name: 'LED Panels',
      quantity: '×4',
      description: 'Four 8-segment display panels for visual output',
      tech: '74HC595 shift registers'
    },
    {
      name: 'Flags Module',
      quantity: '×1',
      description: 'Status flag indicators (Carry, Zero, Negative)',
      tech: 'LED drivers + logic'
    },
  ];

  const techStack = [
    {
      category: 'Design & Simulation',
      items: ['Logisim Evolution', 'LTSpice', 'KiCad 7.0']
    },
    {
      category: 'Hardware',
      items: ['74HC Series Logic', 'Discrete MOSFETs', 'Arduino Uno']
    },
    {
      category: 'Verification',
      items: ['Verilog Testbenches', 'FPGA Implementation', 'Hardware Testing']
    },
  ];

  const features = [
    {
      title: 'Modular Design',
      description: 'Each functional unit on separate PCB for easy debugging and testing'
    },
    {
      title: '5V Logic Family',
      description: 'Standard 74HC series for TTL compatibility and reliability'
    },
    {
      title: 'Arduino Control',
      description: 'Dual Arduino setup for input control and output display'
    },
    {
      title: 'Comprehensive Testing',
      description: 'Verified through simulation, FPGA implementation, and hardware'
    },
  ];

  return (
    <section id="hardware" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Hardware Implementation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From Silicon to Working System
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-4">
              Complete PCB design with modular architecture. Each board designed in KiCad,
              simulated in LTSpice, and verified in hardware.
            </p>
          </div>
        </FadeUp>

        {/* Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {boards.map((board, index) => (
            <FadeUp key={board.name} delay={index * 0.1}>
              <div className="glass glass-border rounded-lg p-6 hover:bg-white/5 transition-all hover:scale-105">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-foreground">{board.name}</h3>
                  <span className="text-accent font-semibold">{board.quantity}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{board.description}</p>
                <p className="text-xs text-accent font-mono">{board.tech}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Technology Stack */}
        <FadeUp delay={0.5}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {techStack.map((category, index) => (
                <div key={category.category} className="glass glass-border rounded-lg p-6">
                  <h4 className="text-lg font-bold text-accent mb-4">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FadeUp key={feature.title} delay={0.7 + index * 0.1}>
              <div className="text-center">
                <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
