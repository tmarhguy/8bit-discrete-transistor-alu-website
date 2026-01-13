export interface Operation {
  opcode: number;
  name: string;
  type: 'Arithmetic' | 'Logic' | 'Special';
  description: string;
}

export const operations: Operation[] = [
  { opcode: 0, name: 'ADD', type: 'Arithmetic', description: 'A + B' },
  { opcode: 1, name: 'SUB', type: 'Arithmetic', description: 'A - B (2\'s complement)' },
  { opcode: 2, name: 'INC A', type: 'Arithmetic', description: 'A + 1' },
  { opcode: 3, name: 'DEC A', type: 'Arithmetic', description: 'A - 1' },
  { opcode: 4, name: 'LSL', type: 'Arithmetic', description: 'Shift A left' },
  { opcode: 5, name: 'LSR', type: 'Arithmetic', description: 'Shift A right (logical)' },
  { opcode: 6, name: 'ASR', type: 'Arithmetic', description: 'Shift A right (arithmetic)' },
  { opcode: 7, name: 'REV A', type: 'Arithmetic', description: 'Reverse A bits' },
  { opcode: 8, name: 'NAND', type: 'Logic', description: 'A NAND B' },
  { opcode: 9, name: 'NOR', type: 'Logic', description: 'A NOR B' },
  { opcode: 10, name: 'XOR', type: 'Logic', description: 'A XOR B' },
  { opcode: 11, name: 'PASS A', type: 'Logic', description: 'Output A' },
  { opcode: 12, name: 'PASS B', type: 'Logic', description: 'Output B' },
  { opcode: 13, name: 'AND', type: 'Logic', description: 'A AND B' },
  { opcode: 14, name: 'OR', type: 'Logic', description: 'A OR B' },
  { opcode: 15, name: 'XNOR', type: 'Logic', description: 'A XNOR B' },
  { opcode: 16, name: 'CMP', type: 'Special', description: 'Compare A and B' },
  { opcode: 17, name: 'NOT A', type: 'Logic', description: 'Invert A' },
  { opcode: 18, name: 'NOT B', type: 'Logic', description: 'Invert B' },
];

export const operationTypes = ['All', 'Arithmetic', 'Logic', 'Special'] as const;
export type OperationType = typeof operationTypes[number];
