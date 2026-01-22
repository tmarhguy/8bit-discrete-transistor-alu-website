#!/bin/bash

# Find all mp4 files in public/media
find public/media -type f -name "*.mp4" | while read -r file; do
  echo "Processing $file..."
  
  # Temporary output file
  temp_file="${file%.*}_optimized.mp4"
  
  # Optimize using ffmpeg
  # -c:v libx264: Use H.264 codec
  # -crf 24: Constant Rate Factor (lower is better quality, higher is lower size. 23 is default, 24-28 is good for web)
  # -preset slow: Better compression for a given quality
  # -c:a aac -b:a 128k: Audio optimization
  # -movflags +faststart: Move metadata to beginning for faster web streaming
  ffmpeg -y -i "$file" -c:v libx264 -crf 24 -preset slow -c:a aac -b:a 128k -movflags +faststart "$temp_file" < /dev/null
  
  if [ $? -eq 0 ]; then
    original_size=$(wc -c < "$file")
    new_size=$(wc -c < "$temp_file")
    
    if [ $new_size -lt $original_size ]; then
      echo "Optimization successful. Size reduced from $original_size to $new_size bytes."
      mv "$temp_file" "$file"
    else
      echo "Optimized file is larger or same size. Keeping original."
      rm "$temp_file"
    fi
  else
    echo "FFmpeg failed for $file"
    rm "$temp_file"
  fi
  echo "-----------------------------------"
done
