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

// Folder configurations
const FOLDERS = [
  {
    name: 'apple-fitness',
    sourceDir: path.join(__dirname, '../public/apple-fitness'),
    baseFolder: 'Statly/apple-fitness',
    progressFile: path.join(__dirname, '../public/cloudinary/apple-fitness-progress.json'),
    destDir: path.join(__dirname, '../public/cloudinary/apple-fitness')
  },
  {
    name: 'ticktick-badges',
    sourceDir: path.join(__dirname, '../public/ticktick-badges'),
    baseFolder: 'Statly/ticktick-badges',
    progressFile: path.join(__dirname, '../public/cloudinary/ticktick-badges-progress.json'),
    destDir: path.join(__dirname, '../public/cloudinary/ticktick-badges')
  }
];

const CLOUDINARY_URLS_FILE = path.join(__dirname, '../public/cloudinary/cloudinary-urls.json');
const BATCH_SIZE = 5; // Upload 5 images concurrently
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Test mode: set to a number to limit uploads (e.g., 10 for testing)
const TEST_MODE_LIMIT = process.argv.includes('--test') ? 10 : null;

// Global stats tracking
const globalStats = {
  total: 0,
  uploaded: 0,
  skipped: 0,
  failed: 0,
  startTime: Date.now(),
  errors: [],
  folders: {}
};

// Helper: Load progress file
function loadProgress(progressFile) {
  if (fs.existsSync(progressFile)) {
    try {
      const data = fs.readFileSync(progressFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('⚠️  Failed to load progress file, starting fresh');
      return { uploaded: {} };
    }
  }
  return { uploaded: {} };
}

// Helper: Save progress
function saveProgress(progressFile, progress) {
  const dir = path.dirname(progressFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
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
function copyToCloudinaryFolder(sourceFile, destDir, subfolder, filename) {
  const destFolderPath = path.join(destDir, subfolder);
  const destFile = path.join(destFolderPath, filename);

  // Create directory if it doesn't exist
  if (!fs.existsSync(destFolderPath)) {
    fs.mkdirSync(destFolderPath, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(sourceFile, destFile);
}

// Upload single image with retry logic
async function uploadImage(entry, retryCount = 0) {
  try {
    const { subfolder, filename, localPath, cloudinaryFolder } = entry;

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
async function processBatch(entries, progress, config, folderStats) {
  const results = await Promise.all(
    entries.map(async (entry, index) => {
      const relativePath = `cloudinary/${config.name}/${entry.subfolder}/${entry.filename}`;

      // Check if file exists
      if (!fs.existsSync(entry.localPath)) {
        console.log(`  ✗ [${folderStats.uploaded + folderStats.skipped + folderStats.failed + index + 1}/${folderStats.total}] Missing: ${entry.filename}`);
        return {
          entry,
          success: false,
          error: 'File not found'
        };
      }

      // Check if already uploaded
      if (progress.uploaded[relativePath]) {
        folderStats.skipped++;
        globalStats.skipped++;
        console.log(`  ⊘ [${folderStats.uploaded + folderStats.skipped + folderStats.failed + index + 1}/${folderStats.total}] Skipped: ${entry.filename}`);
        return {
          entry,
          success: true,
          skipped: true,
          cloudinaryUrl: progress.uploaded[relativePath]
        };
      }

      // Upload image
      console.log(`  ↑ [${folderStats.uploaded + folderStats.skipped + folderStats.failed + index + 1}/${folderStats.total}] Uploading: ${entry.subfolder}/${entry.filename}`);
      const result = await uploadImage(entry);

      if (result.success) {
        folderStats.uploaded++;
        globalStats.uploaded++;
        progress.uploaded[relativePath] = result.cloudinaryUrl;
        saveProgress(config.progressFile, progress);

        // Copy file to cloudinary folder
        copyToCloudinaryFolder(entry.localPath, config.destDir, entry.subfolder, entry.filename);

        console.log(`  ✓ [${folderStats.uploaded + folderStats.skipped + folderStats.failed}/${folderStats.total}] Success: ${entry.filename}`);
      } else {
        folderStats.failed++;
        globalStats.failed++;
        const errorInfo = { path: `${config.name}/${entry.subfolder}/${entry.filename}`, error: result.error };
        folderStats.errors.push(errorInfo);
        globalStats.errors.push(errorInfo);
        console.log(`  ✗ [${folderStats.uploaded + folderStats.skipped + folderStats.failed}/${folderStats.total}] Failed: ${entry.filename} - ${result.error}`);
      }

      return {
        entry,
        ...result
      };
    })
  );

  return results;
}

// Scan directory for all .png files
function scanDirectory(config) {
  const entries = [];

  if (!fs.existsSync(config.sourceDir)) {
    console.error(`❌ Error: Source directory not found: ${config.sourceDir}`);
    return entries;
  }

  const subfolders = fs.readdirSync(config.sourceDir).filter(item => {
    const fullPath = path.join(config.sourceDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const subfolder of subfolders) {
    const subfolderPath = path.join(config.sourceDir, subfolder);
    const files = fs.readdirSync(subfolderPath).filter(file => {
      // Filter for .png files and exclude .DS_Store
      return file.endsWith('.png') && file !== '.DS_Store';
    });

    for (const filename of files) {
      entries.push({
        subfolder,
        filename,
        localPath: path.join(subfolderPath, filename),
        cloudinaryFolder: `${config.baseFolder}/${subfolder}`
      });
    }
  }

  return entries;
}

// Process a single folder
async function processFolder(config) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📁 Processing: ${config.name}`);
  console.log('='.repeat(70));

  // Scan directory for images
  let entries = scanDirectory(config);

  if (entries.length === 0) {
    console.log(`⚠️  No images found in ${config.sourceDir}`);
    return;
  }

  // Apply test mode limit if enabled
  if (TEST_MODE_LIMIT && TEST_MODE_LIMIT > 0) {
    const originalCount = entries.length;
    entries = entries.slice(0, TEST_MODE_LIMIT);
    console.log(`🧪 TEST MODE: Limiting from ${originalCount} to ${entries.length} images\n`);
  }

  const folderStats = {
    total: entries.length,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  globalStats.folders[config.name] = folderStats;
  globalStats.total += folderStats.total;

  console.log(`📊 Found ${folderStats.total} images to upload`);
  console.log(`📁 Source folder: ${config.sourceDir}`);
  console.log(`☁️  Cloudinary folder: ${config.baseFolder}\n`);

  // Load progress
  const progress = loadProgress(config.progressFile);
  const alreadyUploaded = Object.keys(progress.uploaded).length;

  if (alreadyUploaded > 0) {
    console.log(`♻️  Resuming from previous session (${alreadyUploaded} already uploaded)\n`);
  }

  // Process in batches
  console.log('Starting upload...\n');

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await processBatch(batch, progress, config, folderStats);

    // Show progress bar every batch
    console.log(`\n${createProgressBar(folderStats.uploaded + folderStats.skipped + folderStats.failed, folderStats.total)}\n`);
  }

  // Show folder summary
  console.log(`\n✅ ${config.name} complete:`);
  console.log(`   Uploaded: ${folderStats.uploaded} | Skipped: ${folderStats.skipped} | Failed: ${folderStats.failed}`);
}

// Main execution
async function main() {
  console.log('🚀 Starting Apple Fitness & TickTick Badges upload to Cloudinary...\n');

  // Verify Cloudinary credentials
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not found in .env file');
    console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Process each folder
  for (const config of FOLDERS) {
    await processFolder(config);
  }

  // Update cloudinary-urls.json
  console.log('\n\n📝 Updating cloudinary-urls.json...');

  let cloudinaryUrls = {};
  if (fs.existsSync(CLOUDINARY_URLS_FILE)) {
    cloudinaryUrls = JSON.parse(fs.readFileSync(CLOUDINARY_URLS_FILE, 'utf-8'));
  }

  // Merge new URLs from all folders
  for (const config of FOLDERS) {
    const progress = loadProgress(config.progressFile);
    Object.assign(cloudinaryUrls, progress.uploaded);
  }

  fs.writeFileSync(CLOUDINARY_URLS_FILE, JSON.stringify(cloudinaryUrls, null, 2));

  // Calculate duration
  const duration = Date.now() - globalStats.startTime;

  // Print final report
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL UPLOAD REPORT');
  console.log('='.repeat(70));
  console.log(`Total images:          ${globalStats.total}`);
  console.log(`Successfully uploaded: ${globalStats.uploaded} ✓`);
  console.log(`Skipped (existing):    ${globalStats.skipped} ⊘`);
  console.log(`Failed:                ${globalStats.failed} ✗`);
  console.log(`Duration:              ${formatDuration(duration)}`);
  if (globalStats.uploaded > 0) {
    console.log(`Average speed:         ${(globalStats.uploaded / (duration / 1000)).toFixed(2)} images/sec`);
  }

  console.log('\n📁 Breakdown by folder:');
  for (const [folderName, stats] of Object.entries(globalStats.folders)) {
    console.log(`   ${folderName}: ${stats.uploaded} uploaded, ${stats.skipped} skipped, ${stats.failed} failed`);
  }

  if (globalStats.failed > 0) {
    console.log('\n❌ Failed uploads:');
    globalStats.errors.forEach(({ path, error }, index) => {
      console.log(`  ${index + 1}. ${path}`);
      console.log(`     Error: ${error}`);
    });
  }

  console.log(`\n✅ Cloudinary URLs saved: ${CLOUDINARY_URLS_FILE}`);
  for (const config of FOLDERS) {
    console.log(`✅ Progress file saved: ${config.progressFile}`);
    console.log(`✅ Local copies created: ${config.destDir}`);
  }
  console.log('='.repeat(70));

  if (globalStats.failed === 0) {
    console.log('\n🎉 All images uploaded successfully!');
  } else {
    console.log(`\n⚠️  Upload completed with ${globalStats.failed} errors. Check the report above.`);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
