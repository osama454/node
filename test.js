const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document, modal, select, offsetX, offsetY;
let isDragging = false;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    modal = document.getElementById("my-modal");
    select = document.getElementById("direction-select");
    offsetX = 0;
    offsetY = 0;
    if (document.readyState != "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
  });
});

describe("Repositionable Modal", () => {
  beforeEach(() => {
    // Reset modal position before each test
    modal.style.left = "0px";
    modal.style.top = "0px";
    isDragging = false;
  });

  test("Modal should be draggable and stay within bounds", () => {
    // Simulate mousedown to start dragging
    modal.dispatchEvent(
      new window.MouseEvent("mousedown", {
        clientX: 100,
        clientY: 100,
      })
    );
    offsetX = 50;
    offsetY = 50;
    isDragging = true;

    // Simulate mousemove to drag modal
    document.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: 200,
        clientY: 200,
      })
    );

    // Verify new modal position within bounds
    expect(parseInt(modal.style.left)).toBeGreaterThanOrEqual(0);
    expect(parseInt(modal.style.top)).toBeGreaterThanOrEqual(0);

    // Simulate mouseup to stop dragging
    document.dispatchEvent(new window.MouseEvent("mouseup"));
    isDragging = false;
  });

  test("Modal movement for 'up' direction should not exceed screen bounds", () => {
    select.value = "up";
    select.dispatchEvent(new window.Event("change"));
    expect(parseInt(modal.style.top)).toBeGreaterThanOrEqual(0);
  });

  test("Modal movement for 'down' direction should not exceed screen bounds", () => {
    modal.style.top = `${window.innerHeight - modal.offsetHeight}px`;
    select.value = "down";
    select.dispatchEvent(new window.Event("change"));
    expect(parseInt(modal.style.top)).toBeLessThanOrEqual(
      window.innerHeight - modal.offsetHeight
    );
  });

  test("Modal movement for 'left' direction should not exceed screen bounds", () => {
    select.value = "left";
    select.dispatchEvent(new window.Event("change"));
    expect(parseInt(modal.style.left)).toBeGreaterThanOrEqual(0);
  });

  test("Modal movement for 'right' direction should not exceed screen bounds", () => {
    modal.style.left = `${window.innerWidth - modal.offsetWidth}px`;
    select.value = "right";
    select.dispatchEvent(new window.Event("change"));
    expect(parseInt(modal.style.left)).toBeLessThanOrEqual(
      window.innerWidth - modal.offsetWidth
    );
  });

  test("Modal should reset dropdown selection after change", () => {
    select.value = "right";
    select.dispatchEvent(new window.Event("change"));
    expect(select.value).toBe(""); // Verify dropdown resets after movement
  });

  test("Modal should handle no direction selected gracefully", () => {
    select.value = "";
    select.dispatchEvent(new window.Event("change"));
    expect(modal.style.left).toBe("0px");
    expect(modal.style.top).toBe("0px");
  });

  test("Modal movement should respect the 'moveAmount'", () => {
    const initialTop = parseInt(modal.style.top) || 0;
    select.value = "down";
    select.dispatchEvent(new window.Event("change"));
    const newTop = parseInt(modal.style.top);
    expect(newTop - initialTop).toBe(50); // 50 is the defined moveAmount
  });
});
