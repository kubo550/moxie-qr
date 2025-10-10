const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://qr.reshrd.com/'
const startIndex = 100;
const count = 100;


// List of URLs to generate QR codes for
const urls = Array.from({ length: count }, (_, i) => `${baseUrl}${i + startIndex}`);

// Output folder for QR codes
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'qr-codes');

function createSafeFileName(url: string, index: number): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.replace(/\//g, '-').replace(/^-/, '');
    return pathname || `qr-code-${index}`;
  } catch (error) {
    return `qr-code-${index}`;
  }
}

/**
 * Generates QR code for a single URL
 */
async function generateQRCode(url: string, index: number): Promise<void> {
  try {
    const fileName = createSafeFileName(url, index);
    const filePath = path.join(OUTPUT_DIR, `${fileName}.png`);

    // Generate QR code
    await QRCode.toFile(filePath, url, {
      type: 'png',
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    console.log(`✓ Generated QR code: ${fileName}.png for ${url}`);
  } catch (error) {
    console.error(`✗ Error generating QR code for ${url}:`, error);
  }
}

/**
 * Main function - generates QR codes for all URLs
 */
async function main() {
  console.log('Starting QR code generation...\n');

  // Create output folder if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created folder: ${OUTPUT_DIR}\n`);
  }

  // Generate QR codes for all URLs
  for (let i = 0; i < urls.length; i++) {
    await generateQRCode(urls[i], i);
  }

  console.log(`\n✓ Done! Generated ${urls.length} QR codes in folder: ${OUTPUT_DIR}`);
}

// Run the script
main().catch((error) => {
  console.error('Critical error:', error);
  process.exit(1);
});


// run this to use:
// npx ts-node --esm scripts/generate-qr-codes.ts