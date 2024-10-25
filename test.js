const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// jest.mock('d3', () => ({
//     select: jest.fn().mockReturnThis(),
//     attr: jest.fn().mockReturnThis(),
//     forceSimulation: jest.fn(() => ({
//         force: jest.fn().mockReturnThis(),
//         nodes: jest.fn().mockReturnThis(),
//         on: jest.fn().mockReturnThis(),
//         restart: jest.fn().mockReturnThis(),
//         stop: jest.fn(),
//         alpha: jest.fn().mockReturnThis()
//     })),
//     forceLink: jest.fn().mockReturnThis(),
//     forceManyBody: jest.fn().mockReturnThis(),
//     forceCenter: jest.fn().mockReturnThis()
// }));

describe("Person’s Network Visualization", () => {
  let window,
    document,
    addPersonButton,
    addPersonInput,
    addRelationButton,
    sourcePersonSelect,
    targetPersonSelect;

  beforeAll((done) => {
    const htmlContent = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf8"
    );
    const dom = new JSDOM(htmlContent, {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse(window) {
        window.alert = (msg) => console.log(msg);
      },
    });

    window = dom.window;
    document = window.document;

    window.onload = () => {
      addPersonButton = document.getElementById("add-person");
      addPersonInput = document.getElementById("new-person");
      addRelationButton = document.getElementById("add-relation");
      sourcePersonSelect = document.getElementById("source-person");
      targetPersonSelect = document.getElementById("target-person");
      done();
    };
  });

  it("should add a new person correctly", () => {
    addPersonInput.value = "Eve";
    addPersonButton.click();
    expect(document.querySelectorAll("option").length).toBe(10); // Assuming initial 4 + new one
    expect(document.querySelectorAll("circle").length).toBe(5);
  });

  it("should not add a person if input is empty", () => {
    addPersonInput.value = "";
    addPersonButton.click();
    expect(document.querySelectorAll("option").length).toBe(10); // No change
  });

  it("should not add a person with duplicate name", () => {
    addPersonInput.value = "Eve";
    addPersonButton.click();
    expect(document.querySelectorAll("option").length).toBe(12); // No change since 'Eve' already added
  });

  it("should add a relation correctly", () => {
    sourcePersonSelect.value = "Alice";
    targetPersonSelect.value = "Eve";
    addRelationButton.click();
    expect(document.querySelectorAll("line").length).toBe(5); // Assuming initial 4 + new one
  });

  it("should not add a relation if source and target are the same", () => {
    sourcePersonSelect.value = "Eve";
    targetPersonSelect.value = "Eve";
    addRelationButton.click();
    expect(document.querySelectorAll("line").length).toBe(5); // No new line added
  });

  it("should not add a duplicate relation", () => {
    sourcePersonSelect.value = "Alice";
    targetPersonSelect.value = "Eve";
    addRelationButton.click();
    expect(document.querySelectorAll("line").length).toBe(6); // No new line added
  });

  it("should alert when adding a duplicate relation", () => {
    window.alert = jest.fn();
    sourcePersonSelect.value = "Alice";
    targetPersonSelect.value = "Eve";
    addRelationButton.click();
    expect(window.alert).toHaveBeenCalledWith("This relation already exists.");
  });

  it("should handle adding a relation with non-existent persons", () => {
    sourcePersonSelect.value = "NonExistent1";
    targetPersonSelect.value = "NonExistent2";
    addRelationButton.click();
    expect(document.querySelectorAll("line").length).toBe(7); // Still no new line added
  });

});
