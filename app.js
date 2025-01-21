import { downloadAll } from './puppeteer-downloader.js'; // Adjust the path
import fs from 'fs/promises';

async function main() {
  const urlsToDownload = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.wikipedia.org',
  ];
  const outputFolder = './downloads';

  // Create the output folder if it doesn't exist
  try {
    await fs.mkdir(outputFolder, { recursive: true });
  } catch (error) {
    console.error('Error creating output folder:', error.message);
    return;
  }

  const results = await downloadAll(urlsToDownload, outputFolder, {
    headless: false, // Set to false to see the browser
    timeout: 60000, // Increase timeout
  });

  console.log('Download results:', results);
  results.forEach((result) => {
    if (!result.success) {
      console.error(`Failed to download ${result.url}: ${result.error}`);
    }
  });
}

main();