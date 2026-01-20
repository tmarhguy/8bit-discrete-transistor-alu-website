#!/usr/bin/env node

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'du4kxtjpw',
  api_key: '887251611198833',
  api_secret: 'UQTWTLtz8m0z5IEcWWSyhlht4Oc',
});

// New videos to upload
const newVideos = [
  { local: 'public/media-compressed/mosfet_design_full_kicad.mp4', folder: 'alu-website/design/vlsi' },
  { local: 'public/media-compressed/schematics_design_video_full.mp4', folder: 'alu-website/design/kicad' },
];

async function uploadVideo(videoPath, folder) {
  const fileName = videoPath.split('/').pop().replace('.mp4', '');
  const publicId = `${folder}/${fileName}`;
  
  try {
    console.log(`📤 Uploading ${fileName}...`);
    
    const result = await cloudinary.uploader.upload(videoPath, {
      resource_type: 'video',
      public_id: publicId,
      folder: folder,
      overwrite: true,
    });
    
    const size = fs.statSync(videoPath).size;
    console.log(`✅ ${fileName}`);
    console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   URL: ${result.secure_url}\n`);
    
    return { success: true, url: result.secure_url, publicId };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎬 Uploading New Timeline Videos to Cloudinary\n');
  
  for (const video of newVideos) {
    if (fs.existsSync(video.local)) {
      await uploadVideo(video.local, video.folder);
    } else {
      console.log(`⚠️  Skipping ${video.local} (not found)\n`);
    }
  }
  
  console.log('✅ Upload complete!');
}

main().catch(console.error);
