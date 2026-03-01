const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputFile = process.argv[2];
const outputDir = path.resolve(__dirname, '../public');

if (!inputFile) {
    console.error('Please provide an input image path.');
    process.exit(1);
}

if (!fs.existsSync(inputFile)) {
    console.error(`File not found: ${inputFile}`);
    process.exit(1);
}

const sizes = [
    { name: 'pwa-192x192.png', width: 192, height: 192 },
    { name: 'pwa-512x512.png', width: 512, height: 512 },
    { name: 'manifest-icon-192.maskable.png', width: 192, height: 192 },
    { name: 'manifest-icon-512.maskable.png', width: 512, height: 512 },
    { name: 'apple-touch-icon.png', width: 180, height: 180 }
];

async function generateIcons() {
    console.log('Generating icons...');
    try {
        for (const size of sizes) {
            const outputPath = path.join(outputDir, size.name);
            await sharp(inputFile)
                .resize({
                    width: size.width,
                    height: size.height,
                    fit: 'cover',
                    position: 'center'
                })
                .png()
                .toFile(outputPath);
            console.log(`Created: ${size.name}`);
        }
        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons();
