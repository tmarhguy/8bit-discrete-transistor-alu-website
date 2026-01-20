#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Large images to convert (>1MB)
const imagesToConvert = [
  'public/media/design/kicad/main_control_page-0001.jpg',
  'public/media/design/kicad/design_kicad_alu_schematic.jpg',
  'public/media/design/kicad/main_logic_page-0001.jpg',
  'public/media/process/timeline/process_timeline_02_schematic.jpg',
  'public/media/pcb/renders/alufinal2.png',
  'public/media/pcb/renders/alu_hero.png',
  'public/media/fabrication/assembly/fab_assembly_step_03_soldering.jpg',
  'public/media/fabrication/inverter/not_closeup_soldered_mosfets.jpg',
  'public/media/fabrication/inverter/not_demo_on_to_off.jpg',
  'public/media/fabrication/inverter/not_demo_off_to_on.jpg',
];

async function convertToWebP(inputPath) {
  const parsed = path.parse(inputPath);
  const outputPath = path.join(parsed.dir, `${parsed.name}.webp`);
  
  try {
    const info = await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
    
    return { original: originalSize, new: newSize, path: outputPath };
  } catch (error) {
    console.error(`✗ Failed to convert ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Converting large images to WebP format...\n');
  
  const results = [];
  for (const imagePath of imagesToConvert) {
    if (fs.existsSync(imagePath)) {
      const result = await convertToWebP(imagePath);
      if (result) results.push(result);
    } else {
      console.log(`⚠️  Skipping ${imagePath} (not found)`);
    }
  }
  
  console.log('\n📊 Summary:');
  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalNew = results.reduce((sum, r) => sum + r.new, 0);
  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  
  console.log(`Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Savings: ${totalSavings}% (${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)}MB)`);
  console.log(`\n✅ Converted ${results.length} images`);
  console.log('\nNext steps:');
  console.log('1. Update image references in code to use .webp extensions');
  console.log('2. Consider keeping originals as fallbacks or delete them');
}

main().catch(console.error);
