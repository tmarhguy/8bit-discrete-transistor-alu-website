export interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  duration?: string;
  category: 'overview' | 'operation' | 'build' | 'simulation';
}

export const featuredVideos: VideoItem[] = [
  {
    id: 'system-walkthrough',
    title: 'Complete System Walkthrough',
    description: 'Full demonstration of the 8-bit ALU system showing all components and operations',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/demonstrations/full/demo_full_walkthrough.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/hero/hero_system_photo.png',
    duration: '2:30',
    category: 'overview',
  },
  {
    id: 'logisim-simulation',
    title: 'Logisim Simulation',
    description: 'Counter running the ALU through all operations in Logisim Evolution',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/simulations/logisim/sim_logisim_counter_running.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/simulations/logisim/sim_logisim_alu_layout.png',
    duration: '1:45',
    category: 'simulation',
  },

];

export const buildVideos: VideoItem[] = [
  {
    id: 'build-timelapse',
    title: 'Build Process Timelapse',
    description: 'Condensed view of the entire build process from components to complete system',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/process/videos/process_build_timelapse.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/process/timeline/process_timeline_01_mosfet_design.jpg',
    duration: '3:00',
    category: 'build',
  },
  {
    id: 'inverter-fab',
    title: 'Inverter Fabrication',
    description: 'Manual assembly and soldering of the discrete MOSFET inverter',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/fabrication/inverter/main_demo_inverter.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/fabrication/inverter/not_closeup_soldered_mosfets.webp',
    category: 'build',
  },
  {
    id: 'nand-design-flow',
    title: 'NAND Gate Design Flow',
    description: 'From schematic to PCB layout: The complete design journey of a NAND gate',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/design/kicad/nand_gate_full_flow.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/design/kicad/nand_gate_poster.png',
    category: 'build',
  },
  {
    id: 'pcb-routing',
    title: 'PCB Routing Demo',
    description: 'Timelapse of the manual routing process for the ALU PCBs',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/design/kicad/routing-demo.mp4',
    poster: 'https://res.cloudinary.com/du4kxtjpw/image/upload/q_auto,f_auto/alu-website/design/kicad/main_logic.png',
    category: 'build',
  },
];

export const operationVideos: VideoItem[] = [
  {
    id: 'op-add',
    title: 'ADD Operation',
    description: 'Addition with carry flag demonstration',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/demonstrations/operations/demo_operation_add.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-sub',
    title: 'SUB Operation',
    description: 'Subtraction with borrow flag',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/demonstrations/operations/demo_operation_sub.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-add-final',
    title: 'ADD Operation (Final)',
    description: 'Final demonstration of the addition operation',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/demonstrations/operations/add_final_demo.mp4',
    category: 'operation',
  },
  {
    id: 'op-all',
    title: 'All Operations',
    description: 'Complete walkthrough of all ALU operations',
    src: 'https://res.cloudinary.com/du4kxtjpw/video/upload/q_auto,f_auto/alu-website/simulations/logisim/main-demo-logism-evolution-all-opcodes.mp4',
    category: 'operation',
  },
];

export const allVideos = [...featuredVideos, ...operationVideos, ...buildVideos];
