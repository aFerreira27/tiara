import * as fs from 'fs';
import * as path from 'path';

// Get input directory from CLI
const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: ts-node build-vfs.ts <font-folder>');
  process.exit(1);
}

// Validate directory
if (!fs.existsSync(inputDir)) {
  console.error(`Input folder "${inputDir}" does not exist.`);
  process.exit(1);
}

// Get font files
const fontFiles: string[] = fs
  .readdirSync(inputDir)
  .filter((f: string) => f.endsWith('.ttf') || f.endsWith('.otf'));

if (fontFiles.length === 0) {
  console.error('No .ttf or .otf font files found in input folder.');
  process.exit(1);
}

// Build vfs object
const vfs: Record<string, string> = {};

fontFiles.forEach((file: string) => {
  const filePath = path.join(inputDir, file);
  const data = fs.readFileSync(filePath).toString('base64');
  vfs[file] = data;
  console.log(`${file} generated successfully.`);
});

// Output TypeScript file with typed export
const output = `const vfs: Record<string, string> = ${JSON.stringify(vfs, null, 2)};\nexport default vfs;\n`;

fs.writeFileSync('vfs_fonts.ts', output);
console.log('✅ vfs_fonts.ts generated successfully.');
