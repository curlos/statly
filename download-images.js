import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrls = [
    "https://projects.peterwunder.de/achievements/new_year_2026/images/NEW_YEAR_2026.png",
    "https://projects.peterwunder.de/achievements/meditation_day_2025/images/MEDITATION_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2025/images/VETERANS_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/mindful_month_2025/images/MINDFUL_MONTH_2025.png",
    "https://projects.peterwunder.de/achievements/national_parks_2025/images/NATIONAL_PARKS_2025.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2025/images/CHINA_FITNESS_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/running_day_2025/images/RUNNING_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/close_your_rings_day_2025/images/CLOSE_YOUR_RINGS_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/earth_day_2025/images/EARTH_DAY_2025.png",
    "https://projects.peterwunder.de/achievements/heart_month_2025/images/HEART_MONTH_2025.png",
    "https://projects.peterwunder.de/achievements/new_year_2025/images/NEW_YEAR_2025.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2024/images/VETERANS_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/mindful_month_2024/images/MINDFUL_MONTH_2024.png",
    "https://projects.peterwunder.de/achievements/national_parks_2024/images/NATIONAL_PARKS_2024.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2024/images/CHINA_FITNESS_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2024/images/YOGA_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/running_day_2024/images/RUNNING_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/meditation_day_2024/images/MEDITATION_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/dance_day_2024/images/DANCE_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/earth_day_2024/images/EARTH_DAY_2024.png",
    "https://projects.peterwunder.de/achievements/heart_month_2024/images/HEART_MONTH_2024.png",
    "https://projects.peterwunder.de/achievements/new_year_2024/images/NEW_YEAR_2024.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2023/images/VETERANS_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/national_parks_2023/images/NATIONAL_PARKS_2023.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2023/images/CHINA_FITNESS_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2023/images/YOGA_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/dance_day_2023/images/DANCE_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/earth_day_2023/images/EARTH_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/womens_day_2023/images/WOMENS_DAY_2023.png",
    "https://projects.peterwunder.de/achievements/heart_month_2023/images/HEART_MONTH_2023.png",
    "https://projects.peterwunder.de/achievements/unity_month_2023/images/UNITY_MONTH_2023.png",
    "https://projects.peterwunder.de/achievements/lunar_new_year_2023/images/LUNAR_NEW_YEAR_2023.png",
    "https://projects.peterwunder.de/achievements/new_year_2023/images/NEW_YEAR_2023.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2022/images/VETERANS_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/national_parks_2022/images/NATIONAL_PARKS_2022.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2022/images/CHINA_FITNESS_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2022/images/YOGA_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/dance_day_2022/images/DANCE_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/earth_day_2022/images/EARTH_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/womens_day_2022/images/WOMENS_DAY_2022.png",
    "https://projects.peterwunder.de/achievements/heart_month_2022/images/HEART_MONTH_2022.png",
    "https://projects.peterwunder.de/achievements/lunar_new_year_2022/images/LUNAR_NEW_YEAR_2022.png",
    "https://projects.peterwunder.de/achievements/unity_month_2022/images/UNITY_MONTH_2022.png",
    "https://projects.peterwunder.de/achievements/new_year_2022/images/NEW_YEAR_2022.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2021/images/VETERANS_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/national_parks_2021/images/NATIONAL_PARKS_2021.png",
    "https://projects.peterwunder.de/achievements/russia_fitness_day_2021/images/RUSSIA_FITNESS_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2021/images/CHINA_FITNESS_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2021/images/YOGA_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/dance_day_2021/images/DANCE_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/earth_day_2021/images/EARTH_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/womens_day_2021/images/WOMENS_DAY_2021.png",
    "https://projects.peterwunder.de/achievements/heart_month_2021/images/HEART_MONTH_2021.png",
    "https://projects.peterwunder.de/achievements/unity_month_2021/images/UNITY_MONTH_2021.png",
    "https://projects.peterwunder.de/achievements/new_year_2021/images/NEW_YEAR_2021.png",
    "https://projects.peterwunder.de/achievements/turkey_trot_2020/images/TURKEY_TROT_2020.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2020/images/VETERANS_DAY_2020.png",
    "https://projects.peterwunder.de/achievements/national_parks_2020/images/NATIONAL_PARKS_2020.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2020/images/CHINA_FITNESS_DAY_2020.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2020/images/YOGA_DAY_2020.png",
    "https://projects.peterwunder.de/achievements/environment_day_2020/images/ENVIRONMENT_DAY_2020.png",
    "https://projects.peterwunder.de/achievements/womens_day_2020/images/WOMENS_DAY_2020.png",
    "https://projects.peterwunder.de/achievements/heart_month_2020/images/HEART_MONTH_2020.png",
    "https://projects.peterwunder.de/achievements/new_year_2020/images/NEW_YEAR_2020.png",
    "https://projects.peterwunder.de/achievements/turkey_trot_2019/images/TURKEY_TROT_2019.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2019/images/VETERANS_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/japan_health_day_2019/images/JAPAN_HEALTH_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/national_parks_2019/images/NATIONAL_PARKS_2019.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2019/images/CHINA_FITNESS_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/yoga_day_2019/images/YOGA_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/earth_day_2019/images/EARTH_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/womens_day_2019/images/WOMENS_DAY_2019.png",
    "https://projects.peterwunder.de/achievements/heart_month_2019/images/HEART_MONTH_2019.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2018/images/VETERANS_DAY_2018.png",
    "https://projects.peterwunder.de/achievements/national_parks_2018/images/NATIONAL_PARKS_2018.png",
    "https://projects.peterwunder.de/achievements/china_fitness_day_2018/images/CHINA_FITNESS_DAY_2018.png",
    "https://projects.peterwunder.de/achievements/earth_day_2018/images/EARTH_DAY_2018.png",
    "https://projects.peterwunder.de/achievements/womens_day_2018/images/WOMENS_DAY_2018.png",
    "https://projects.peterwunder.de/achievements/heart_month_2018/images/HEART_MONTH_2018.png",
    "https://projects.peterwunder.de/achievements/new_year_2018/images/NEW_YEAR_2018.png",
    "https://projects.peterwunder.de/achievements/turkey_trot_2017/images/TURKEY_TROT_2017.png",
    "https://projects.peterwunder.de/achievements/veterans_day_2017/images/VETERANS_DAY_2017.png",
    "https://projects.peterwunder.de/achievements/national_parks_2017/images/NATIONAL_PARKS_2017.png",
    "https://projects.peterwunder.de/achievements/mothers_day_us_2017/images/MOTHERS_DAY_US_2017.png",
    "https://projects.peterwunder.de/achievements/earth_day_2017/images/EARTH_DAY_2017.png",
    "https://projects.peterwunder.de/achievements/new_year_2017/images/NEW_YEAR_2017.png",
    "https://projects.peterwunder.de/achievements/turkey_trot/images/TURKEY_TROT.png"
];

// Create directory structure
const outputDir = path.join(__dirname, 'public', 'apple-fitness', 'limited-edition-challenges');
fs.mkdirSync(outputDir, { recursive: true });

// Function to download a single image
function downloadImage(url, index) {
    return new Promise((resolve, reject) => {
        const filename = path.basename(url);
        // Add index prefix to maintain order (001_, 002_, etc.)
        const prefixedFilename = `${String(index + 1).padStart(3, '0')}_${filename}`;
        const filepath = path.join(outputDir, prefixedFilename);

        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✓ Downloaded [${index + 1}/${imageUrls.length}]: ${prefixedFilename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete incomplete file
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete incomplete file
            reject(err);
        });
    });
}

// Download all images sequentially
async function downloadAllImages() {
    console.log(`Starting download of ${imageUrls.length} images...\n`);

    for (let i = 0; i < imageUrls.length; i++) {
        try {
            await downloadImage(imageUrls[i], i);
        } catch (error) {
            console.error(`✗ Error downloading image ${i + 1}:`, error.message);
        }
    }

    console.log(`\n✓ Download complete! Images saved to: ${outputDir}`);
}

downloadAllImages();
