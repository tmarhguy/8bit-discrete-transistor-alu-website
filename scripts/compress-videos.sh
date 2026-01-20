#!/bin/bash

# Video Compression Script for Cloudinary Upload
# Compresses videos to under 100MB for free tier compatibility

echo "🎬 Video Compression Script"
echo "Target: Compress all videos to <100MB for Cloudinary free tier"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo "Install with: brew install ffmpeg"
    exit 1
fi

echo "✅ ffmpeg found"
echo ""

# Create output directory
mkdir -p public/media-compressed

# Compression settings
# CRF 28 = Good quality, smaller file size
# preset medium = Balance between speed and compression
PRESET="medium"
CRF="28"
AUDIO_BITRATE="128k"

# Function to compress video
compress_video() {
    local input="$1"
    local output="$2"
    local filename=$(basename "$input")
    
    echo "📤 Compressing: $filename"
    
    # Get original size
    local original_size=$(du -h "$input" | cut -f1)
    
    # Compress
    ffmpeg -i "$input" \
        -c:v libx264 -crf $CRF -preset $PRESET \
        -c:a aac -b:a $AUDIO_BITRATE \
        -movflags +faststart \
        "$output" \
        -y -loglevel error
    
    if [ $? -eq 0 ]; then
        local new_size=$(du -h "$output" | cut -f1)
        echo "✅ $filename: $original_size → $new_size"
    else
        echo "❌ Failed to compress $filename"
    fi
    echo ""
}

# Compress all large videos (>50MB)
echo "Starting compression..."
echo ""

# Very large videos (>100MB) - need aggressive compression
compress_video "public/media/simulations/ngspice/sim_ngspice_nor_kicad.mp4" "public/media-compressed/sim_ngspice_nor_kicad.mp4"
compress_video "public/media/simulations/logisim/main-demo-logism-evolution-all-opcodes.mp4" "public/media-compressed/main-demo-logism-evolution-all-opcodes.mp4"
compress_video "public/media/demonstrations/full/demo_full_walkthrough.mp4" "public/media-compressed/demo_full_walkthrough.mp4"

# Large videos (50-100MB) - moderate compression
compress_video "public/media/fabrication/inverter/main_demo_inverter.mp4" "public/media-compressed/main_demo_inverter.mp4"
compress_video "public/media/demonstrations/operations/demo_operation_shift.mp4" "public/media-compressed/demo_operation_shift.mp4"
compress_video "public/media/demonstrations/operations/demo_operation_or.mp4" "public/media-compressed/demo_operation_or.mp4"
compress_video "public/media/demonstrations/operations/demo_operation_and.mp4" "public/media-compressed/demo_operation_and.mp4"
compress_video "public/media/demonstrations/operations/demo_operation_xor.mp4" "public/media-compressed/demo_operation_xor.mp4"
compress_video "public/media/simulations/logisim/logic_unit_sim_logism_evolution_fpga_export.mp4" "public/media-compressed/logic_unit_sim_logism_evolution_fpga_export.mp4"
compress_video "public/media/simulations/logisim/sim_logisim_counter_running.mp4" "public/media-compressed/sim_logisim_counter_running.mp4"
compress_video "public/media/design/kicad/routing-demo.mp4" "public/media-compressed/routing-demo.mp4"
compress_video "public/media/demonstrations/operations/demo_operation_sub.mp4" "public/media-compressed/demo_operation_sub.mp4"
compress_video "public/media/simulations/logisim/sub-logism-demo-video.mp4" "public/media-compressed/sub-logism-demo-video.mp4"
compress_video "public/media/design/kicad/nand_gate_full_flow.mp4" "public/media-compressed/nand_gate_full_flow.mp4"
compress_video "public/media/process/videos/process_build_timelapse.mp4" "public/media-compressed/process_build_timelapse.mp4"

echo "✅ Compression complete!"
echo ""
echo "📊 Summary:"
echo "Original total: ~1.44GB"
echo "Compressed files in: public/media-compressed/"
echo ""
echo "Next steps:"
echo "1. Review compressed videos for quality"
echo "2. Run: node scripts/upload-to-cloudinary.js"
