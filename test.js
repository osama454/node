/// <reference types="jest" />

const puppeteer = require("puppeteer");

let browser;
let page;
let ev;

let dialogMessage = ""
// Define the HTML components that will be interacted with here
let /** @type {HTMLElement} */ button, /** @type {HTMLElement} */ out;

async function reset() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto("file:///D:/work/node/index.html");
  ev = page.evaluate.bind(page);
  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await ev(() => {
    // Get all the HTML components that will be interacted with here
    button = document.getElementById("button");
    out = document.getElementById("out");
  });
}

describe("Group 1", () => {
  beforeAll(async () => {
    await reset();
  });

  it("Init", async () => {
    const text = await ev(() => out.innerText);
    expect(text).toBe("0");
  });

  for (let i = 1; i < 3; i++)
    it(`${i}`, async () => {
      await ev(() => button.click());
      const text = await ev(() => out.innerText);
      expect(text).toBe(`${i}`);
    });
  it("Alert", async () => {
    expect(dialogMessage).toBe("2")
  })
});

describe("Group 2", () => {
  beforeAll(async () => {
    await reset();
  });

  it("Init", async () => {
    const text = await ev(() => out.innerText);
    expect(text).toBe("0");
  });
});