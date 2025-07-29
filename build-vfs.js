"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// Get input directory from CLI
var inputDir = process.argv[2];
if (!inputDir) {
    console.error('Usage: ts-node build-vfs.ts <font-folder>');
    process.exit(1);
}
// Validate directory
if (!fs.existsSync(inputDir)) {
    console.error("Input folder \"".concat(inputDir, "\" does not exist."));
    process.exit(1);
}
// Get font files
var fontFiles = fs
    .readdirSync(inputDir)
    .filter(function (f) { return f.endsWith('.ttf') || f.endsWith('.otf'); });
if (fontFiles.length === 0) {
    console.error('No .ttf or .otf font files found in input folder.');
    process.exit(1);
}
// Build vfs object
var vfs = {};
fontFiles.forEach(function (file) {
    var filePath = path.join(inputDir, file);
    var data = fs.readFileSync(filePath).toString('base64');
    vfs[file] = data;
    console.log("".concat(file, " generated successfully."));
});
// Output TypeScript file with typed export
var output = "const vfs: Record<string, string> = ".concat(JSON.stringify(vfs, null, 2), ";\nexport default vfs;\n");
fs.writeFileSync('vfs_fonts.ts', output);
console.log('✅ vfs_fonts.ts generated successfully.');
