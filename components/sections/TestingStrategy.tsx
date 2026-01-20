'use client';

import { useState } from 'react';
import FadeUp from '../ui/FadeUp';
import { motion } from 'framer-motion';
import LottieAnimation from '@/components/ui/LottieAnimation';
import checkmarkAnimation from '@/public/animations/checkmark.json';

export default function TestingStrategy() {
  const [selectedCategory, setSelectedCategory] = useState('arithmetic');

  const testCategories = {
    arithmetic: {
      name: 'Arithmetic Operations',
      tests: [
        {
          operation: 'ADD',
          testCases: [
            '0 + 0 = 0 (Z flag)',
            '255 + 1 = 0 (C flag, overflow)',
            '127 + 1 = 128 (N flag, sign change)',
            '42 + 23 = 65 (normal)',
          ],
          validation: 'Verify result and all flags (C, Z, N)',
        },
        {
          operation: 'SUB',
          testCases: [
            '5 - 5 = 0 (Z flag)',
            '0 - 1 = 255 (C flag, borrow)',
            '128 - 1 = 127 (N flag clear)',
            '100 - 42 = 58 (normal)',
          ],
          validation: 'Verify result and borrow/zero/negative flags',
        },
      ],
    },
    logic: {
      name: 'Logic Operations',
      tests: [
        {
          operation: 'AND',
          testCases: [
            '0xFF & 0x00 = 0x00',
            '0xFF & 0xFF = 0xFF',
            '0xAA & 0x55 = 0x00',
            '0xF0 & 0x0F = 0x00',
          ],
          validation: 'Verify bitwise AND, check Z flag',
        },
        {
          operation: 'XOR',
          testCases: [
            '0xFF ^ 0xFF = 0x00 (Z flag)',
            '0xAA ^ 0x55 = 0xFF',
            '0x0F ^ 0xF0 = 0xFF',
          ],
          validation: 'Verify bitwise XOR, useful for comparison',
        },
      ],
    },
    shift: {
      name: 'Shift & Rotate',
      tests: [
        {
          operation: 'SHL (Shift Left)',
          testCases: [
            '0x01 << 1 = 0x02',
            '0x80 << 1 = 0x00 (C flag)',
            '0x0F << 4 = 0xF0',
          ],
          validation: 'Verify shift, check carry from MSB',
        },
        {
          operation: 'ROL (Rotate Left)',
          testCases: [
            '0x81 ROL = 0x03 (with carry)',
            '0x80 ROL = 0x01 (C flag)',
          ],
          validation: 'Verify rotation includes carry bit',
        },
      ],
    },
  };

  const testingMethodology = [
    {
      phase: '1. Unit Testing',
      description: 'Test each operation individually with comprehensive test vectors',
      tools: ['Multimeter', 'Logic Probe', 'LED Indicators'],
      approach: 'Manual input via switches, visual verification via LEDs',
    },
    {
      phase: '2. Logisim Validation',
      description: 'Compare hardware results against Logisim simulation',
      tools: ['Logisim Evolution', 'Test Vectors'],
      approach: 'Run identical test sequences, compare outputs',
    },
    {
      phase: '3. Timing Analysis',
      description: 'Verify propagation delays and setup/hold times',
      tools: ['Oscilloscope', 'Logic Analyzer'],
      approach: 'Measure critical paths, validate against simulation',
    },
    {
      phase: '4. Integration Testing',
      description: 'Test operation sequences and flag interactions',
      tools: ['Arduino Test Harness', 'Serial Monitor'],
      approach: 'Automated test sequences, log results',
    },
  ];

  const debuggingStrategy = [
    'Start with simplest operations (PASS A, PASS B)',
    'Verify power distribution and ground connections',
    'Test individual gates before full operations',
    'Use oscilloscope to trace signal propagation',
    'Compare with Logisim simulation at each stage',
    'Isolate failures to specific boards/components',
  ];

  return (
    <section id="testing-strategy" className="relative py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              Validation & Verification
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Testing Strategy
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To ensure rigor, I tested on all possibilities there were for an 8-bit ALU on 19 opcodes (256 x 256 x 19)—yes, 1.245 million test cases.
            </p>
          </div>
        </FadeUp>

        {/* Testing Methodology */}
        <FadeUp delay={0.2}>
          <div className="glass glass-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Testing Methodology</h3>
            <div className="space-y-6">
              {testingMethodology.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-accent pl-6"
                >
                  <h4 className="text-lg font-bold text-foreground mb-2">{phase.phase}</h4>
                  <p className="text-muted-foreground mb-3">{phase.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {phase.tools.map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">{phase.approach}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Test Cases by Category */}
        <FadeUp delay={0.3}>
          <div className="glass glass-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Test Cases by Category</h3>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {Object.entries(testCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-accent text-background'
                      : 'bg-white/5 text-foreground hover:bg-white/10'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Test Cases */}
            <div className="space-y-6">
              {testCategories[selectedCategory as keyof typeof testCategories].tests.map((test, index) => (
                <motion.div
                  key={test.operation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-6"
                >
                  <h4 className="text-xl font-bold text-accent mb-4">{test.operation}</h4>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Test Cases:</p>
                    <ul className="space-y-1">
                      {test.testCases.map((testCase) => (
                        <li key={testCase} className="text-sm text-muted-foreground font-mono pl-4">
                          • {testCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-accent/10 rounded flex items-center gap-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      <LottieAnimation animationData={checkmarkAnimation} loop={false} />
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-accent">Validation:</span> {test.validation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Debugging Strategy */}
        <FadeUp delay={0.4}>
          <div className="glass glass-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Debugging Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {debuggingStrategy.map((strategy, index) => (
                <motion.div
                  key={strategy}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                >
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-background text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
