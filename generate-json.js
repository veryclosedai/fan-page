const fs = require('fs');
const path = require('path');
const probe = require('probe-image-size');

const PHOTOS_DIR = path.join(__dirname, 'photos');
const OUTPUT_JSON = path.join(__dirname, 'photos.json');

const photos = [];
const files = fs.readdirSync(PHOTOS_DIR);

files.forEach(file => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
    const filePath = path.join(PHOTOS_DIR, file);
    try {
      const data = fs.readFileSync(filePath);
      const { width, height } = probe.sync(data);
      photos.push({
        src: `photos/${file}`,
        width,
        height
      });
    } catch (e) {
      console.warn(`⚠️ Could not process ${file}:`, e.message);
    }
  }
});
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(photos, null, 2));
console.log(`\n✅ Success! Generated ${photos.length} randomized image entries in ${OUTPUT_JSON}`);