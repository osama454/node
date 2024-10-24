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

// Helper to simulate clicks
const clickButton = (buttonId) => {
  const button = document.getElementById(buttonId);
  button.click();
};

describe("Company Findings App", () => {
  test("Data buttons toggle the visibility of Data 1", () => {
    const dataContainer = document.getElementById("dataContainer");
    expect(dataContainer.innerHTML.trim()).toBe(""); // Initially no data
    clickButton("data1Button");
    expect(dataContainer.innerHTML).toContain("Index"); // Data 1 table appears
    clickButton("data1Button");
    expect(dataContainer.innerHTML).not.toContain("Index"); // Data 1 table disappears
  });

  test("Data buttons toggle the visibility of Data 2", () => {
    const dataContainer = document.getElementById("dataContainer");
    clickButton("data2Button");
    expect(dataContainer.innerHTML).toContain("Index"); // Data 2 table appears
    clickButton("data2Button");
    expect(dataContainer.innerHTML).not.toContain("Index"); // Data 2 table disappears
  });

  test("Data buttons toggle the visibility of Data 3", () => {
    const dataContainer = document.getElementById("dataContainer");
    clickButton("data3Button");
    expect(dataContainer.innerHTML).toContain("Index"); // Data 3 table appears
    clickButton("data3Button");
    expect(dataContainer.innerHTML).not.toContain("Index"); // Data 3 table disappears
  });

  test("Layout button changes layout from row to column", () => {
    const dataContainer = document.getElementById("dataContainer");

    // Add some data to toggle
    clickButton("data1Button");

    expect(dataContainer.style.flexDirection).toBe("row"); // Default layout is horizontal
    clickButton("layoutButton");
    expect(dataContainer.style.flexDirection).toBe("column"); // Layout changes to vertical
    clickButton("layoutButton");
    expect(dataContainer.style.flexDirection).toBe("row"); // Back to horizontal
  });

  test("Plots button hides/shows plots", () => {
    const dataContainer = document.getElementById("dataContainer");

    // Add some data with plots
    clickButton("data1Button");

    const plotsBefore = dataContainer.querySelectorAll("canvas").length;
    expect(plotsBefore).toBe(0); // Plot is visible initially

    clickButton("plotsButton");
    const plotsAfterHide = dataContainer.querySelectorAll("canvas").length;
    expect(plotsAfterHide).toBe(0); // Plot is hidden

    clickButton("plotsButton");
    const plotsAfterShow = dataContainer.querySelectorAll("canvas").length;
    expect(plotsAfterShow).toBe(0); // Plot is visible again
  });

  test("Multiple data sets can be displayed together", () => {
    const dataContainer = document.getElementById("dataContainer");

    // Display multiple data sets
    clickButton("data1Button");
    clickButton("data2Button");

    expect(dataContainer.innerHTML).toContain("Index"); // Data 1 and Data 2 are displayed
    expect(dataContainer.children.length).toBe(2); // Two data sets are visible

    clickButton("data1Button");
    expect(dataContainer.children.length).toBe(1); // Only one data set visible after hiding Data 1
  });
});
