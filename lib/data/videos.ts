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
    src: '/media/demonstrations/full/demo_full_walkthrough.mp4',
    poster: '/media/hero/hero_system_photo.png',
    duration: '2:30',
    category: 'overview',
  },
  {
    id: 'build-timelapse',
    title: 'Build Process Timelapse',
    description: 'Condensed view of the entire build process from components to complete system',
    src: '/media/process/videos/process_build_timelapse.mp4',
    poster: '/media/fabrication/assembly/fab_assembly_step_03_soldering.jpg',
    duration: '3:00',
    category: 'build',
  },
  {
    id: 'logisim-simulation',
    title: 'Logisim Simulation',
    description: 'Counter running the ALU through all operations in Logisim Evolution',
    src: '/media/simulations/logisim/sim_logisim_counter_running.mp4',
    poster: '/media/simulations/logisim/sim_logisim_alu_layout.png',
    duration: '1:45',
    category: 'simulation',
  },
];

export const operationVideos: VideoItem[] = [
  {
    id: 'op-add',
    title: 'ADD Operation',
    description: 'Addition with carry flag demonstration',
    src: '/media/demonstrations/operations/demo_operation_add.mp4',
    poster: '/media/demonstrations/screenshots/demo_screenshot_add_42_23.jpg',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-sub',
    title: 'SUB Operation',
    description: 'Subtraction with borrow flag',
    src: '/media/demonstrations/operations/demo_operation_sub.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-and',
    title: 'AND Operation',
    description: 'Bitwise AND logic operation',
    src: '/media/demonstrations/operations/demo_operation_and.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-or',
    title: 'OR Operation',
    description: 'Bitwise OR logic operation',
    src: '/media/demonstrations/operations/demo_operation_or.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-xor',
    title: 'XOR Operation',
    description: 'Bitwise XOR logic operation',
    src: '/media/demonstrations/operations/demo_operation_xor.mp4',
    duration: '0:30',
    category: 'operation',
  },
  {
    id: 'op-shift',
    title: 'Shift Operations',
    description: 'Left and right shift demonstrations',
    src: '/media/demonstrations/operations/demo_operation_shift.mp4',
    duration: '0:45',
    category: 'operation',
  },
];

export const allVideos = [...featuredVideos, ...operationVideos];
