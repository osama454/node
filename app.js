import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadPageSource(url, folder) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const pageContent = await page.content();

    const filename = url.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".html";
    const filePath = path.join(folder, filename);
    fs.writeFileSync(filePath, pageContent);

    console.log(`Saved ${url} to ${filename}`);
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function downloadAll(urls, folder) {
  for (const url of urls) {
    await downloadPageSource(url, folder);
    await delay(1000); // Rate limiting
  }
}

const urlsToDownload = [
  "https://www.example.com",
  "https://www.google.com",
  "https://www.wikipedia.org",
];
const outputFolder = "./downloads";

downloadAll(urlsToDownload, outputFolder);
