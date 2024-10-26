/// <reference types="jest" />

const puppeteer = require("puppeteer");

let browser;
let page;
let ev;


let /** @type {HTMLElement} */button, /** @type {HTMLElement} */out;

async function reset() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto("file:///D:/work/node/index.html");
  ev = page.evaluate.bind(page);
  await ev(() => {
    button = document.getElementById("button");
    out = document.getElementById("out");
    // Mock variables that needs to be accessed on the unit test here. e.g. `window.variable = init_state;`
  });
}

describe("Group 1", () => {
  beforeAll(async () => {
    await reset();
  });

  it("should get the inner text of #out element", async () => {
    const text = await ev(() => out.innerText);
    expect(text).toBe("0");
  });
  it("", async () => {
    await ev(() => button.click());
    const text = await ev(() => out.innerText);
    expect(text).toBe("1");
  });
});

describe("Group 1", () => {
  beforeAll(async () => {
    await reset();
  });

  it("should get the inner text of #out element", async () => {
    const text = await ev(() => out.innerText);
    expect(text).toBe("0");
  });
});
