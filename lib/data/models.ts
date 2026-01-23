export interface ModelConfig {
  name: string;
  imagePath: string; // Path to the 2D transparent render
  description: string;
  details?: string;
}

export const models: ModelConfig[] = [
  {
    name: 'Main Logic Unit',
    imagePath: '/assets/boards/main_logic.png',
    description: 'Core arithmetic processing unit containing the ALU logic gates.',
    details: '3,488 Total Transistors',
  },
  {
    name: 'Adder / Subtractor',
    imagePath: '/assets/boards/pcb_add_sub.png',
    description: 'Dedicated hardware for binary addition and subtraction operations.',
  },
  {
    name: 'Control Logic',
    imagePath: '/assets/boards/pcb_control.png',
    description: 'Sequencer and control signal generation for instruction decoding.',
  },
  {
    name: 'Flags Circuit',
    imagePath: '/assets/boards/pcb_flags.png',
    description: 'Storage for ALU status flags (Zero, Carry, Overflow).',
  },
  {
    name: 'LED Panel 1',
    imagePath: '/assets/boards/pcb_led_panel_1.png',
    description: 'Visual LED readout for Accumulator A.',
  },
  {
    name: 'LED Panel 2',
    imagePath: '/assets/boards/pcb_led_panel_2.png',
    description: 'Visual LED readout for Operand Register B.',
  },
  {
    name: 'LED Panel 3',
    imagePath: '/assets/boards/pcb_led_panel_3.png',
    description: 'Final calculation result display panel.',
  },
  {
    name: 'LED Panel 4',
    imagePath: '/assets/boards/pcb_led_panel_4.png',
    description: 'Visual readout of the current Opcode being executed.',
  },
];
