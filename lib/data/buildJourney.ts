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
}

export const buildJourneyStages: BuildJourneyStage[] = [
  {
    id: 'simulation',
    title: 'Simulation',
    description: 'Circuit behavior verified using NGSpice and Logisim simulations',
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/simulations/logisim/sim_logisim_evolution_full.png',
    video: '/media/simulations/logisim/main-demo-logism-evolution-all-opcodes.mp4',
    detailImages: [
      '/media/simulations/logisim/logic_unit_sim_logism_evolution_fpga_export.mp4',
      '/media/simulations/logisim/sub-logism-demo-video.mp4',
      '/media/simulations/logisim/sim_logisim_counter_running.mp4',
      '/media/simulations/ngspice/sim_ngspice_nor_kicad.mp4',
      '/media/simulations/ngspice/adder-spice.png',
      '/media/simulations/ngspice/and-spice.png',
      '/media/simulations/ngspice/not-spice.png',
      '/media/simulations/ngspice/or-spice.png',
      '/media/simulations/ngspice/xnor-spice.png',
      '/media/simulations/ngspice/input-spice-a-transient-anal.png',
      '/media/simulations/ngspice/input-spice-b-transient-anal.png',
      '/media/simulations/logisim/sim_logisim_alu_layout.png',
    ],
    content: 'Ran comprehensive simulations to verify timing and logic. A mistake here would be expensive for a medieval timeline, so I verified SPICE directives for each design in ngspice.',
    tools: ['NGSpice', 'Logisim Evolution', 'KiCad Integration'],
    duration: '1 week',
    status: 'completed',
  },
  {
    id: 'mosfet-design',
    title: 'MOSFET Design',
    description: 'Custom logic gates designed from transistor level using Electric VLSI',
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/process/timeline/process_timeline_01_mosfet_design.jpg',
    video: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/design/kicad/schematics_design_video_full.mp4',
    detailImages: [

      '/media/design/vlsi/design_electric_half_adder_video.mp4',
      '/media/design/blocks/schematic_and_3in.jpg',
      '/media/design/vlsi/design_vlsi_nand_mosfet.jpg',
      '/media/design/vlsi/design_vlsi_nor_mosfet.jpg',
      '/media/design/vlsi/design_vlsi_xor_mosfet.jpg',
      '/media/design/vlsi/design_electric_xor.png',
      '/media/design/vlsi/design_electric_xnor.png',
      '/media/design/vlsi/design_electric_half_adder.png',
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
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/process/timeline/process_timeline_02_schematic.webp',
    video: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/design/kicad/schematics_design_video_full.mp4',
    detailImages: [

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
    id: 'verification',
    title: 'Universal Verification',
    description: 'Exhaustive verification of 1.2M+ test vectors',
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/verification/test_passed.png',
    video: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/verification/testing_demo.mp4',
    content: 'Before committing to hardware, developed a custom "Golden Model" in Python to exhaustively verify the ALU logic. \n\n**The Challenge:** Prove correctness for 100% of inputs.\n\n**The Solution:**\n- Generated **1,245,184 unique test vectors** (256 Inputs A × 256 Inputs B × 19 Opcodes).\n- Wrote a zero-dependency Python test runner (`run_tests.py`) to simulate 100% of the ISA.\n- Validated every single arithmetic, logic, and shift operation, including all edge cases (Overflow, Carry, Borrow).\n\nThe result: **0 Failures.** The logic is mathematically perfect.',
    tools: ['Python', 'Bash', 'Automated Testing', 'Golden Model'],
    duration: '1 week',
    status: 'completed',
  },
  {
    id: 'pcb-design',
    title: 'PCB Design',
    description: 'Professional PCB layouts with optimized routing - Ready for fabrication',
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/process/timeline/process_timeline_04_pcb_design.png',
    video: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/design/kicad/routing-demo.mp4',
    detailImages: [
      '/media/design/kicad/nand_gate_full_flow.mp4',
      'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/design/kicad/main_logic.png',
      '/media/design/kicad/design_kicad_alu_schematic.webp',
      '/media/design/kicad/unrouted_full_alu_monolithic.png',
    ],
    content: 'Designed modular PCB layouts for all 8 boards. Also experimenting with a **Monolithic Full ALU** design (270mm x 270mm). Current progress on the monolithic board: **821 nets, 2942 pads, and 2117 unrouted connections**. This represents the ambitious future scale of the project.',
    tools: ['KiCad PCB Editor', '3D Viewer', 'DRC Checks'],
    duration: '2 weeks',
    status: 'completed',
  },
  {
    id: 'inverter-learning',
    title: 'Custom Inverter Test',
    description: 'Learning PCB fabrication workflow with SOT-23-3 inverter project',
    image: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/fabrication/inverter/not_closeup_soldered_mosfets.webp',
    video: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/fabrication/inverter/main_demo_inverter.mp4',
    detailImages: [
      '/media/fabrication/inverter/not_schematics.png',
      '/media/fabrication/inverter/not_pcb_view.png',
      '/media/fabrication/inverter/not_demo_off_to_on.webp',
    ],
    content: 'Before committing to the full ALU fabrication, designed and built a simple custom inverter using SOT-23-3 transistors to learn the complete workflow: \n\n1. **Design**: Created schematic and verified with SPICE simulation.\n2. **PCB**: Routed custom breakout board and visualized in 3D.\n3. **Ordering**: Sourced PCBs from JLCPCB and components from DigiKey.\n4. **Assembly**: Soldered SOT-23-3 transistors.\n5. **Verification**: Validated logic operation (Off/On states).\n\nThis "Fail Fast" approach authenticated the entire pipeline before scaling to 3,488 components.',
    tools: ['KiCad', 'NGSpice', 'JLCPCB', 'DigiKey', 'Soldering Iron'],
    duration: '1 week',
    status: 'completed',
  },
  {
    id: 'fabrication',
    title: 'PCB Fabrication',
    description: 'Manufacturing PCBs and sourcing components',
    image: '/grid.svg',
    content: 'Ordering PCBs from JLCPCB (8 boards total) and sourcing all 3,488 components including discrete transistors, ICs, resistors, and capacitors from DigiKey.',
    tools: ['JLCPCB', 'DigiKey', 'Component Selection'],
    duration: '2-3 weeks (estimated)',
    status: 'upcoming',
  },
  {
    id: 'assembly',
    title: 'Assembly',
    description: 'Assembling 3,488 components',
    image: '/grid.svg',
    content: 'Meticulously assembling and soldering all 3,488 components. It took days to weeks of lock-in, but I loved it. 15 hours felt too "easy" for days, almost like a hardware hackathon no one forced me into.',
    tools: ['Soldering Iron', 'Multimeter', 'Magnification', 'Flux'],
    duration: '6-8 weeks (estimated)',
    status: 'upcoming',
  },
];
