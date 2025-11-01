import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration
const MAPPING_FILE = path.join(__dirname, '../public/cloudinary/url-mapping.json');
const PROGRESS_FILE = path.join(__dirname, '../public/cloudinary/upload-progress.json');
const CLOUDINARY_URLS_FILE = path.join(__dirname, '../public/cloudinary/cloudinary-urls.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const BASE_FOLDER = 'Statly'; // Base folder in Cloudinary
const BATCH_SIZE = 5; // Upload 5 images concurrently
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Test mode: set to a number to limit uploads (e.g., 10 for testing)
// Set to null or 0 to upload all images
const TEST_MODE_LIMIT = process.argv.includes('--test') ? 50 : null;

// Stats tracking
const stats = {
  total: 0,
  uploaded: 0,
  skipped: 0,
  failed: 0,
  startTime: Date.now(),
  errors: []
};

// Helper: Load progress file
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('⚠️  Failed to load progress file, starting fresh');
      return { uploaded: {} };
    }
  }
  return { uploaded: {} };
}

// Helper: Save progress
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Helper: Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Helper: Format duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Helper: Create progress bar
function createProgressBar(current, total, width = 40) {
  const percentage = (current / total) * 100;
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${current}/${total} (${percentage.toFixed(1)}%)`;
}

// Helper: Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Upload single image with retry logic
async function uploadImage(entry, localFilePath, retryCount = 0) {
  try {
    // Extract path components
    const relativePath = entry.localPath.replace('cloudinary/', '');
    const pathParts = relativePath.split('/');
    const filename = pathParts.pop();
    const folderPath = pathParts.join('/');

    // Create Cloudinary folder path: Statly/{game}/{category}
    const cloudinaryFolder = `${BASE_FOLDER}/${folderPath}`;

    // Generate public_id (just the filename without extension)
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: cloudinaryFolder,
      public_id: filenameWithoutExt,
      resource_type: 'image',
      overwrite: false, // Don't overwrite if already exists
      unique_filename: false,
      use_filename: false
    });

    return {
      success: true,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id
    };

  } catch (error) {
    // Retry logic
    if (retryCount < RETRY_ATTEMPTS) {
      console.log(`    ↻ Retry ${retryCount + 1}/${RETRY_ATTEMPTS}...`);
      await sleep(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return uploadImage(entry, localFilePath, retryCount + 1);
    }

    return {
      success: false,
      error: error.message
    };
  }
}

// Process a batch of images
async function processBatch(entries, progress) {
  const results = await Promise.all(
    entries.map(async (entry, index) => {
      const localFilePath = path.join(PUBLIC_DIR, entry.localPath);

      // Check if file exists
      if (!fs.existsSync(localFilePath)) {
        console.log(`  ✗ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Missing: ${entry.localPath}`);
        return {
          entry,
          success: false,
          error: 'File not found'
        };
      }

      // Check if already uploaded
      if (progress.uploaded[entry.localPath]) {
        stats.skipped++;
        console.log(`  ⊘ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Skipped: ${entry.localPath}`);
        return {
          entry,
          success: true,
          skipped: true,
          cloudinaryUrl: progress.uploaded[entry.localPath]
        };
      }

      // Upload image
      console.log(`  ↑ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Uploading: ${entry.localPath}`);
      const result = await uploadImage(entry, localFilePath);

      if (result.success) {
        stats.uploaded++;
        progress.uploaded[entry.localPath] = result.cloudinaryUrl;
        saveProgress(progress);
        console.log(`  ✓ [${stats.uploaded + stats.skipped + stats.failed}/${stats.total}] Success: ${path.basename(entry.localPath)}`);
      } else {
        stats.failed++;
        stats.errors.push({ path: entry.localPath, error: result.error });
        console.log(`  ✗ [${stats.uploaded + stats.skipped + stats.failed}/${stats.total}] Failed: ${entry.localPath} - ${result.error}`);
      }

      return {
        entry,
        ...result
      };
    })
  );

  return results;
}

// Main execution
async function main() {
  console.log('🚀 Starting Cloudinary upload...\n');

  // Verify Cloudinary credentials
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not found in .env file');
    console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Load mapping file
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(`❌ Error: Mapping file not found: ${MAPPING_FILE}`);
    process.exit(1);
  }

  let mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

  // Apply test mode limit if enabled
  if (TEST_MODE_LIMIT && TEST_MODE_LIMIT > 0) {
    console.log(`🧪 TEST MODE: Limiting to ${TEST_MODE_LIMIT} images\n`);
    mapping = mapping.slice(0, TEST_MODE_LIMIT);
  }

  stats.total = mapping.length;

  console.log(`📊 Found ${stats.total} images to upload`);
  console.log(`📁 Base folder: ${BASE_FOLDER}\n`);

  // Load progress
  const progress = loadProgress();
  const alreadyUploaded = Object.keys(progress.uploaded).length;

  if (alreadyUploaded > 0) {
    console.log(`♻️  Resuming from previous session (${alreadyUploaded} already uploaded)\n`);
  }

  // Process in batches
  console.log('Starting upload...\n');

  for (let i = 0; i < mapping.length; i += BATCH_SIZE) {
    const batch = mapping.slice(i, i + BATCH_SIZE);
    await processBatch(batch, progress);

    // Show progress bar every batch
    console.log(`\n${createProgressBar(stats.uploaded + stats.skipped + stats.failed, stats.total)}\n`);
  }

  // Save Cloudinary URLs to a separate file (don't touch url-mapping.json)
  console.log('\n📝 Saving Cloudinary URLs to separate file...');

  const cloudinaryUrlsMapping = {};
  for (const [localPath, cloudinaryUrl] of Object.entries(progress.uploaded)) {
    cloudinaryUrlsMapping[localPath] = cloudinaryUrl;
  }

  fs.writeFileSync(CLOUDINARY_URLS_FILE, JSON.stringify(cloudinaryUrlsMapping, null, 2));

  // Calculate duration
  const duration = Date.now() - stats.startTime;

  // Print final report
  console.log('\n' + '='.repeat(70));
  console.log('📊 UPLOAD REPORT');
  console.log('='.repeat(70));
  console.log(`Total images:          ${stats.total}`);
  console.log(`Successfully uploaded: ${stats.uploaded} ✓`);
  console.log(`Skipped (existing):    ${stats.skipped} ⊘`);
  console.log(`Failed:                ${stats.failed} ✗`);
  console.log(`Duration:              ${formatDuration(duration)}`);
  console.log(`Average speed:         ${(stats.uploaded / (duration / 1000)).toFixed(2)} images/sec`);

  if (stats.failed > 0) {
    console.log('\n❌ Failed uploads:');
    stats.errors.forEach(({ path, error }, index) => {
      console.log(`  ${index + 1}. ${path}`);
      console.log(`     Error: ${error}`);
    });
  }

  console.log(`\n✅ Cloudinary URLs saved: ${CLOUDINARY_URLS_FILE}`);
  console.log(`✅ Progress file saved: ${PROGRESS_FILE}`);
  console.log(`✅ All images uploaded to folder: ${BASE_FOLDER}/`);
  console.log('='.repeat(70));

  if (stats.failed === 0) {
    console.log('\n🎉 All images uploaded successfully!');
  } else {
    console.log(`\n⚠️  Upload completed with ${stats.failed} errors. Check the report above.`);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
