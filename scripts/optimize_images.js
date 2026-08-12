import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const MEDIA_DIR = 'public/media';
const TARGET_EXT = '.webp';

async function optimizeImages() {
  const files = await glob(`${MEDIA_DIR}/**/*.{png,jpg,jpeg,JPG,PNG}`);
  
  console.log(`Found ${files.length} images to optimize.`);

  for (const file of files) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const targetFile = path.join(dir, `${basename}${TARGET_EXT}`);

    console.log(`Optimizing: ${file} -> ${targetFile}`);

    try {
      await sharp(file)
        .webp({ quality: 80, effort: 6 }) 
        .toFile(targetFile);
        
      console.log(`✓ Generated ${targetFile}`);
      
    } catch (err) {
      console.error(`✗ Error optimizing ${file}:`, err);
    }
  }
}

optimizeImages().catch(console.error);
