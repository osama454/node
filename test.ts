// test.ts
/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const realSetTimeout = setTimeout; // Store a reference to the original setTimeout
jest.useFakeTimers(); // Overwrites the setTimeout and setInterval

let out: HTMLElement, button: HTMLElement;

function set() {
  button = document.getElementById("button")!;
  out = document.getElementById("out")!;
}

async function reset() {
  const dom = await JSDOM.fromFile("index.html", {
    resources: "usable",
    runScripts: "dangerously",
  });
  await new Promise((resolve) => realSetTimeout(resolve, 100)); // Wait until the document loads
  window = dom.window;
  document = window.document;
  set();
}

afterAll(() => {
  if (window) {
    window.close();
  }
});

describe("Group 1", () => {
  beforeAll(async () => {
    await reset();
  });

  it("Test 1", () => {
    button.click();
    console.log(out.innerHTML);
    expect(out.innerHTML).toBe("1");
  });

  it("Test 2", () => {
    jest.advanceTimersByTime(100); // Advance timers
    expect(out.innerHTML).toBe("101"); // The out increases by one each 1ms and another 1 by the previous button click
  });
});

describe("Group 2", () => {
  beforeAll(async () => {
    await reset();
  });

  it("Test 1", () => {
    expect(out.innerHTML).toBe("0");
  });
});
