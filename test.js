/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};
let /** @type {Window} */ window, /** @type {Document} */ document;

// Define HTML components that will be interacted with
let /** @type {HTMLElement} */ road, /** @type {HTMLElement} */ car;
let getComputedStyle;

function set() {
  // Set all the HTML components to be interacted with here
  road = document.querySelector(".road");
  car = document.querySelector(".car");
  getComputedStyle = window.getComputedStyle;
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

describe("Animation Initialization", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Road should be a 400x100 black rectangle", () => {
    expect(getComputedStyle(road).width).toBe("400px");
    expect(getComputedStyle(road).height).toBe("100px");
    expect(getComputedStyle(road).backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("Car should be a 20x20 red square centered on the road", () => {
    expect(getComputedStyle(car).width).toBe("20px");
    expect(getComputedStyle(car).height).toBe("20px");
    expect(getComputedStyle(car).backgroundColor).toBe("rgb(255, 0, 0)");
    expect(getComputedStyle(car).position).toBe("absolute");
    expect(getComputedStyle(car).top).toBe("50%");
    expect(getComputedStyle(car).left).toBe("50%");
  });
});

describe("Animation Behavior", () => {
  beforeAll((done) => {
    reset(done);
  });


  it("Car should stay centered during animation", () => {
    expect(getComputedStyle(car).transform).toContain("translate(-50%, -50%)");
  });
});
