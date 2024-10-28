const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document, modal, dropdown;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    if (document.readyState !== "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
    modal = document.getElementById('modal');
    dropdown = document.getElementById('directionDropdown');
  });
});

describe("Modal Repositioning", () => {
  beforeEach(() => {
    // Reset modal position to center for each test
    modal.style.top = '50%';
    modal.style.left = '50%';
    dropdown.value = ''; // Ensure dropdown is reset
  });

  test("initial position of modal is centered", () => {
    expect(modal.style.top).toBe("50%");
    expect(modal.style.left).toBe("50%");
    expect(modal.style.transform).toBe("translate(-50%, -50%)");
  });

  test("moves modal up within boundaries", () => {
    dropdown.value = "up";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.top)).toBe(40); // Should decrease by 10%
  });

  test("moves modal down within boundaries", () => {
    dropdown.value = "down";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.top)).toBe(60); // Should increase by 10%
  });

  test("moves modal left within boundaries", () => {
    dropdown.value = "left";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.left)).toBe(40); // Should decrease by 10%
  });

  test("moves modal right within boundaries", () => {
    dropdown.value = "right";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.left)).toBe(60); // Should increase by 10%
  });

  test("does not move modal up beyond top boundary", () => {
    modal.style.top = "5%";
    dropdown.value = "up";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.top)).toBe(0); // Should not go below 0%
  });

  test("does not move modal down beyond bottom boundary", () => {
    modal.style.top = "95%";
    dropdown.value = "down";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.top)).toBe(100); // Should not exceed 100%
  });

  test("does not move modal left beyond left boundary", () => {
    modal.style.left = "5%";
    dropdown.value = "left";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.left)).toBe(0); // Should not go below 0%
  });

  test("does not move modal right beyond right boundary", () => {
    modal.style.left = "95%";
    dropdown.value = "right";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(parseFloat(modal.style.left)).toBe(100); // Should not exceed 100%
  });

  test("resets dropdown value after movement", () => {
    dropdown.value = "down";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(dropdown.value).toBe("");
  });

  test("does not move modal if no direction is selected", () => {
    const initialTop = modal.style.top;
    const initialLeft = modal.style.left;
    dropdown.value = "";
    dropdown.dispatchEvent(new window.Event("change"));
    expect(modal.style.top).toBe(initialTop);
    expect(modal.style.left).toBe(initialLeft);
  });
});
