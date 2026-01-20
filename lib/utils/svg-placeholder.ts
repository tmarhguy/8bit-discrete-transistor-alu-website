export const generatePlaceholderSVG = (label: string, width: number, height: number) => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1a1a1a" stroke="#00ff41" stroke-width="4"/>
  <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="#00ff41" stroke-width="2" stroke-dasharray="10,10"/>
  <text x="50%" y="50%" font-family="monospace" font-size="24" fill="#00ff41" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <circle cx="20" cy="20" r="4" fill="#ff0000"/>
  <circle cx="40" cy="20" r="4" fill="#00ff00"/>
</svg>
`;
