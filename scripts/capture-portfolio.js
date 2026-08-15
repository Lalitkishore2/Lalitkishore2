const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('Launching headless Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to https://lalitkishore.is-a.dev/ ...');
  await page.goto('https://lalitkishore.is-a.dev/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Frame 1: Hero View
  console.log('Capturing Hero view...');
  const f1Buffer = await page.screenshot({ type: 'png' });
  const f1Path = path.join(assetsDir, 'portfolio-card.png');
  fs.writeFileSync(f1Path, f1Buffer);

  // Frame 2: Scroll to Projects / Systems
  console.log('Capturing Projects / Systems view...');
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  const f2Buffer = await page.screenshot({ type: 'png' });

  // Frame 3: Scroll further / About / Tech
  console.log('Capturing Tech / About view...');
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  const f3Buffer = await page.screenshot({ type: 'png' });

  await browser.close();

  // Convert to Base64
  const b64_1 = f1Buffer.toString('base64');
  const b64_2 = f2Buffer.toString('base64');
  const b64_3 = f3Buffer.toString('base64');

  // Build Animated Browser SVG
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" width="100%" height="100%">
  <defs>
    <clipPath id="roundedFrame">
      <rect width="1200" height="680" rx="10" ry="10" />
    </clipPath>
    <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#161b22" />
      <stop offset="100%" stop-color="#1c2128" />
    </linearGradient>
    <style>
      @keyframes crossfade {
        0%, 30%   { opacity: 1; }
        35%, 95%  { opacity: 0; }
        100%      { opacity: 1; }
      }
      @keyframes crossfade2 {
        0%, 30%   { opacity: 0; }
        35%, 65%  { opacity: 1; }
        70%, 100% { opacity: 0; }
      }
      @keyframes crossfade3 {
        0%, 65%   { opacity: 0; }
        70%, 95%  { opacity: 1; }
        100%      { opacity: 0; }
      }
      .slide-1 { animation: crossfade 9s infinite; }
      .slide-2 { animation: crossfade2 9s infinite; }
      .slide-3 { animation: crossfade3 9s infinite; }
    </style>
  </defs>
  
  <g clip-path="url(#roundedFrame)">
    <rect width="1200" height="680" fill="#0b0d10" />
    
    <g class="slide-3">
      <image href="data:image/png;base64,${b64_3}" x="0" y="44" width="1200" height="636" preserveAspectRatio="xMidYMid slice" />
    </g>
    <g class="slide-2">
      <image href="data:image/png;base64,${b64_2}" x="0" y="44" width="1200" height="636" preserveAspectRatio="xMidYMid slice" />
    </g>
    <g class="slide-1">
      <image href="data:image/png;base64,${b64_1}" x="0" y="44" width="1200" height="636" preserveAspectRatio="xMidYMid slice" />
    </g>
    
    <rect width="1200" height="44" fill="url(#barGrad)" />
    <line x1="0" y1="44" x2="1200" y2="44" stroke="#30363d" stroke-width="1.5" />
    
    <circle cx="24" cy="22" r="6" fill="#ff5f56" />
    <circle cx="44" cy="22" r="6" fill="#ffbd2e" />
    <circle cx="64" cy="22" r="6" fill="#27c93f" />
    
    <rect x="100" y="8" width="980" height="28" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1" />
    <path d="M122 23 h12 v9 h-12 z M124 23 v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="#8b949e" stroke-width="1.5" stroke-linecap="round" />
    <text x="144" y="27" font-family="'Fira Code', -apple-system, monospace" font-weight="500" font-size="13" fill="#9ccfd8">https://lalitkishore.is-a.dev/</text>
    
    <rect x="1000" y="11" width="68" height="22" rx="4" fill="#238636" />
    <text x="1034" y="26" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="600" font-size="11" fill="#ffffff">LIVE &#x2197;</text>
  </g>
  
  <rect width="1200" height="680" rx="10" ry="10" fill="none" stroke="#30363d" stroke-width="2" />
</svg>`;

  const svgPath = path.join(assetsDir, 'portfolio-browser.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('Saved assets/portfolio-browser.svg successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
