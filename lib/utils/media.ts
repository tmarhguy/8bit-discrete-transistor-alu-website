export const getCaptionFromUrl = (url: string) => {
  const originalFilename = url.split('/').pop()?.split('.')[0] || '';
  let filename = originalFilename;
  
  // Remove common technical prefixes/suffixes
  filename = filename.replace(/(sim_|design_|demo_|screenshot_|process_|timeline_|full_|step_|final_|alufinal\d*|v\d+)/gi, '');
  
  // Remove leading numbers (e.g., "01_mosfet" -> "mosfet")
  filename = filename.replace(/^\d+[_-]/, '');
  
  // Special handling for specific patterns
  if (filename === 'alu_full' || originalFilename.includes('alufinal')) return 'Complete 8-Bit ALU';
  if (filename === 'alu_slant') return 'ALU Isometric View';
  if (filename.includes('transient-anal')) filename = filename.replace('transient-anal', 'Transient Analysis');
  
  let caption = filename
    .split(/[_-]/)
    .filter(word => word.length > 0)
    .map(word => {
      let lower = word.toLowerCase();
      
      // Fix common typos or project-specific shorthands
      if (lower === 'logism') lower = 'logisim';
      if (lower === 'anal') lower = 'analysis';
      
      const acronyms = [
        'alu', 'cpu', 'pcb', 'vlsi', 'mosfet', 'mosfets', 'nor', 'nand', 'xor', 'xnor', 
        'and', 'or', 'not', 'ic', 'ics', 'spice', 'ngspice', 'fpga', 'isa', 'jlcpcb', 
        'kicad', 'sot', 'isa', 'drc', 'it', 'fr4'
      ];
      
      if (acronyms.includes(lower)) return lower.toUpperCase();
      
      // Proper case for known tools/terms
      const properNames: Record<string, string> = {
        'logisim': 'Logisim',
        'kicad': 'KiCad',
        'ngspice': 'NGSpice',
        'digikey': 'DigiKey',
        'jlcpcb': 'JLCPCB',
        'electric': 'Electric VLSI'
      };

      if (properNames[lower]) return properNames[lower];
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .trim();

  // Fallback to original filename if cleaning made it too short
  if (caption.length < 2) {
    return originalFilename
      .split(/[_-]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  
  return caption;
};
