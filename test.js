/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let /** @type {Window} */ window, /** @type {Document} */ document;
let /** @type {HTMLElement} */ row1, /** @type {HTMLElement} */ row2;

function set() {
  // Set all the HTML components that will be interacted with here
  row1 = document.getElementById("row1");
  row2 = document.getElementById("row2");
}

function reset(done) {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    Object.defineProperty(window.HTMLElement.prototype, "innerText", {
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
    });
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


beforeAll(() => {
  jest.useFakeTimers();
});

describe("Carousel Row Functionality", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Initial animation state of row1 should be running", () => {
    expect(row1.style.animationPlayState).toBe("");
  });

  it("Initial animation state of row2 should be running", () => {
    expect(row2.style.animationPlayState).toBe("");
  });

  it("Row1 pauses animation on hover", () => {
    row1.dispatchEvent(new window.MouseEvent("mouseover"));
    expect(row1.style.animationPlayState).toBe("paused");
  });

  it("Row1 resumes animation on mouse out", () => {
    row1.dispatchEvent(new window.MouseEvent("mouseout"));
    expect(row1.style.animationPlayState).toBe("running");
  });

  it("Row2 pauses animation on hover", () => {
    row2.dispatchEvent(new window.MouseEvent("mouseover"));
    expect(row2.style.animationPlayState).toBe("paused");
  });

  it("Row2 resumes animation on mouse out", () => {
    row2.dispatchEvent(new window.MouseEvent("mouseout"));
    expect(row2.style.animationPlayState).toBe("running");
  });
});
