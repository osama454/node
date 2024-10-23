import puppeteer from 'puppeteer';

describe('HTML Page Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should change the text of the h1 element when the button is clicked', async () => {
    // Load the HTML file (replace with the correct path to your file)
    await page.goto('file:///D:/work/node/index.html');

    // Check initial text
    const initialText = await page.$eval('#title', el => el.textContent);
    expect(initialText).toBe('Hello, World!');

    // Click the button to change the text
    await page.click('#changeTextButton');

    // Check that the text has changed
    const changedText = await page.$eval('#title', el => el.textContent);
    expect(changedText).toBe('Text Changed!');
  });
});
