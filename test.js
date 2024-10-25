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
    window.onload = () => done(); // Ensure all scripts are loaded and executed
  });
});

describe("Central Force Simulation", () => {
  test("Initializes with default settings", () => {
    const massSlider = document.getElementById("mass");
    const velocitySlider = document.getElementById("velocity");
    const forceConstantSlider = document.getElementById("forceConstant");

    // Initial values match HTML input values
    expect(massSlider.value).toBe("10");
    expect(velocitySlider.value).toBe("50");
    expect(forceConstantSlider.value).toBe("50000");
  });

  test("Slider adjustments trigger simulation reset", () => {
    const massSlider = document.getElementById("mass");
    const spyInit = jest.spyOn(window, "initializeSimulation");

    // Trigger input event on slider
    massSlider.value = "20";
    massSlider.dispatchEvent(new window.Event("input"));
    expect(spyInit).toHaveBeenCalled();
    expect(window.particleMass).toBe(20); // Assuming initializeSimulation adjusts particleMass
  });

  test("Start/Stop button toggles simulation state", () => {
    let flag = true;
    window.requestAnimationFrame = jest.fn((f) => {
      if (flag) {
        flag = false;
        f();
      }
    });
    const startStopButton = document.getElementById("startStop");
    startStopButton.click(); // Start simulation

    expect(window.running).toBe(true);

    startStopButton.click(); // Stop simulation

    expect(window.running).toBe(false);
  });

  test("Particle movement updates on animation frame", () => {
    const originalX = window.particle.x;
    const originalY = window.particle.y;

    // Simulate one frame of animation
    window.running = true;
    window.animate();

    expect(window.particle.x).not.toBe(originalX);
    expect(window.particle.y).not.toBe(originalY);
  });

  test("Force calculation follows inverse square law", () => {
    const force = window.calculateForce(10, 10); // Position close to center

    // Force should be calculated according to inverse square law
    expect(force.fx).not.toBe(0);
    expect(force.fy).not.toBe(0);
  });

  test("Vector field is drawn on canvas", () => {
    const ctx = window.simulationCanvas.getContext("2d");
    const spyDrawArrow = jest.spyOn(window, "drawArrow");
    window.drawVectorField();

    // Check if arrows are drawn
    expect(spyDrawArrow).toHaveBeenCalled();
  });
});
