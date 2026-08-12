const keyframes = [
  { position: [0.950, 28.930, 0.900] },
  { position: [0.950, 0.900, 0.900] },
  { position: [0.900, 0.850, 0.300] },
  { position: [0.100, 0.800, 0.950] },
  { position: [1.200, 0.800, 1.700] },
  { position: [2.270, 0.750, 1.000] },
  { position: [1.600, 0.900, 0.700] },
  { position: [-2.000, 1.700, 0.300] },
  { position: [-0.600, 1.300, 1.500] },
  { position: [1.200, 0.900, 0.900] },
  { position: [1.400, 0.900, 0.600] },
  { position: [-1.200, 1.250, 0.800] },
];

function dist(p1, p2) {
  return Math.sqrt(
    Math.pow(p2[0] - p1[0], 2) +
    Math.pow(p2[1] - p1[1], 2) +
    Math.pow(p2[2] - p1[2], 2)
  );
}

const targetSpeed = 0.5; // units per second for normal movement

console.log("Calculated Durations (Target Speed: " + targetSpeed + " u/s):");

for (let i = 0; i < keyframes.length - 1; i++) {
  const d = dist(keyframes[i].position, keyframes[i+1].position);
  let dur = d / targetSpeed;
  
  // Special case for descent (Scene 0->1)
  if (i === 0) {
     console.log(`Segment ${i}->${i+1}: Dist=${d.toFixed(2)}, CalcDuration=${dur.toFixed(2)}s (DESCENT - OVERRIDE)`);
  } else {
     console.log(`Segment ${i}->${i+1}: Dist=${d.toFixed(2)}, CalcDuration=${dur.toFixed(2)}s`);
  }
}
