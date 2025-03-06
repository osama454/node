/// <reference types="jest" />

const { JSDOM } = require("jsdom");

let /** @type {Window} */ window, /** @type {Document} */ document;
/** @type {HTMLElement} */
let /** @type {HTMLElement} */ button, /** @type {HTMLElement} */ out;

function set() {
  button = document.getElementById("button");
  out = document.getElementById("out");
}
function reset(done) {
  JSDOM.fromFile("index.html", {
    resources: "usable",
    runScripts: "dangerously",
  }).then((dom) => {
    window = dom.window;
    document = window.document;

    if (document.readyState != "loading") {
      set();
      done();
    } else
      document.addEventListener("DOMContentLoaded", () => {
        set();
        done();
      });
  });
}

describe("Group 1", () => {
  beforeAll((done) => {
    reset(done);
  });
  it("Test 1", () => {
    console.log(out.innerHTML);
    expect(out.innerHTML).toBe("0");
  });

  it("Test 2", () => {
    button.click();
    expect(out.innerHTML).toBe("1");
  });
});

describe("Group 2", () => {
  beforeAll((done) => {
    reset(done);
  });
  it("Test 1", () => {
    window.incr()
    expect(out.innerHTML).toBe("1");
  });
});
