#!/bin/bash

# Find all mp4 files > 50M
find public -name "*.mp4" -type f -size +50M | while read file; do
    echo "Processing $file..."
    original_size=$(du -h "$file" | cut -f1)
    
    # Compress to temp file
    # increased CRF slightly to 26 for better compression while maintaining quality
    # user asked for "little to no perceived compression", 23-28 is usually the sweet spot. 
    # Git limit is hard 100MB, soft 50MB. 
    # Some files are 400MB. 28 might be needed for those.
    # Let's use CRF 26 as a balance.
    ffmpeg -nostdin -i "$file" -vcodec libx264 -crf 26 -preset medium -acodec copy "${file}.temp.mp4" -y -loglevel error

    if [ $? -eq 0 ]; then
        mv "${file}.temp.mp4" "$file"
        new_size=$(du -h "$file" | cut -f1)
        echo "✅ Compressed $file: $original_size -> $new_size"
    else
        echo "❌ Failed to compress $file"
        rm "${file}.temp.mp4"
    fi
done
