import puppeteer from 'puppeteer';
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';

// Configuration options
const defaultOptions = {
  headless: true, // Set to false for visual debugging
  timeout: 30000, // Timeout for page navigation in milliseconds
  waitUntil: 'networkidle2',
};

async function downloadPageSource(browser, url, folder, options = defaultOptions) {
  try {
    const page = await browser.newPage();
    console.log(`Navigating to: ${url}`);

    await page.goto(url, {
      waitUntil: options.waitUntil,
      timeout: options.timeout,
    });

    const pageContent = await page.content();
    const filename = url.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
    const filePath = path.join(folder, filename);

    await fs.writeFile(filePath, pageContent);
    console.log(`Saved ${url} to ${filename}`);
    return { url, filename, success: true };
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return { url, success: false, error: error.message };
  } finally {
    if (page) {
      await page.close();
    }
  }
}

async function downloadAll(urls, folder, options = defaultOptions) {
  if (!urls || urls.length === 0) {
    console.log('No URLs provided to download.');
    return [];
  }

  try {
    const browser = await puppeteer.launch({
      headless: options.headless,
      defaultViewport: null, // No default viewport
    });

    console.log('Browser launched successfully.');

    const results = await Promise.all(
      urls.map(async (url) => downloadPageSource(browser, url, folder, options))
    );

    await browser.close();
    console.log('Browser closed.');
    return results;
  } catch (error) {
    console.error('Error during download process:', error.message);
    return [];
  }
}

export { downloadAll };