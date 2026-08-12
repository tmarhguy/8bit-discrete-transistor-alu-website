export interface BuildJourneyStage {
  id: string;
  title: string;
  description: string;
  image: string;
  detailImages?: string[];
  video?: string;
  content: string;
  tools: string[];
  duration?: string;
  status?: 'completed' | 'in-progress' | 'upcoming';
  galleryDisabled?: boolean;
  notice?: {
    title: string;
    body: string;
  };
}

export const buildJourneyStages: BuildJourneyStage[] = [
  {
    id: 'mosfet-design',
    title: 'MOSFET Design',
    description: 'Custom logic gates designed from transistor level using Electric VLSI',
    image: '/media/process/timeline/process_timeline_01_mosfet_design.webp',
    video: '/media/videos/design/schematics_design_video_full.mp4',
    detailImages: [
      '/media/design/vlsi/design_electric_half_adder_video.mp4',
      '/media/design/blocks/schematic_and_3in.jpg',
      '/media/design/vlsi/design_vlsi_nand_mosfet.webp',
      '/media/design/vlsi/design_vlsi_nor_mosfet.webp',
      '/media/design/vlsi/design_vlsi_xor_mosfet.webp',
      '/media/design/vlsi/design_electric_xor.webp',
      '/media/design/vlsi/design_electric_xnor.webp',
      '/media/design/vlsi/design_electric_half_adder.webp',
      '/media/design/vlsi/design_electric_nand.webp',
      '/media/design/kicad/add_sub.png',
    ],
    content: 'Designed fundamental logic gates (NAND, NOR, XOR, Inverter) from MOSFET level using Electric VLSI. I began designing schematics of inverter, nand, nor, xnor, and notting them, getting all 7 gates from scratch.',
    tools: ['Electric VLSI', 'KiCad', 'NGSpice'],
    duration: '2 weeks',
    status: 'completed',
  },
  {
    id: 'schematic-design',
    title: 'Schematic Design',
    description: 'Complete circuit schematics created in KiCad',
    image: '/media/process/timeline/process_timeline_02_schematic.webp',
    video: '/media/videos/design/schematics_design_video_full.mp4',
    detailImages: [
      '/media/design/blocks/schematic_adder_8bit.jpg', 
      '/media/design/blocks/schematic_and_8bit.jpg',
      '/media/design/kicad/main_logic_page-0001.webp',
      '/media/design/kicad/main_control_page-0001.webp',
      '/media/design/kicad/design_kicad_flags_schematic.jpg',
    ],
    content: 'Translated logic designs into complete circuit schematics using KiCad. Designed 8 separate boards including ALU core, control unit, flags, and LED panels. All schematics completed and verified.',
    tools: ['KiCad Schematic Editor', 'Circuit Analysis'],
    duration: '3 weeks',
    status: 'completed',
  },
  {
    id: 'simulation',
    title: 'Simulation',
    description: 'Circuit behavior verified using NGSpice and Logisim simulations',
    image: '/media/simulations/logisim/sim_logisim_evolution_full.webp',
    video: '/media/simulations/logisim/main-demo-logism-evolution-all-opcodes.mp4',
    detailImages: [
      '/media/simulations/logisim/logic_unit_sim_logism_evolution_fpga_export.mp4',
      '/media/simulations/logisim/sub-logism-demo-video.mp4',
      '/media/simulations/logisim/sim_logisim_counter_running.mp4',
      '/media/simulations/ngspice/sim_ngspice_nor_kicad.mp4',
      '/media/simulations/ngspice/adder-spice.webp',
      '/media/simulations/ngspice/and-spice.webp',
      '/media/simulations/ngspice/not-spice.webp',
      '/media/simulations/ngspice/or-spice.webp',
      '/media/simulations/ngspice/xnor-spice.webp',
      '/media/simulations/ngspice/input-spice-a-transient-anal.webp',
      '/media/simulations/ngspice/input-spice-b-transient-anal.webp',
      '/media/simulations/logisim/sim_logisim_alu_layout.webp',
    ],
    content: 'Ran comprehensive simulations to verify timing and logic. A mistake here would be expensive for a medieval timeline, so I verified SPICE directives for each design in ngspice.',
    tools: ['NGSpice', 'Logisim Evolution', 'KiCad Integration'],
    duration: '1 week',
    status: 'completed',
  },

  {
    id: 'verification',
    title: 'Universal Verification',
    description: 'Comprehensive verification of 1.2M+ test vectors',
    image: '/media/verification/test_passed.webp',
    video: '/media/videos/verification/testing_demo.mp4',
    detailImages: [
      '/media/verification/test_script_vector_screenshot.webp',
      '/media/verification/test_passed.webp',
    ],
    content: 'Before committing to hardware, developed a custom "Golden Model" in Python to comprehensively verify the ALU logic. \n\n**The Challenge:** Achieve high confidence across all input combinations.\n\n**The Solution:**\n- Generated **1,245,184 unique test vectors** (256 Inputs A × 256 Inputs B × 19 Opcodes).\n- Wrote a zero-dependency Python test runner (`run_tests.py`) to simulate the complete ISA.\n- Validated every arithmetic, logic, and shift operation, including all edge cases (Overflow, Carry, Borrow).\n\n**Result:** All 1.2M+ test vectors passed validation in simulation. See [run_tests.py](https://github.com/tmarhguy/8bit-discrete-transistor-alu/blob/main/run_tests.py) for the complete test suite and logged results.',
    tools: ['Python', 'Bash', 'Automated Testing', 'Golden Model'],
    duration: '1 week',
    status: 'completed',
  },
  {
    id: 'inverter-learning',
    title: 'Custom Inverter Fabrication',
    description: 'Learning PCB fabrication and assembly workflow with SOT-23-3 inverter project',
    image: '/media/fabrication/inverter/not_closeup_soldered_mosfets.webp',
    video: '/media/videos/fabrication/main_demo_inverter.mp4',
    detailImages: [
      '/media/fabrication/inverter/not_pcb_order_jlcpcb.webp',
      '/media/fabrication/inverter/not_mosfet_order_digikey.webp',
      '/media/fabrication/inverter/not_schematics.webp',
      '/media/fabrication/inverter/not_pcb_view.webp',
      '/media/fabrication/inverter/not_demo_off_to_on.webp',
      '/media/fabrication/inverter/not_demo_on_to_off.webp',
    ],
    content: 'Before committing to the full ALU fabrication, designed and built a simple custom inverter using SOT-23-3 transistors to learn the complete workflow: \n\n1. **Design**: Created schematic and verified with SPICE simulation.\n2. **PCB**: Routed custom breakout board and visualized in 3D.\n3. **Ordering**: Sourced PCBs from JLCPCB and components from DigiKey.\n4. **Assembly**: Soldered SOT-23-3 transistors.\n5. **Verification**: Validated logic operation (Off/On states).\n\nThis "Fail Fast" approach authenticated the entire pipeline before scaling to 3,488 components, and the accompanying photos now chronicle the fabrication orders and component sourcing that supported the inverter build.',
    tools: ['KiCad', 'NGSpice', 'JLCPCB', 'DigiKey', 'Soldering Iron'],
    duration: '1 week',
    status: 'completed',
  },
  
  {
    id: 'pcb-design',
    title: 'PCB Design',
    description: 'Professional PCB layouts with optimized routing - Ready for fabrication',
    image: '/media/process/timeline/process_timeline_04_pcb_design.webp',
    video: '/media/videos/design/routing-demo.mp4',
    detailImages: [
      '/media/design/blocks/pcb_adder_8bit.png',
      '/media/design/blocks/pcb_mux_8to1.png',
      '/media/design/kicad/nand_gate_full_flow.mp4',
      '/media/design/kicad/main_logic_page-0001.webp',
      '/media/design/kicad/design_kicad_alu_schematic.webp',
      '/media/design/kicad/unrouted_full_alu_monolithic.webp',
    ],
    content: 'Designed modular PCB layouts for all 8 boards. Also experimenting with a **Monolithic Full ALU** design (270mm x 270mm). Current progress on the monolithic board: **821 nets, 2942 pads, and 2117 unrouted connections**. This represents the ambitious future scale of the project.',
    tools: ['KiCad PCB Editor', '3D Viewer', 'DRC Checks'],
    duration: '2 weeks',
    status: 'completed',
  },
  {
    id: 'fabrication',
    title: 'PCB Fabrication',
    description: 'Manufacturing PCBs and sourcing components (ongoing)',
    image: '',
    content: 'Fabrication is currently ongoing; boards are being ordered and tracked, and updates (including photos) will appear here as each run is received and inspected.',
    tools: ['JLCPCB', 'DigiKey', 'Component Selection'],
    duration: 'Ongoing',
    status: 'in-progress',
    galleryDisabled: true,
    notice: {
      title: 'PCB Fabrication Ongoing',
      body: 'Boards are being ordered, inspected, and documented—photos will appear in this space as each run arrives.',
    },
  },
  {
    id: 'assembly',
    title: 'Assembly',
    description: 'Assembling 3,488 components',
    image: '',
    content: 'Meticulously assembling and soldering all 3,488 components. It took days to weeks of lock-in, but I loved it. 15 hours felt too "easy" for days, almost like a hardware hackathon no one forced me into.',
    tools: ['Soldering Iron', 'Multimeter', 'Magnification', 'Flux'],
    duration: '6-8 weeks (estimated)',
    status: 'upcoming',
    galleryDisabled: true,
    notice: {
      title: 'Assembly Progressing',
      body: 'Manual soldering of the full board set is underway; visual updates will appear once each milestone is completed.',
    },
  },
];
