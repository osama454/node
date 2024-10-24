const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    document.addEventListener("DOMContentLoaded", () => {
      done();
    });
  });
});

describe("DOM Testing", () => {
  it("should have the correct title", () => {
    expect(document.title).toBe("Test Page");
  });

  it("should have a heading with the correct text content", () => {
    const heading = document.getElementById("title");
    expect(heading.textContent).toBe("Hello World!");
  });

  it("should update the output when the button is clicked", () => {
    const button = document.getElementById("clickMe");
    const output = document.getElementById("output");
    button.click();
    expect(output.textContent).toBe("Button Clicked!");
  });
});
