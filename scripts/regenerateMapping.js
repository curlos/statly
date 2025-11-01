import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUDINARY_DIR = path.join(__dirname, '../public/cloudinary');
const OUTPUT_FILE = path.join(CLOUDINARY_DIR, 'url-mapping.json');

// Recursively find all .webp files
function findAllWebpFiles(dir, baseDir = dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findAllWebpFiles(filePath, baseDir));
    } else if (file.endsWith('.webp')) {
      const relativePath = path.relative(baseDir, filePath);
      results.push(relativePath);
    }
  }

  return results;
}

// Main
console.log('🔄 Regenerating url-mapping.json from existing files...\n');

const webpFiles = findAllWebpFiles(CLOUDINARY_DIR);
const mapping = [];

for (const file of webpFiles) {
  const pathParts = file.split(path.sep);
  const filename = pathParts[pathParts.length - 1];

  // Skip if it's in the root cloudinary directory
  if (pathParts.length < 2) continue;

  const gameName = pathParts[0];
  const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : gameName;

  const stats = fs.statSync(path.join(CLOUDINARY_DIR, file));

  mapping.push({
    originalUrl: `https://i.imgur.com/${filename.replace(/^\d+_/, '').replace('.webp', '.png')}`,
    localPath: `cloudinary/${file.replace(/\\/g, '/')}`,
    category: categoryName,
    originalSize: 0, // Unknown
    compressedSize: stats.size,
    gameName: gameName,
    categoryName: categoryName
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

console.log(`✅ Generated mapping for ${mapping.length} images`);
console.log(`✅ Saved to: ${OUTPUT_FILE}`);
