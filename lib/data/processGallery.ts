export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  type: 'image' | 'video';
  category: 'silicon' | 'logic' | 'hardware' | 'verification';
  description?: string;
  poster?: string; // Cover image for videos
}

// 1. Silicon Level (VLSI, Transistors)
export const siliconGallery: GalleryItem[] = [
  {
    id: 'vlsi-inverter',
    title: 'Inverter (MOSFET)',
    image: '/media/design/vlsi/design_vlsi_inverter_mosfet.jpg',
    type: 'image',
    category: 'silicon',
    description: 'Custom inverter design in Electric VLSI',
  },
  {
    id: 'vlsi-nand',
    title: 'NAND Gate (MOSFET)',
    image: '/media/design/vlsi/design_vlsi_nand_mosfet.jpg',
    type: 'image',
    category: 'silicon',
    description: 'NAND gate from transistor level',
  },
  {
    id: 'vlsi-xor',
    title: 'XOR Gate (MOSFET)',
    image: '/media/design/vlsi/design_vlsi_xor_mosfet.jpg',
    type: 'image',
    category: 'silicon',
    description: 'XOR gate MOSFET implementation',
  },
  {
    id: 'electric-half-adder',
    title: 'Half Adder (Electric)',
    image: '/media/design/vlsi/design_electric_half_adder.png',
    type: 'image',
    category: 'silicon',
    description: '1-bit Half Adder in Electric VLSI with DRC check',
  },
  {
    id: 'electric-xor',
    title: 'XOR Gate (Electric)',
    image: '/media/design/vlsi/design_electric_xor.png',
    type: 'image',
    category: 'silicon',
    description: 'XOR gate layout verification',
  },
  {
    id: 'electric-nand',
    title: 'NAND Gate (Electric)',
    image: '/media/design/vlsi/design_electric_nand.png',
    type: 'image',
    category: 'silicon',
    description: 'NAND gate implementation in Electric',
  },
  {
    id: 'electric-and',
    title: 'AND Gate (Electric)',
    image: '/media/design/vlsi/design_electric_and.png',
    type: 'image',
    category: 'silicon',
    description: 'AND gate layout verification',
  },
  {
    id: 'electric-or',
    title: 'OR Gate (Electric)',
    image: '/media/design/vlsi/design_electric_or.png',
    type: 'image',
    category: 'silicon',
    description: 'OR gate layout verification',
  },
  {
    id: 'electric-xnor',
    title: 'XNOR Gate (Electric)',
    image: '/media/design/vlsi/design_electric_xnor.png',
    type: 'image',
    category: 'silicon',
    description: 'XNOR gate layout verification',
  },
];

// 2. Logic Design (Schematics, Blocks)
export const logicGallery: GalleryItem[] = [
  {
    id: 'nand-flow-video',
    title: 'NAND Gate Design Flow',
    image: '/media/design/kicad/nand_gate_full_flow.mp4',
    type: 'video',
    category: 'logic',
    description: 'Complete design flow from schematic to layout',
    poster: '/media/design/kicad/nand_gate_poster.png',
  },
  {
    id: 'kicad-alu-schematic',
    title: 'ALU Main Schematic',
    image: '/media/design/kicad/design_kicad_alu_schematic.jpg',
    type: 'image',
    category: 'logic',
    description: 'Complete ALU schematic in KiCad',
  },
  {
    id: 'kicad-control',
    title: 'Control Unit Schematic',
    image: '/media/design/kicad/design_kicad_control_schematic.jpg',
    type: 'image',
    category: 'logic',
    description: 'Control unit circuit design',
  },
  // Muxes
  {
    id: 'mux-2to1-schematic',
    title: '2:1 Multiplexer',
    image: '/media/design/blocks/schematic_mux_2to1.jpg',
    type: 'image',
    category: 'logic',
    description: 'Basic 2:1 multiplexer building block',
  },
  {
    id: 'mux-8to1-schematic',
    title: '8:1 Multiplexer',
    image: '/media/design/blocks/schematic_mux_8to1.jpg',
    type: 'image',
    category: 'logic',
    description: '8-input multiplexer logic diagram',
  },
  // Adders
  {
    id: 'adder-2bit-schematic',
    title: '2-bit Adder',
    image: '/media/design/blocks/schematic_adder_2bit.jpg',
    type: 'image',
    category: 'logic',
    description: 'Scalable adder unit design',
  },
  {
    id: 'adder-8bit-schematic',
    title: '8-bit Adder',
    image: '/media/design/blocks/schematic_adder_8bit.jpg',
    type: 'image',
    category: 'logic',
    description: 'Complete 8-bit ripple carry adder',
  },
  // Gates
  {
    id: 'logic-inv-8bit',
    title: '8-bit Inverter',
    image: '/media/design/blocks/schematic_inv_8bit.jpg',
    type: 'image',
    category: 'logic',
    description: '8-bit bus inverter / NOT gate',
  },
  {
    id: 'logic-and-8bit',
    title: '8-bit AND Array',
    image: '/media/design/blocks/schematic_and_8bit.jpg',
    type: 'image',
    category: 'logic',
    description: 'Parallel 8-bit AND gate logic',
  },
  {
    id: 'logic-xor-8bit',
    title: '8-bit XOR Array',
    image: '/media/design/blocks/schematic_xor_8bit.jpg',
    type: 'image',
    category: 'logic',
    description: 'Parallel 8-bit XOR',
  },
  {
    id: 'logic-and-3in',
    title: '3-Input AND',
    image: '/media/design/blocks/schematic_and_3in.jpg',
    type: 'image',
    category: 'logic',
    description: '3-input AND gate schematic',
  },
  {
    id: 'logic-and-4in',
    title: '4-Input AND',
    image: '/media/design/blocks/schematic_and_4in.jpg',
    type: 'image',
    category: 'logic',
    description: '4-input AND gate schematic',
  },
  {
    id: 'logic-or-3in',
    title: '3-Input OR',
    image: '/media/design/blocks/schematic_or_3in.jpg',
    type: 'image',
    category: 'logic',
    description: '3-input OR gate schematic',
  },
  {
    id: 'logic-nor-8in',
    title: '8-Input NOR',
    image: '/media/design/blocks/schematic_nor_8in.jpg',
    type: 'image',
    category: 'logic',
    description: 'Wide 8-input NOR for zero detection',
  },
];

// 3. Hardware Implementation (PCBs, Fab)
export const hardwareGallery: GalleryItem[] = [
  {
    id: 'kicad-alu-pcb',
    title: 'ALU Main PCB',
    image: '/media/design/kicad/design_kicad_alu_pcb_layout.png',
    type: 'image',
    category: 'hardware',
    description: 'Main PCB layout with optimized routing',
  },
  {
    id: 'pcb-led-1',
    title: 'LED Panel 1',
    image: '/media/design/kicad/pcb_led_panel_1.png',
    type: 'image',
    category: 'hardware',
    description: 'Display output panel 1',
  },
  {
    id: 'pcb-led-2',
    title: 'LED Panel 2',
    image: '/media/design/kicad/pcb_led_panel_2.png',
    type: 'image',
    category: 'hardware',
    description: 'Display output panel 2',
  },
  {
    id: 'pcb-led-3',
    title: 'LED Panel 3',
    image: '/media/design/kicad/pcb_led_panel_3.png',
    type: 'image',
    category: 'hardware',
    description: 'Display output panel 3',
  },
  {
    id: 'pcb-led-4',
    title: 'LED Panel 4',
    image: '/media/design/kicad/pcb_led_panel_4.png',
    type: 'image',
    category: 'hardware',
    description: 'Display output panel 4',
  },
  // Block PCBs
  {
    id: 'mux-2to1-pcb',
    title: '2:1 Mux PCB',
    image: '/media/design/blocks/pcb_mux_2to1.png',
    type: 'image',
    category: 'hardware',
    description: 'Physical Mux Module',
  },
  {
    id: 'mux-8to1-pcb',
    title: '8:1 Mux PCB',
    image: '/media/design/blocks/pcb_mux_8to1.png',
    type: 'image',
    category: 'hardware',
    description: 'Physical 8-Channel Mux',
  },
  {
    id: 'adder-2bit-pcb',
    title: '2-bit Adder PCB',
    image: '/media/design/blocks/pcb_adder_2bit.png',
    type: 'image',
    category: 'hardware',
    description: 'Modular Adder Board',
  },
  {
    id: 'adder-8bit-pcb',
    title: '8-bit Adder PCB',
    image: '/media/design/blocks/pcb_adder_8bit.png',
    type: 'image',
    category: 'hardware',
    description: 'Full Adder Board Layout',
  },
  // Fabrication Photos
  {
    id: 'soldering-inverter-1',
    title: 'First Inverter',
    image: '/media/fabrication/soldering/fab_soldering_first_inverter_01.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Hand-soldering first custom inverter',
  },
  {
    id: 'soldering-inverter-2',
    title: 'Inverter Complete',
    image: '/media/fabrication/soldering/fab_soldering_first_inverter_02.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Completed inverter milestone',
  },
  {
    id: 'soldering-progress',
    title: 'ALU Assembly',
    image: '/media/fabrication/soldering/fab_soldering_alu_progress.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Board assembly in progress',
  },
  {
    id: 'assembly-components',
    title: 'Component Prep',
    image: '/media/fabrication/assembly/fab_assembly_step_01_components.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Organizing components for assembly',
  },
  {
    id: 'assembly-soldering',
    title: 'Soldering',
    image: '/media/fabrication/assembly/fab_assembly_step_03_soldering.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Precision soldering work',
  },
  {
    id: 'assembly-complete',
    title: 'System Assembly',
    image: '/media/fabrication/assembly/fab_assembly_step_05_complete.jpg',
    type: 'image',
    category: 'hardware',
    description: 'Fully assembled system',
  },
];

// 4. Verification (Simulation + Testing)
export const verificationGallery: GalleryItem[] = [
  // Logisim
  {
    id: 'logisim-evolution-full',
    title: 'Full ALU (Logisim)',
    image: '/media/simulations/logisim/sim_logisim_evolution_full.png',
    type: 'image',
    category: 'verification',
    description: 'Complete 8-bit ALU schematic diagram',
  },
  {
    id: 'logisim-layout',
    title: 'ALU Layout (Logisim)',
    image: '/media/simulations/logisim/sim_logisim_alu_layout.png',
    type: 'image',
    category: 'verification',
    description: 'System layout in Logisim',
  },
  {
    id: 'logisim-screenshot',
    title: 'Simulation Run',
    image: '/media/simulations/logisim/sim_logisim_screenshot.png',
    type: 'image',
    category: 'verification',
    description: 'Real-time simulation',
  },
  // NGSpice
  {
    id: 'ngspice-inverter',
    title: 'Inverter Waveform',
    image: '/media/simulations/ngspice/sim_ngspice_inverter_waveform.png',
    type: 'image',
    category: 'verification',
    description: 'NGSpice output verification',
  },
  {
    id: 'ngspice-fulladder',
    title: 'Adder Timing',
    image: '/media/simulations/ngspice/sim_ngspice_fulladder_waveform.png',
    type: 'image',
    category: 'verification',
    description: 'Critical path timing analysis',
  },
  // Physical Testing
  {
    id: 'testing-oscilloscope',
    title: 'Oscilloscope Test',
    image: '/media/fabrication/testing/fab_testing_oscilloscope.jpg',
    type: 'image',
    category: 'verification',
    description: 'Signal integrity verification',
  },
  {
    id: 'testing-multimeter',
    title: 'Voltage Check',
    image: '/media/fabrication/testing/fab_testing_multimeter.jpg',
    type: 'image',
    category: 'verification',
    description: 'Continuity and voltage testing',
  },
  {
    id: 'demo-add',
    title: 'Live ADD Demo',
    image: '/media/demonstrations/screenshots/demo_screenshot_add_42_23.jpg',
    type: 'image',
    category: 'verification',
    description: 'Hardware addition verification',
  },
  {
    id: 'demo-flags',
    title: 'Flags Verified',
    image: '/media/demonstrations/screenshots/demo_screenshot_flags_active.jpg',
    type: 'image',
    category: 'verification',
    description: 'Hardware flags verification',
  },
];

export const allGalleryItems = [
  ...siliconGallery,
  ...logicGallery,
  ...hardwareGallery,
  ...verificationGallery,
];
