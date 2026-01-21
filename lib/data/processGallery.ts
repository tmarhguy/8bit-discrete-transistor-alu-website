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
    poster: '/media/design/kicad/design_kicad_alu_schematic.webp',
  },
  {
    id: 'kicad-alu-schematic',
    title: 'ALU Main Schematic',
    image: '/media/design/kicad/design_kicad_alu_schematic.webp',
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
    id: 'pcb-main-logic',
    title: 'Main Logic Board',
    image: '/media/design/kicad/main_logic.png',
    type: 'image',
    category: 'hardware',
    description: 'Central logic integration board',
  },
  {
    id: 'pcb-add-sub',
    title: 'Arithmetic Unit',
    image: '/media/design/kicad/pcb_add_sub.png',
    type: 'image',
    category: 'hardware',
    description: 'Adder and subtractor circuit board',
  },
  {
    id: 'pcb-control',
    title: 'Control Unit',
    image: '/media/design/kicad/pcb_control.png',
    type: 'image',
    category: 'hardware',
    description: 'Instruction decoding and control logic',
  },
  {
    id: 'pcb-flags',
    title: 'Flags Register',
    image: '/media/design/kicad/pcb_flags.png',
    type: 'image',
    category: 'hardware',
    description: 'Status flags (Zero, Carry, Overflow)',
  },
  {
    id: 'pcb-led',
    title: 'Output Display',
    image: '/media/design/kicad/pcb_led_panel_1.png',
    type: 'image',
    category: 'hardware',
    description: 'Binary LED output panel',
  },
  // Fabrication Photos - only keeping existing images
  {
    id: 'assembly-soldering',
    title: 'Soldering',
    image: '/media/fabrication/assembly/fab_assembly_step_03_soldering.webp',
    type: 'image',
    category: 'hardware',
    description: 'Precision soldering work',
  },
];

// 4. Verification (Simulation + Testing)
export const verificationGallery: GalleryItem[] = [
  // Logisim
  {
    id: 'logisim-evolution-full',
    title: 'Full ALU (Logisim)',
    image: '/media/simulations/logisim/main-demo-logism-evolution-all-opcodes.mp4',
    type: 'video',
    category: 'verification',
    description: 'Complete 8-bit ALU simulation running all opcodes',
    poster: '/media/images/simulations/logisim/sim_logisim_evolution_full.png',
  },
  {
    id: 'logisim-layout',
    title: 'ALU Layout (Logisim)',
    image: '/media/images/simulations/logisim/sim_logisim_alu_layout.png',
    type: 'image',
    category: 'verification',
    description: 'System layout in Logisim',
  },
  {
    id: 'logic-unit-sim',
    title: 'Logic Unit Simulation',
    image: '/media/simulations/logisim/logic_unit_sim_logism_evolution_fpga_export.mp4',
    type: 'video',
    category: 'verification',
    description: 'Logic unit verification and FPGA export test',
    poster: '/media/images/simulations/logisim/sim_logisim_alu_layout.png',
  },
  // NGSpice
  {
    id: 'ngspice-nor-sim',
    title: 'NGSpice NOR Gate Sim',
    image: '/media/simulations/ngspice/sim_ngspice_nor_kicad.mp4',
    type: 'video',
    category: 'verification',
    description: 'Transient analysis of NOR gate switching',
    poster: '/media/simulations/ngspice/not-spice.png',
  },
  // Physical Testing - removed missing images
  // Physical Testing - removed missing images
];

export const allGalleryItems = [
  ...siliconGallery,
  ...logicGallery,
  ...hardwareGallery,
  ...verificationGallery,
];
