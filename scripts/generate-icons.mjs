import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const splashDir = path.join(publicDir, 'splashscreens');

// Midnight Studio colors
const SURFACE = '#0f1413';
const PRIMARY = '#ffb4a4';
const PRIMARY_CONTAINER = '#a65d4d';
const ON_SURFACE = '#dfe4e0';
const TERTIARY = '#cac6c1';

// Icon sizes required
const iconSizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

// Splash screen sizes (common iPhone dimensions)
const splashSizes = [
  { name: 'iphone5', width: 640, height: 1136 },
  { name: 'iphone6', width: 750, height: 1334 },
  { name: 'iphonex', width: 1125, height: 2436 },
  { name: 'iphone14pro', width: 1179, height: 2556 },
];

// Create a simple "C" lettermark logo as SVG
function createLogoSVG(size) {
  const strokeWidth = size * 0.12;
  const radius = (size * 0.35);
  const center = size / 2;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${SURFACE}"/>
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="none"
        stroke="${PRIMARY}"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
        stroke-dasharray="${radius * Math.PI * 1.5} ${radius * Math.PI * 2}"
        transform="rotate(-45 ${center} ${center})"
      />
    </svg>
  `;
}

// Generate app icons
async function generateIcons() {
  console.log('Generating app icons...');

  for (const size of iconSizes) {
    const logoSvg = createLogoSVG(size);
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    await sharp(Buffer.from(logoSvg))
      .png()
      .toFile(outputPath);

    console.log(`✓ Created ${size}x${size} icon`);
  }

  // Copy 180x180 to apple-touch-icon
  await fs.promises.copyFile(
    path.join(iconsDir, 'icon-180x180.png'),
    path.join(publicDir, 'apple-touch-icon.png')
  );
  console.log('✓ Created apple-touch-icon.png');

  // Generate favicon (32x32)
  const faviconSvg = createLogoSVG(32);
  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ Created favicon.ico');
}

// Generate shortcut icons (simplified versions)
async function generateShortcutIcons() {
  console.log('\nGenerating shortcut icons...');

  // "New Record" icon - plus symbol
  const newRecordSvg = `
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="${SURFACE}"/>
      <rect x="42" y="24" width="12" height="48" rx="6" fill="${PRIMARY}"/>
      <rect x="24" y="42" width="48" height="12" rx="6" fill="${PRIMARY}"/>
    </svg>
  `;

  await sharp(Buffer.from(newRecordSvg))
    .png()
    .toFile(path.join(iconsDir, 'shortcut-new.png'));
  console.log('✓ Created shortcut-new.png');

  // "Records" icon - list symbol
  const recordsSvg = `
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="${SURFACE}"/>
      <rect x="24" y="30" width="48" height="8" rx="4" fill="${PRIMARY}"/>
      <rect x="24" y="44" width="36" height="8" rx="4" fill="${PRIMARY}"/>
      <rect x="24" y="58" width="42" height="8" rx="4" fill="${PRIMARY}"/>
    </svg>
  `;

  await sharp(Buffer.from(recordsSvg))
    .png()
    .toFile(path.join(iconsDir, 'shortcut-records.png'));
  console.log('✓ Created shortcut-records.png');
}

// Generate splash screens
async function generateSplashScreens() {
  console.log('\nGenerating splash screens...');

  for (const { name, width, height } of splashSizes) {
    const logoSize = 120;
    const logoSvg = createLogoSVG(logoSize);

    // Create logo buffer
    const logoBuffer = await sharp(Buffer.from(logoSvg)).png().toBuffer();

    // Calculate positions
    const logoX = Math.floor((width - logoSize) / 2);
    const logoY = Math.floor((height - logoSize) / 2 - 60);

    // Create text overlay SVG
    const textSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${SURFACE}"/>
        <text
          x="${width / 2}"
          y="${height / 2 + 80}"
          font-family="serif"
          font-size="32"
          font-weight="600"
          fill="${ON_SURFACE}"
          text-anchor="middle"
        >Clarity</text>
        <text
          x="${width / 2}"
          y="${height / 2 + 115}"
          font-family="sans-serif"
          font-size="14"
          fill="${TERTIARY}"
          text-anchor="middle"
        >Your space to think clearly.</text>
      </svg>
    `;

    // Composite logo on background
    await sharp(Buffer.from(textSvg))
      .composite([
        {
          input: logoBuffer,
          top: logoY,
          left: logoX,
        }
      ])
      .png()
      .toFile(path.join(splashDir, `${name}.png`));

    console.log(`✓ Created ${name}.png (${width}x${height})`);
  }
}

// Generate placeholder screenshot
async function generateScreenshot() {
  console.log('\nGenerating placeholder screenshot...');

  const screenshotsDir = path.join(publicDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const width = 1280;
  const height = 720;

  const screenshotSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${SURFACE}"/>
      <text
        x="${width / 2}"
        y="${height / 2 - 20}"
        font-family="serif"
        font-size="48"
        font-weight="600"
        fill="${ON_SURFACE}"
        text-anchor="middle"
      >Clarity</text>
      <text
        x="${width / 2}"
        y="${height / 2 + 30}"
        font-family="sans-serif"
        font-size="20"
        fill="${TERTIARY}"
        text-anchor="middle"
      >CBT Thought Record Journal</text>
    </svg>
  `;

  await sharp(Buffer.from(screenshotSvg))
    .png()
    .toFile(path.join(screenshotsDir, 'dashboard.png'));

  console.log('✓ Created dashboard.png');
}

// Main execution
async function main() {
  try {
    await generateIcons();
    await generateShortcutIcons();
    await generateSplashScreens();
    await generateScreenshot();
    console.log('\n✅ All PWA assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

main();
