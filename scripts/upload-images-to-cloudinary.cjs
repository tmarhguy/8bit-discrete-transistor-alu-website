const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du4kxtjpw',
  api_key: '887251611198833',
  api_secret: 'UQTWTLtz8m0z5IEcWWSyhlht4Oc',
});

// Image upload configuration - High-priority images
const imagesToUpload = [
  // Hero & Posters
  { local: 'public/media/hero/hero_system_photo.png', folder: 'alu-website/hero' },
  { local: 'public/media/simulations/logisim/sim_logisim_alu_layout.png', folder: 'alu-website/simulations/logisim' },
  { local: 'public/media/process/timeline/process_timeline_01_mosfet_design.jpg', folder: 'alu-website/process/timeline' },
  { local: 'public/media/fabrication/inverter/not_closeup_soldered_mosfets.webp', folder: 'alu-website/fabrication/inverter' },
  { local: 'public/media/design/kicad/nand_gate_poster.png', folder: 'alu-website/design/kicad' },
  { local: 'public/media/design/kicad/main_logic.png', folder: 'alu-website/design/kicad' },
  // Timeline Images
  { local: 'public/media/process/timeline/process_timeline_02_schematic.webp', folder: 'alu-website/process/timeline' },
  { local: 'public/media/simulations/logisim/sim_logisim_evolution_full.png', folder: 'alu-website/simulations/logisim' },
  { local: 'public/media/verification/test_passed.png', folder: 'alu-website/verification' },
  { local: 'public/media/process/timeline/process_timeline_04_pcb_design.png', folder: 'alu-website/process/timeline' },
];

async function uploadImage(filePath, folder) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);
  const publicId = `${folder}/${fileName}`;
  
  try {
    console.log(`📤 Uploading ${fileName}${ext}...`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`Local file not found: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      public_id: publicId,
      overwrite: true,
    });
    
    const size = fs.statSync(filePath).size;
    console.log(`✅ ${fileName}`);
    console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   URL: ${result.secure_url}`);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du4kxtjpw';
    console.log(`   Optimized URL: https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${publicId}${ext}\n`);
    
    return { success: true, url: result.secure_url, publicId };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function uploadAll() {
  console.log('🎬 Cloudinary Image Upload Script\n');
  console.log(`☁️  Cloud Name: ${cloudinary.config().cloud_name}\n`);
  
  const results = [];
  
  for (const file of imagesToUpload) {
    const result = await uploadImage(file.local, file.folder);
    results.push({ file: file.local, ...result });
  }
  
  console.log('\n📊 Upload Summary:');
  console.log(`Total: ${results.length}`);
  console.log(`Success: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed uploads:');
    failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
  }
}

uploadAll().catch(console.error);
