#!/usr/bin/env node

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'du4kxtjpw',
  api_key: '887251611198833',
  api_secret: 'UQTWTLtz8m0z5IEcWWSyhlht4Oc',
});

// Video upload configuration - Batch 2: Missing videos
const filesToUpload = [
  { local: 'public/media/design/kicad/schematics_design_video_full.mp4', folder: 'alu-website/design/kicad' },
  { local: 'public/media/simulations/ngspice/sim_ngspice_nor_kicad.mp4', folder: 'alu-website/simulations/ngspice' },
  { local: 'public/media/verification/testing_demo.mp4', folder: 'alu-website/verification' },
];

async function uploadFile(filePath, folder) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const publicId = `${folder}/${fileName}`;
  
  try {
    console.log(`📤 Uploading ${fileName}...`);
    
    // Check if local file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`Local file not found: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: 'video',
      public_id: publicId,
      overwrite: true,
      chunk_size: 6000000, // 6MB chunks for large files
    });
    
    const size = fs.statSync(filePath).size;
    console.log(`✅ ${fileName}`);
    console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   URL: ${result.secure_url}`);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du4kxtjpw';
    console.log(`   Optimized URL: https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${publicId}\n`);
    
    return { success: true, url: result.secure_url, publicId };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎬 Cloudinary Asset Upload Script\n');
  console.log(`☁️  Cloud Name: du4kxtjpw\n`);
  
  const results = [];
  
  for (const file of filesToUpload) {
    const result = await uploadFile(file.local, file.folder);
    results.push({ ...file, ...result });
  }
}

main().catch(console.error);
