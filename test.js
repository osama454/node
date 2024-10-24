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
    if (document.readyState !== "loading") {
      done();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
    }
  });
});

describe("Company Findings Webpage", () => {
  beforeEach(() => {
    // Reset the data container before each test
    document.getElementById("dataContainer").innerHTML = "";
  });

  test("should toggle Data 1 display when clicking the Data 1 button", () => {
    const data1Button = document.getElementById("data1Button");
    const dataContainer = document.getElementById("dataContainer");

    // Trigger click event
    data1Button.click();

    // Check if data1 content is rendered
    expect(dataContainer.innerHTML).not.toBe("");
    expect(dataContainer.querySelector("table")).not.toBeNull();
  });

  test("should toggle Data 2 display when clicking the Data 2 button", () => {
    const data2Button = document.getElementById("data2Button");
    const dataContainer = document.getElementById("dataContainer");

    // Trigger click event
    data2Button.click();

    // Check if data2 content is rendered
    expect(dataContainer.innerHTML).not.toBe("");
    expect(dataContainer.querySelector("table")).not.toBeNull();
  });

  test("should toggle Data 3 display when clicking the Data 3 button", () => {
    const data3Button = document.getElementById("data3Button");
    const dataContainer = document.getElementById("dataContainer");

    // Trigger click event
    data3Button.click();

    // Check if data3 content is rendered
    expect(dataContainer.innerHTML).not.toBe("");
    expect(dataContainer.querySelector("table")).not.toBeNull();
  });

  test("should switch layout from horizontal to vertical", () => {
    const layoutButton = document.getElementById("layoutButton");
    const dataContainer = document.getElementById("dataContainer");

    // Set initial state
    dataContainer.style.flexDirection = "row";

    // Trigger click event
    layoutButton.click();

    // Check if layout is changed to column (vertical)
    expect(dataContainer.style.flexDirection).toBe("column");

    // Trigger click event again to switch back
    layoutButton.click();

    // Check if layout is changed back to row (horizontal)
    expect(dataContainer.style.flexDirection).toBe("row");
  });

  test("should toggle plot visibility when clicking the plots button", () => {
    const plotsButton = document.getElementById("plotsButton");
    const data1Button = document.getElementById("data1Button");
    const dataContainer = document.getElementById("dataContainer");

    // Trigger data1Button to show data1
    data1Button.click();

    // Ensure plot is visible
    expect(dataContainer.querySelector("canvas")).not.toBeNull();

    // Trigger click event to hide plots
    plotsButton.click();

    // Ensure plot is hidden
    expect(dataContainer.querySelector("canvas")).toBeNull();

    // Trigger click event again to show plots
    plotsButton.click();

    // Ensure plot is visible again
    expect(dataContainer.querySelector("canvas")).not.toBeNull();
  });
});
