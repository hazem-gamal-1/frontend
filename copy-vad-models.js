const fs = require('fs');
const path = require('path');

const srcPaths = [
  'node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx',
  'node_modules/@ricky0123/vad-web/dist/silero_vad_v5.onnx',
  'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js'
];

const ortDir = 'node_modules/onnxruntime-web/dist';
const destDir = path.join(__dirname, 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy VAD files
srcPaths.forEach(src => {
  const fullSrc = path.join(__dirname, src);
  const fileName = path.basename(src);
  const fullDest = path.join(destDir, fileName);

  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, fullDest);
    console.log(`Copied ${fileName} to public/`);
  }
});

// Copy all WASM files from ONNX
const fullOrtDir = path.join(__dirname, ortDir);
if (fs.existsSync(fullOrtDir)) {
  const files = fs.readdirSync(fullOrtDir);
  files.forEach(file => {
    if (file.endsWith('.wasm')) {
      const fullSrc = path.join(fullOrtDir, file);
      const fullDest = path.join(destDir, file);
      fs.copyFileSync(fullSrc, fullDest);
      console.log(`Copied ${file} to public/`);
    }
  });
}

console.log('Copy complete.');
