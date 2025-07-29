const fs = require('fs');
const path = require('path');

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: node build-vfs.js <font-folder>');
  process.exit(1);
}

if (!fs.existsSync(inputDir)) {
  console.error(`Input folder "${inputDir}" does not exist.`);
  process.exit(1);
}

const fontFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.ttf') || f.endsWith('.otf'));
if (fontFiles.length === 0) {
  console.error('No .ttf or .otf font files found in input folder.');
  process.exit(1);
}

const vfs = {};

fontFiles.forEach(file => {
  const filePath = path.join(inputDir, file);
  const data = fs.readFileSync(filePath).toString('base64');
  vfs[file] = data;
});

const output = `this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = ${JSON.stringify(vfs, null, 2)};`;

fs.writeFileSync('vfs_fonts.js', output);
console.log('vfs_fonts.js generated successfully.');