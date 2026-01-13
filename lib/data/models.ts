export interface ModelConfig {
  name: string;
  path: string;
  position: [number, number, number];
  description: string;
  details: string;
  quantity: number;
}

export const models: ModelConfig[] = [
  {
    name: 'Main Control',
    path: '/models/main_control.glb',
    position: [0, 2, 0],
    description: 'Primary control board for system management',
    details: 'Arduino + 74HC logic',
    quantity: 1
  },
  {
    name: 'Main Logic',
    path: '/models/main_logic.glb',
    position: [0, 0, 0],
    description: 'Core logic processing unit with 3,800+ transistors',
    details: '3,800+ discrete transistors',
    quantity: 1
  },
  {
    name: 'Add/Sub',
    path: '/models/add_sub.glb',
    position: [3, 0, 0],
    description: 'Arithmetic operations module with 2\'s complement',
    details: '74HC283 + XOR array',
    quantity: 1
  },
  {
    name: 'Flags',
    path: '/models/flags.glb',
    position: [-3, 0, 0],
    description: 'Status flag indicators (Carry, Zero, Negative)',
    details: 'LED drivers + logic',
    quantity: 1
  },
  {
    name: 'LED Panel 1',
    path: '/models/led_panel_1.glb',
    position: [0, 0, 3],
    description: 'Primary LED display panel',
    details: '74HC595 shift registers',
    quantity: 1
  },
  {
    name: 'LED Panel 2',
    path: '/models/led_panel_2.glb',
    position: [0, 0, -3],
    description: 'Secondary LED display panel',
    details: '74HC595 shift registers',
    quantity: 1
  },
  {
    name: 'LED Panel 3',
    path: '/models/led_panel_3.glb',
    position: [3, 0, 3],
    description: 'Tertiary LED display panel',
    details: '74HC595 shift registers',
    quantity: 1
  },
  {
    name: 'LED Panel 4',
    path: '/models/led_panel_4.glb',
    position: [-3, 0, -3],
    description: 'Quaternary LED display panel',
    details: '74HC595 shift registers',
    quantity: 1
  },
];
