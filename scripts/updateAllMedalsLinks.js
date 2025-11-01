import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the cloudinary URLs mapping
const cloudinaryUrlsPath = path.join(__dirname, '../public/cloudinary/cloudinary-urls.json');
const cloudinaryUrls = JSON.parse(fs.readFileSync(cloudinaryUrlsPath, 'utf8'));

// Create a reverse mapping: imgur ID -> cloudinary URL
const imurIdToCloudinary = {};

Object.entries(cloudinaryUrls).forEach(([localPath, cloudinaryUrl]) => {
  // Extract the filename from the local path
  const filename = localPath.split('/').pop();
  // Extract imgur-like ID from filename (e.g., "2_IiuUuoF.webp" -> "IiuUuoF")
  const parts = filename.split('_');
  if (parts.length >= 2) {
    const imgurId = parts[1].split('.')[0]; // "IiuUuoF"
    imurIdToCloudinary[imgurId] = cloudinaryUrl;
  }
});

console.log('Found', Object.keys(imurIdToCloudinary).length, 'mappings');

// Read the current medalsLinks.ts file
const medalsLinksPath = path.join(__dirname, '../src/pages/medals/medalsLinks.ts');
const medalsLinksContent = fs.readFileSync(medalsLinksPath, 'utf8');

// Function to extract imgur ID from URL
function getImgurId(url) {
  // https://i.imgur.com/qQZBT0J.png -> qQZBT0J
  const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)\.(png|jpeg|jpg)/);
  return match ? match[1] : null;
}

// Function to replace imgur URLs in the content
function replaceImgurUrls(content) {
  let updatedContent = content;
  let replacementCount = 0;
  let notFoundCount = 0;
  const notFoundIds = [];

  // Match all imgur URLs
  const imgurUrlRegex = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(png|jpeg|jpg)/g;

  updatedContent = updatedContent.replace(imgurUrlRegex, (match, imgurId, extension) => {
    const cloudinaryUrl = imurIdToCloudinary[imgurId];
    if (cloudinaryUrl) {
      replacementCount++;
      return cloudinaryUrl;
    } else {
      notFoundCount++;
      notFoundIds.push(imgurId);
      return match; // Keep original if no mapping found
    }
  });

  console.log('\nReplacement Summary:');
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

// Replace URLs
const updatedContent = replaceImgurUrls(medalsLinksContent);

// Write the updated content to a new file
const outputPath = path.join(__dirname, '../src/pages/medals/medalsLinks.updated.ts');
fs.writeFileSync(outputPath, updatedContent, 'utf8');

console.log('\n✅ Updated file written to:', outputPath);
console.log('Please review the changes before replacing the original file.');
