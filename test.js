const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window,
  document,
  lightboardEl,
  rowsInput,
  colsInput,
  createButton,
  createLightboard,
  toggleLight;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    global.document = document;

    lightboardEl = document.getElementById("lightboard");
    rowsInput = document.getElementById("rows");
    colsInput = document.getElementById("cols");
    createButton = document.getElementById("create");

    // Assuming that the script exposes functions to the global scope
    createLightboard = window.createLightboard;
    toggleLight = window.toggleLight;

    done();
  });
});

test("Create lightboard with correct number of lights", () => {
  const rows = 5;
  const cols = 5;
  createLightboard(rows, cols);
  expect(lightboardEl.children.length).toBe(rows * cols); // 5x5 = 25 lights
});

test("Light state changes on toggle", () => {
  createLightboard(3, 3);

  const initialLightState = lightboardEl.children[0].classList.contains("on"); // Get initial visual state
  toggleLight(0, 0); // Toggle the first light

  expect(lightboardEl.children[0].classList.contains("on")).not.toBe(
    initialLightState
  ); // Visual state should toggle
});

test("Toggling a light affects its visual state", () => {
  createLightboard(3, 3);

  const lightEl = lightboardEl.children[0]; // First light in the grid
  const initialClassList = lightEl.classList.contains("on");

  toggleLight(0, 0); // Toggle the first light

  expect(lightEl.classList.contains("on")).not.toBe(initialClassList); // Class "on" should toggle
});

test("Grid resets when the 'Create' button is clicked", () => {
  createLightboard(5, 5); // Initially create a 5x5 grid
  rowsInput.value = 3;
  colsInput.value = 3;

  createButton.click(); // Simulate clicking the "Create" button

  expect(lightboardEl.children.length).toBe(9); // Grid should be 3x3 = 9 lights
});

test("Light does not toggle when burnt out", () => {
  createLightboard(3, 3);
  const lightEl = lightboardEl.children[0]; // First light in the grid
  lightEl.classList.add("burnt"); // Simulate a burnt out light

  const wasOn = lightEl.classList.contains("on");
  toggleLight(0, 0); // Attempt to toggle a burnt light

  expect(lightEl.classList.contains("on")).toBe(!wasOn);
});

test("Create button sets grid dimensions correctly", () => {
  rowsInput.value = 10;
  colsInput.value = 10;
  createButton.click(); // Simulate clicking the "Create" button

  expect(lightboardEl.style.gridTemplateColumns).toBe(`repeat(10, 25px)`); // Grid columns should be set to 10
});
