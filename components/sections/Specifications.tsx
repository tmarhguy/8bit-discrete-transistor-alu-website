'use client';

import { useState } from 'react';
import FadeUp from '../ui/FadeUp';
import { operations, operationTypes, type OperationType } from '@/lib/data/operations';

export default function Specifications() {
  const [activeFilter, setActiveFilter] = useState<OperationType>('All');

  const filteredOperations = activeFilter === 'All'
    ? operations
    : operations.filter(op => op.type === activeFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Arithmetic': return 'text-blue-400';
      case 'Logic': return 'text-green-400';
      case 'Special': return 'text-purple-400';
      default: return 'text-foreground';
    }
  };

  return (
    <section id="specifications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-accent mb-2">19 Operations</p>
            <p className="text-base text-muted-foreground">Fully Implemented</p>
          </div>
        </FadeUp>

        {/* Filter Tabs */}
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
            {operationTypes.map((type) => (
              <button
                key={type}
                role="tab"
                aria-selected={activeFilter === type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === type
                    ? 'bg-accent text-background'
                    : 'glass glass-border hover:bg-white/10 text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Operations Table */}
        <FadeUp delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full glass glass-border rounded-lg overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Opcode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Operation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperations.map((op, index) => (
                  <tr
                    key={op.opcode}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">{op.opcode}</td>
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-foreground">{op.name}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${getTypeColor(op.type)}`}>{op.type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{op.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FadeUp delay={0.3}>
            <div className="glass glass-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Word Size</h3>
              <p className="text-3xl font-bold text-accent mb-2">8-bit</p>
              <p className="text-sm text-muted-foreground">Operates on 8-bit operands</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="glass glass-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Control Signals</h3>
              <p className="text-3xl font-bold text-accent mb-2">5-bit</p>
              <p className="text-sm text-muted-foreground">FUNC[4:0] opcode selector</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.5}>
            <div className="glass glass-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Output Flags</h3>
              <p className="text-3xl font-bold text-accent mb-2">C, E, L, G</p>
              <p className="text-sm text-muted-foreground">Carry, Equal, Less, Greater than</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
