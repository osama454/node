/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};
let /** @type {Window} */ window, /** @type {Document} */ document;

// Define the HTML components that will be interacted with here
let /** @type {HTMLElement} */ barChart, bars;

function set() {
  // Set all the HTML components that will be interacted with here
  barChart = document.querySelector(".bar-chart");
  bars = document.querySelectorAll(".bar");
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
  jest.useFakeTimers(); // Use fake timers for timing events
});

describe("Interactive Bar Plot - Initial Render", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should render the bar chart container", () => {
    expect(barChart).not.toBeNull();
  });

  it("should render four bars within the bar chart", () => {
    expect(bars.length).toBe(4);
  });

  const barHeights = ["50%", "80%", "30%", "90%"];
  barHeights.forEach((height, index) => {
    it(`should render bar ${index + 1} with a height of ${height}`, () => {
      expect(window.getComputedStyle(bars[index]).height).toBe(height);
    });
  });
});

describe("Interactive Bar Plot - Hover Effects", () => {
  let bar, barStyle;
  beforeAll((done) => {
    reset(done);
  });
  for (let index = 0; index < 4; index++) {
    it(`should display data-value attribute when bar ${
      index + 1
    } is hovered`, () => {
      bar = bars[index];
      barStyle = window.getComputedStyle(bar);
      bar.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
      const dataValue = bar.getAttribute("data-value");
      expect(bar.getAttribute("data-value")).toBe(`${dataValue}`);
    });

    it(`should change background color of bar ${index + 1} on hover`, () => {
      bar.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
      expect(barStyle.background).toBe("rgb(41, 128, 185)"); // Check hover color
    });

    it(`should revert background color of bar ${index + 1} on mouseout`, () => {
      bar.dispatchEvent(new window.MouseEvent("mouseout", { bubbles: true }));
      expect(barStyle.background).toBe("rgb(41, 128, 185)"); // Original color
    });
  }
});
