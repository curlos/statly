import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We'll read and parse the TypeScript files as text since they're just data
function extractUrlsFromFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const urls = [];
  const imgurRegex = /https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(png|jpg|jpeg|gif|webp)/g;
  const matches = content.matchAll(imgurRegex);

  for (const match of matches) {
    urls.push(match[0]);
  }

  return [...new Set(urls)]; // Remove duplicates
}

const OUTPUT_DIR = path.join(__dirname, '../public/cloudinary');
const TEMP_DIR = path.join(__dirname, '../temp-downloads');
const QUALITY = 85;
const MAX_WIDTH = 1200;

// Stats tracking
const stats = {
  totalImages: 0,
  downloaded: 0,
  compressed: 0,
  failed: [],
  originalSize: 0,
  compressedSize: 0,
};

// Helper function to sanitize filenames
function sanitizeFilename(url, index) {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${index + 1}_${cleanName}`;
}

// Helper function to create directories
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download image from URL
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    fs.writeFileSync(filepath, response.data);
    return response.data.length;
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

// Compress image using Sharp
async function compressImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();

    let pipeline = sharp(inputPath);

    // Resize if image is too large
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convert to WebP with quality setting
    await pipeline
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    return outputStats.size;
  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`);
  }
}

// Process a single image
async function processImage(url, category, folderName, index) {
  const tempFilename = sanitizeFilename(url, index);
  const tempPath = path.join(TEMP_DIR, tempFilename);

  const outputFilename = tempFilename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const outputFolder = path.join(OUTPUT_DIR, folderName);
  const outputPath = path.join(outputFolder, outputFilename);

  ensureDir(outputFolder);

  try {
    console.log(`[${index + 1}] Downloading: ${url}`);
    const originalSize = await downloadImage(url, tempPath);
    stats.downloaded++;
    stats.originalSize += originalSize;

    console.log(`[${index + 1}] Compressing: ${tempFilename}`);
    const compressedSize = await compressImage(tempPath, outputPath);
    stats.compressed++;
    stats.compressedSize += compressedSize;

    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`[${index + 1}] ✓ Saved ${reduction}% (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`);

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return {
      originalUrl: url,
      localPath: path.relative(path.join(__dirname, '../public'), outputPath),
      category,
      originalSize,
      compressedSize
    };
  } catch (error) {
    console.error(`[${index + 1}] ✗ Failed: ${error.message}`);
    stats.failed.push({ url, error: error.message });

    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return null;
  }
}

// Format bytes to human-readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Parse medal structure from TypeScript file
function parseMedalStructure(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const results = [];

  // Match export const GAME_NAME = { ... }
  const gameRegex = /export const ([A-Z_0-9]+(?:_MEDALS|_RIBBONS|_CALLING_CARDS|_KILLSTREAK_MEDALS)?)\s*=\s*\{/g;
  let gameMatch;

  while ((gameMatch = gameRegex.exec(content)) !== null) {
    const gameName = gameMatch[1];
    const gameStartPos = gameMatch.index;

    // Find the matching closing brace for this game object
    let braceCount = 0;
    let gameEndPos = gameStartPos;
    let foundStart = false;

    for (let i = gameStartPos; i < content.length; i++) {
      if (content[i] === '{') {
        braceCount++;
        foundStart = true;
      } else if (content[i] === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
          gameEndPos = i;
          break;
        }
      }
    }

    const gameBlock = content.substring(gameStartPos, gameEndPos);

    // Now find categories within this game block
    const categoryRegex = /"([^"]+)":\s*\[/g;
    let categoryMatch;

    while ((categoryMatch = categoryRegex.exec(gameBlock)) !== null) {
      const categoryName = categoryMatch[1];
      const categoryStartPos = categoryMatch.index;

      // Find URLs in this category
      const urlPattern = /https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(png|jpg|jpeg|gif|webp)/g;
      const categoryBlock = gameBlock.substring(categoryStartPos);
      const categoryEndPos = categoryBlock.indexOf(']');
      const categoryContent = categoryBlock.substring(0, categoryEndPos);

      let urlMatch;
      while ((urlMatch = urlPattern.exec(categoryContent)) !== null) {
        const url = urlMatch[0];

        // Create clean folder structure: game-name/category-name
        const cleanGameName = gameName.toLowerCase().replace(/_/g, '-');
        const cleanCategoryName = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        results.push({
          url,
          gameName: cleanGameName,
          categoryName: cleanCategoryName,
          folderName: `${cleanGameName}/${cleanCategoryName}`
        });
      }
    }
  }

  return results;
}

// Parse Pokemon card structure
function parsePokemonCards(filepath, prefix) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const results = [];

  // Match imgurImageUrl in the array
  const urlPattern = /"imgurImageUrl":\s*"(https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(png|jpg|jpeg|gif|webp))"/g;
  let match;

  while ((match = urlPattern.exec(content)) !== null) {
    results.push({
      url: match[1],
      gameName: prefix,
      categoryName: 'cards',
      folderName: `${prefix}/cards`
    });
  }

  return results;
}

// Extract all URLs from all medal files
function extractAllUrls() {
  const allUrls = [];

  // Parse battlefield medals
  const medalsPath = path.join(__dirname, '../src/pages/medals/medalsLinks.ts');
  const battlefieldUrls = parseMedalStructure(medalsPath);
  allUrls.push(...battlefieldUrls);

  // Parse Pokemon cards
  const fullArtPath = path.join(__dirname, '../src/pages/medals/fullArtPokemonCardImages.ts');
  const fullArtUrls = parsePokemonCards(fullArtPath, 'pokemon-full-art');
  allUrls.push(...fullArtUrls);

  const googleSheetsPath = path.join(__dirname, '../src/pages/medals/googleSheetsPokemonCardImages.ts');
  const googleSheetsUrls = parsePokemonCards(googleSheetsPath, 'pokemon-google-sheets');
  allUrls.push(...googleSheetsUrls);

  return allUrls;
}

// Main execution
async function main() {
  console.log('🚀 Starting image compression migration...\n');

  // Ensure temp and output directories exist
  ensureDir(TEMP_DIR);
  ensureDir(OUTPUT_DIR);

  // Extract all URLs
  const allUrls = extractAllUrls();

  stats.totalImages = allUrls.length;
  console.log(`📊 Found ${stats.totalImages} images to process\n`);

  // Process all images
  const results = [];

  for (let i = 0; i < allUrls.length; i++) {
    const { url, folderName, gameName, categoryName } = allUrls[i];
    const result = await processImage(url, categoryName, folderName, i);

    if (result) {
      results.push({
        ...result,
        gameName,
        categoryName
      });
    }

    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Save mapping file
  const mappingPath = path.join(OUTPUT_DIR, 'url-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  // Print final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPRESSION REPORT');
  console.log('='.repeat(60));
  console.log(`Total images: ${stats.totalImages}`);
  console.log(`Successfully compressed: ${stats.compressed}`);
  console.log(`Failed: ${stats.failed.length}`);
  console.log(`\nOriginal size: ${formatBytes(stats.originalSize)}`);
  console.log(`Compressed size: ${formatBytes(stats.compressedSize)}`);
  console.log(`Total saved: ${formatBytes(stats.originalSize - stats.compressedSize)} (${((1 - stats.compressedSize / stats.originalSize) * 100).toFixed(1)}%)`);

  if (stats.failed.length > 0) {
    console.log('\n❌ Failed images:');
    stats.failed.forEach(({ url, error }) => {
      console.log(`  - ${url}`);
      console.log(`    Error: ${error}`);
    });
  }

  console.log(`\n✅ Mapping saved to: ${mappingPath}`);
  console.log(`✅ Images saved to: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
