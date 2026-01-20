'use client';

import FadeUp from '../ui/FadeUp';
import { motion } from 'framer-motion';

export default function TechnicalSpecs() {
  const electricalSpecs = [
    { parameter: 'Supply Voltage', value: '5V DC', tolerance: '±5%' },
    { parameter: 'Logic High (VIH)', value: '3.5V', tolerance: 'min' },
    { parameter: 'Logic Low (VIL)', value: '1.5V', tolerance: 'max' },
    { parameter: 'Propagation Delay', value: '~80ns', tolerance: 'typ' },
    { parameter: 'Power Consumption', value: '~2.5W', tolerance: 'max @ 5V' },
    { parameter: 'Operating Temperature', value: '0°C to 70°C', tolerance: '' },
  ];

  const physicalSpecs = [
    { parameter: 'Total Boards', value: '8' },
    { parameter: 'Main ALU Board Size', value: '270mm × 270mm' },
    { parameter: 'Board Area', value: '~729 cm²' },
    { parameter: 'Discrete SOT-23 MOSFETs', value: '624' },
    { parameter: 'Total Transistor Count', value: '3,488' },
    { parameter: 'Total Weight', value: '~500g (estimated)' },
  ];

  const timingSpecs = [
    { operation: 'ADD/SUB', delay: '~80ns', description: 'Full 8-bit ripple carry' },
    { operation: 'AND/OR/XOR', delay: '~10ns', description: 'Single gate delay' },
    { operation: 'NOT', delay: '~5ns', description: 'Inverter propagation' },
    { operation: 'Shift/Rotate', delay: '~15ns', description: 'Multiplexer delay' },
    { operation: 'Flag Update', delay: '~20ns', description: 'Carry, Zero, Negative' },
  ];

  const ioSpecs = [
    { signal: 'Data Input A', pins: '8', type: 'Input', voltage: '5V TTL' },
    { signal: 'Data Input B', pins: '8', type: 'Input', voltage: '5V TTL' },
    { signal: 'Data Output', pins: '8', type: 'Output', voltage: '5V TTL' },
    { signal: 'Operation Select', pins: '5', type: 'Input', voltage: '5V TTL' },
    { signal: 'Flags (C, Z, N)', pins: '3', type: 'Output', voltage: '5V TTL' },
    { signal: 'Power/Ground', pins: '4', type: 'Power', voltage: '5V/GND' },
  ];

  return (
    <section id="technical-specs" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              Detailed Specifications
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Technical Specifications
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Complete electrical, physical, and timing characteristics
            </p>
          </div>
        </FadeUp>

        {/* Electrical Specifications */}
        <FadeUp delay={0.2}>
          <div className="glass glass-border rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Electrical Characteristics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Parameter</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Value</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {electricalSpecs.map((spec, index) => (
                    <motion.tr
                      key={spec.parameter}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 px-4 text-muted-foreground">{spec.parameter}</td>
                      <td className="py-3 px-4 text-center font-mono text-accent">{spec.value}</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">{spec.tolerance}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        {/* Timing Specifications */}
        <FadeUp delay={0.3}>
          <div className="glass glass-border rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Timing Characteristics</h3>
            <div className="space-y-4">
              {timingSpecs.map((spec, index) => (
                <motion.div
                  key={spec.operation}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{spec.operation}</div>
                    <div className="text-sm text-muted-foreground">{spec.description}</div>
                  </div>
                  <div className="text-2xl font-bold text-accent font-mono">{spec.delay}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-accent">Note:</span> Timing values are estimates from NGSpice simulation.
                Actual hardware performance may vary based on component tolerances and PCB layout.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Physical Specifications */}
        <FadeUp delay={0.4}>
          <div className="glass glass-border rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Physical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {physicalSpecs.map((spec, index) => (
                <motion.div
                  key={spec.parameter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <span className="text-muted-foreground">{spec.parameter}</span>
                  <span className="font-bold text-accent font-mono">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* I/O Specifications */}
        <FadeUp delay={0.5}>
          <div className="glass glass-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">I/O Pin Configuration</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Signal</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Pins</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Type</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Voltage</th>
                  </tr>
                </thead>
                <tbody>
                  {ioSpecs.map((spec, index) => (
                    <motion.tr
                      key={spec.signal}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 px-4 text-muted-foreground">{spec.signal}</td>
                      <td className="py-3 px-4 text-center font-mono text-accent">{spec.pins}</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">{spec.type}</td>
                      <td className="py-3 px-4 text-center font-mono text-sm text-foreground">{spec.voltage}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-accent">Total Pins:</span> 36 (28 signal + 8 power/ground)
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
