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
const PROGRESS_FILE = path.join(__dirname, '../public/cloudinary/mw2019-camos-progress.json');
const CLOUDINARY_URLS_FILE = path.join(__dirname, '../public/cloudinary/cloudinary-urls.json');
const SOURCE_DIR = path.join(__dirname, '../public/mw2019-weapon-camos');
const CLOUDINARY_DEST_DIR = path.join(__dirname, '../public/cloudinary/mw2019-weapon-camos');
const BASE_FOLDER = 'Statly/mw2019-weapon-camos'; // Base folder in Cloudinary
const BATCH_SIZE = 5; // Upload 5 images concurrently
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Test mode: set to a number to limit uploads (e.g., 10 for testing)
const TEST_MODE_LIMIT = process.argv.includes('--test') ? 10 : null;

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
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
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

// Helper: Copy file to cloudinary destination
function copyToCloudinaryFolder(sourceFile, category, filename) {
  const destDir = path.join(CLOUDINARY_DEST_DIR, category);
  const destFile = path.join(destDir, filename);

  // Create directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(sourceFile, destFile);
}

// Upload single image with retry logic
async function uploadImage(entry, retryCount = 0) {
  try {
    const { category, filename, localPath, cloudinaryFolder } = entry;

    // Generate public_id (filename without extension)
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      folder: cloudinaryFolder,
      public_id: filenameWithoutExt,
      resource_type: 'image',
      overwrite: false,
      unique_filename: false,
      use_filename: false
    });

    // Copy file to cloudinary folder
    copyToCloudinaryFolder(localPath, category, filename);

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
      return uploadImage(entry, retryCount + 1);
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
      const relativePath = `cloudinary/mw2019-weapon-camos/${entry.category}/${entry.filename}`;

      // Check if file exists
      if (!fs.existsSync(entry.localPath)) {
        console.log(`  ✗ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Missing: ${entry.filename}`);
        return {
          entry,
          success: false,
          error: 'File not found'
        };
      }

      // Check if already uploaded
      if (progress.uploaded[relativePath]) {
        stats.skipped++;
        console.log(`  ⊘ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Skipped: ${entry.filename}`);
        return {
          entry,
          success: true,
          skipped: true,
          cloudinaryUrl: progress.uploaded[relativePath]
        };
      }

      // Upload image
      console.log(`  ↑ [${stats.uploaded + stats.skipped + stats.failed + index + 1}/${stats.total}] Uploading: ${entry.category}/${entry.filename}`);
      const result = await uploadImage(entry);

      if (result.success) {
        stats.uploaded++;
        progress.uploaded[relativePath] = result.cloudinaryUrl;
        saveProgress(progress);
        console.log(`  ✓ [${stats.uploaded + stats.skipped + stats.failed}/${stats.total}] Success: ${entry.filename}`);
      } else {
        stats.failed++;
        stats.errors.push({ path: `${entry.category}/${entry.filename}`, error: result.error });
        console.log(`  ✗ [${stats.uploaded + stats.skipped + stats.failed}/${stats.total}] Failed: ${entry.filename} - ${result.error}`);
      }

      return {
        entry,
        ...result
      };
    })
  );

  return results;
}

// Scan directory for all .webp files
function scanDirectory() {
  const entries = [];

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Error: Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(SOURCE_DIR).filter(item => {
    const fullPath = path.join(SOURCE_DIR, item);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const category of categories) {
    const categoryPath = path.join(SOURCE_DIR, category);
    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.webp'));

    for (const filename of files) {
      entries.push({
        category,
        filename,
        localPath: path.join(categoryPath, filename),
        cloudinaryFolder: `${BASE_FOLDER}/${category}`
      });
    }
  }

  return entries;
}

// Main execution
async function main() {
  console.log('🚀 Starting MW2019 Weapon Camos upload to Cloudinary...\n');

  // Verify Cloudinary credentials
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not found in .env file');
    console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Scan directory for images
  let entries = scanDirectory();

  // Apply test mode limit if enabled
  if (TEST_MODE_LIMIT && TEST_MODE_LIMIT > 0) {
    console.log(`🧪 TEST MODE: Limiting to ${TEST_MODE_LIMIT} images\n`);
    entries = entries.slice(0, TEST_MODE_LIMIT);
  }

  stats.total = entries.length;

  console.log(`📊 Found ${stats.total} images to upload`);
  console.log(`📁 Source folder: ${SOURCE_DIR}`);
  console.log(`☁️  Cloudinary folder: ${BASE_FOLDER}\n`);

  // Load progress
  const progress = loadProgress();
  const alreadyUploaded = Object.keys(progress.uploaded).length;

  if (alreadyUploaded > 0) {
    console.log(`♻️  Resuming from previous session (${alreadyUploaded} already uploaded)\n`);
  }

  // Process in batches
  console.log('Starting upload...\n');

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await processBatch(batch, progress);

    // Show progress bar every batch
    console.log(`\n${createProgressBar(stats.uploaded + stats.skipped + stats.failed, stats.total)}\n`);
  }

  // Update cloudinary-urls.json
  console.log('\n📝 Updating cloudinary-urls.json...');

  let cloudinaryUrls = {};
  if (fs.existsSync(CLOUDINARY_URLS_FILE)) {
    cloudinaryUrls = JSON.parse(fs.readFileSync(CLOUDINARY_URLS_FILE, 'utf-8'));
  }

  // Merge new URLs
  Object.assign(cloudinaryUrls, progress.uploaded);

  fs.writeFileSync(CLOUDINARY_URLS_FILE, JSON.stringify(cloudinaryUrls, null, 2));

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
  console.log(`✅ Local copies created: ${CLOUDINARY_DEST_DIR}`);
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
