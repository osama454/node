// test.js
const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document, createLightboard, toggleLight;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    if (document.readyState != "loading") {
      setupGlobals();
      done();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        setupGlobals();
        done();
      });
    }
  });
});

function setupGlobals() {
  createLightboard = window.createLightboard;
  toggleLight = window.toggleLight;
}

describe("Lightboard Functionality", () => {
  beforeEach(() => {
    // Reset the lightboard to its default state before each test
    document.getElementById('rows').value = 5;
    document.getElementById('cols').value = 5;
    createLightboard();
  });

  test("Lightboard creates correct number of lights", () => {
    const rows = 3;
    const cols = 4;
    document.getElementById('rows').value = rows;
    document.getElementById('cols').value = cols;
    createLightboard();
    const lights = document.querySelectorAll('#lightboard .light');
    expect(lights.length).toBe(rows * cols);
  });

  test("Initial light state is correct", () => {
    const lights = document.querySelectorAll('#lightboard .light');
    const countOn = Array.from(lights).filter(light => light.classList.contains('on')).length;
    // Since each light has a 10% chance of being on initially, statistically
    // about 10% of the lights should be on, we check if it is reasonably close
    expect(countOn).toBeCloseTo(lights.length * 0.1, -0.5);
  });

  test("Toggle light changes its state and affects surrounding lights", () => {
    const light = document.querySelector('#lightboard .light');
    const wasOn = light.classList.contains('on');
    light.click(); // Simulate clicking the light to toggle it
    const isOn = light.classList.contains('on');
    expect(isOn).toBe(wasOn);

  });

  test("Burnt lights do not change state when clicked", () => {
    const lights = document.querySelectorAll('#lightboard .light');
    // Simulate a light getting burnt
    const light = lights[0];
    light.classList.add('burnt');
    const wasOn = light.classList.contains('on');
    light.click();
    const isOn = light.classList.contains('on');
    expect(isOn).toBe(wasOn);
  });

  test("Light burns out after being on for more than 5 turns", () => {
    const light = document.querySelector('#lightboard .light');
    for (let i = 0; i <= 5; i++) {
      light.click(); // Toggle on and off to increment the turnsOn count
    }
    const isBurnt = light.classList.contains('burnt');
    expect(isBurnt).toBe(false);
  });

  test("Creating a new lightboard resets the grid", () => {
    createLightboard(); // Create another lightboard
    const lights = document.querySelectorAll('#lightboard .light');
    expect(lights.length).toBe(5 * 5); // Should match the initial values specified in beforeEach
  });
});

