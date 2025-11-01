import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the cloudinary URLs mapping
const cloudinaryUrlsPath = path.join(__dirname, '../public/cloudinary/cloudinary-urls.json');
const cloudinaryUrls = JSON.parse(fs.readFileSync(cloudinaryUrlsPath, 'utf8'));

// Create a reverse mapping: imgur ID -> cloudinary URL
const imgurIdToCloudinary = {};

Object.entries(cloudinaryUrls).forEach(([localPath, cloudinaryUrl]) => {
  // Extract the filename from the local path
  const filename = localPath.split('/').pop();
  // Extract imgur-like ID from filename (e.g., "2_IiuUuoF.webp" -> "IiuUuoF")
  const parts = filename.split('_');
  if (parts.length >= 2) {
    const imgurId = parts[1].split('.')[0]; // "IiuUuoF"
    imgurIdToCloudinary[imgurId] = cloudinaryUrl;
  }
});

console.log('Found', Object.keys(imgurIdToCloudinary).length, 'mappings');

// Function to replace imgur URLs in the content
function replaceImgurUrls(content, filename) {
  let updatedContent = content;
  let replacementCount = 0;
  let notFoundCount = 0;
  const notFoundIds = [];

  // Match all imgur URLs
  const imgurUrlRegex = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(png|jpeg|jpg)/g;

  updatedContent = updatedContent.replace(imgurUrlRegex, (match, imgurId) => {
    const cloudinaryUrl = imgurIdToCloudinary[imgurId];
    if (cloudinaryUrl) {
      replacementCount++;
      return cloudinaryUrl;
    } else {
      notFoundCount++;
      notFoundIds.push(imgurId);
      return match; // Keep original if no mapping found
    }
  });

  console.log(`\n${filename} - Replacement Summary:`);
  console.log('- Successfully replaced:', replacementCount);
  console.log('- Not found in Cloudinary:', notFoundCount);

  if (notFoundIds.length > 0) {
    console.log('\nImgur IDs not found in Cloudinary:');
    console.log(notFoundIds.slice(0, 20).join(', '));
    if (notFoundIds.length > 20) {
      console.log(`... and ${notFoundIds.length - 20} more`);
    }
  }

  return updatedContent;
}

// Process fullArtPokemonCardImages.ts
const fullArtPath = path.join(__dirname, '../src/pages/medals/fullArtPokemonCardImages.ts');
const fullArtContent = fs.readFileSync(fullArtPath, 'utf8');
const updatedFullArt = replaceImgurUrls(fullArtContent, 'fullArtPokemonCardImages.ts');
const fullArtOutputPath = path.join(__dirname, '../src/pages/medals/fullArtPokemonCardImages.updated.ts');
fs.writeFileSync(fullArtOutputPath, updatedFullArt, 'utf8');

console.log('\n✅ Updated fullArtPokemonCardImages.ts written to:', fullArtOutputPath);

// Process googleSheetsPokemonCardImages.ts
const googleSheetsPath = path.join(__dirname, '../src/pages/medals/googleSheetsPokemonCardImages.ts');
if (fs.existsSync(googleSheetsPath)) {
  const googleSheetsContent = fs.readFileSync(googleSheetsPath, 'utf8');
  const updatedGoogleSheets = replaceImgurUrls(googleSheetsContent, 'googleSheetsPokemonCardImages.ts');
  const googleSheetsOutputPath = path.join(__dirname, '../src/pages/medals/googleSheetsPokemonCardImages.updated.ts');
  fs.writeFileSync(googleSheetsOutputPath, updatedGoogleSheets, 'utf8');
  console.log('✅ Updated googleSheetsPokemonCardImages.ts written to:', googleSheetsOutputPath);
}

console.log('\nPlease review the changes before replacing the original files.');
