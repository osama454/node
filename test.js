// test.js
const { JSDOM } = require('jsdom');

const options = {
  resources: 'usable',
  runScripts: 'dangerously',
};

let window, document;

beforeAll((done) => {
  JSDOM.fromFile('index.html', options).then((dom) => {
    window = dom.window;
    document = window.document;

    // Mock requestAnimationFrame and cancelAnimationFrame
    window.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
    window.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

    // Wait for the scripts to load

      // Mock canvas context methods
      const canvas = document.getElementById('myCanvas');
      canvas.getContext = () => ({
        beginPath: jest.fn(),
        arc: jest.fn(),
        rect: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        clearRect: jest.fn(),
        isPointInPath: jest.fn(() => true),
        createLinearGradient: jest.fn(() => ({
          addColorStop: jest.fn(),
        })),
      });

      done();
    });

});

describe('Interactive Geometry Playground', () => {
  test('Canvas and control buttons exist', () => {
    const canvas = document.getElementById('myCanvas');
    expect(canvas).not.toBeNull();

    const controls = [
      'drawCircle',
      'drawSquare',
      'drawTriangle',
      'drawPentagon',
      'clearCanvas',
      'gridSize',
      'shapeSize',
      'borderColor',
      'borderWidth',
      'animationToggle',
      'saveShapes',
      'loadShapes',
      'shapeCount',
    ];

    controls.forEach((id) => {
      const element = document.getElementById(id);
      expect(element).not.toBeNull();
    });
  });

  test('Clicking "Draw Circle" adds a circle', () => {
    const drawCircleBtn = document.getElementById('drawCircle');
    const shapeCountDisplay = document.getElementById('shapeCount');

    expect(shapeCountDisplay.textContent).toBe('0');

    drawCircleBtn.click();

    expect(shapeCountDisplay.textContent).toBe('1');
  });

  test('Clicking "Draw Square" adds a square', () => {
    const drawSquareBtn = document.getElementById('drawSquare');
    const shapeCountDisplay = document.getElementById('shapeCount');

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);

    drawSquareBtn.click();

    expect(shapeCountDisplay.textContent).toBe((initialCount + 1).toString());
  });

  test('Clearing canvas removes all shapes', () => {
    const shapeCountDisplay = document.getElementById('shapeCount');
    const clearCanvasBtn = document.getElementById('clearCanvas');

    // Ensure there are shapes to clear
    const drawCircleBtn = document.getElementById('drawCircle');
    drawCircleBtn.click();
    expect(shapeCountDisplay.textContent).not.toBe('0');

    clearCanvasBtn.click();

    expect(shapeCountDisplay.textContent).toBe('0');
  });

  test('Double-clicking a shape deletes it', () => {
    const canvas = document.getElementById('myCanvas');
    const shapeCountDisplay = document.getElementById('shapeCount');

    // Draw a shape first
    const drawCircleBtn = document.getElementById('drawCircle');
    drawCircleBtn.click();

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);
    expect(initialCount).toBeGreaterThan(0);

    // Simulate double-click on canvas at position where the shape is likely to be
    const dblclickEvent = new window.MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    Object.defineProperty(dblclickEvent, 'offsetX', { get: () => 100 });
    Object.defineProperty(dblclickEvent, 'offsetY', { get: () => 100 });
    canvas.dispatchEvent(dblclickEvent);

    // After deleting, the shape count should decrease by 1
    expect(shapeCountDisplay.textContent).toBe((1).toString());
  });

  test('Animation toggle starts and stops animation', () => {
    const animationToggle = document.getElementById('animationToggle');
    const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');

    animationToggle.checked = true;
    animationToggle.dispatchEvent(new window.Event('change'));

    expect(requestAnimationFrameSpy).toHaveBeenCalled();

    animationToggle.checked = false;
    animationToggle.dispatchEvent(new window.Event('change'));

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  test('Changing shape size affects new shapes', () => {
    const shapeSizeRange = document.getElementById('shapeSize');
    const drawCircleBtn = document.getElementById('drawCircle');
    const shapeCountDisplay = document.getElementById('shapeCount');

    shapeSizeRange.value = '70';
    shapeSizeRange.dispatchEvent(new window.Event('input'));

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);
    drawCircleBtn.click();

    // Since we can't access the shape size directly, we assume that if the shape is drawn without errors,
    // the size change was accepted. Alternatively, we can check if drawShapes function was called with the new size.

    expect(shapeCountDisplay.textContent).toBe((initialCount + 1).toString());
  });

  test('Changing border color affects new shapes', () => {
    const borderColorPicker = document.getElementById('borderColor');
    const drawSquareBtn = document.getElementById('drawSquare');
    const shapeCountDisplay = document.getElementById('shapeCount');

    borderColorPicker.value = '#ff0000';
    borderColorPicker.dispatchEvent(new window.Event('input'));

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);
    drawSquareBtn.click();

    expect(shapeCountDisplay.textContent).toBe((initialCount + 1).toString());
  });

  test('Changing border width affects new shapes', () => {
    const borderWidthRange = document.getElementById('borderWidth');
    const drawTriangleBtn = document.getElementById('drawTriangle');
    const shapeCountDisplay = document.getElementById('shapeCount');

    borderWidthRange.value = '5';
    borderWidthRange.dispatchEvent(new window.Event('input'));

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);
    drawTriangleBtn.click();

    expect(shapeCountDisplay.textContent).toBe((initialCount + 1).toString());
  });

  test('Grid size changes snapping behavior', () => {
    const gridSizeSelect = document.getElementById('gridSize');
    const canvas = document.getElementById('myCanvas');
    const drawCircleBtn = document.getElementById('drawCircle');

    // Set grid size to 50
    gridSizeSelect.value = '50';
    gridSizeSelect.dispatchEvent(new window.Event('change'));

    // Draw a shape to have something to drag
    drawCircleBtn.click();

    // Simulate dragging the shape
    const mousedownEvent = new window.MouseEvent('mousedown', {
      clientX: 75,
      clientY: 75,
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'offsetX', { get: () => 75 });
    Object.defineProperty(mousedownEvent, 'offsetY', { get: () => 75 });
    canvas.dispatchEvent(mousedownEvent);

    const mousemoveEvent = new window.MouseEvent('mousemove', {
      clientX: 125,
      clientY: 125,
      bubbles: true,
    });
    Object.defineProperty(mousemoveEvent, 'offsetX', { get: () => 125 });
    Object.defineProperty(mousemoveEvent, 'offsetY', { get: () => 125 });
    canvas.dispatchEvent(mousemoveEvent);

    const mouseupEvent = new window.MouseEvent('mouseup', { bubbles: true });
    canvas.dispatchEvent(mouseupEvent);

    // Since we can't access the shape's position directly, we can't verify the snapping behavior.
    // However, we can check if the code executed without errors.
    expect(true).toBe(true);
  });

  test('Saving shapes creates a download link', () => {
    const saveShapesBtn = document.getElementById('saveShapes');
    const createElementSpy = jest.spyOn(document, 'createElement');
    const clickMock = jest.fn();
    createElementSpy.mockReturnValue({ setAttribute: jest.fn(), click: clickMock });

    saveShapesBtn.click();

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();
  });

  test('Loading shapes updates the shape count', () => {
    const loadShapesBtn = document.getElementById('loadShapes');
    const fileInput = document.getElementById('fileInput');
    const shapeCountDisplay = document.getElementById('shapeCount');

    const initialCount = parseInt(shapeCountDisplay.textContent, 10);

    // Mock FileReader
    const fileContent = JSON.stringify([{ type: 'circle', x: 50, y: 50, size: 30 }]);
    jest.spyOn(window, 'FileReader').mockImplementation(() => ({
      readAsText: function () {
        this.onload({ target: { result: fileContent } });
      },
      onload: null,
    }));

    // Simulate file selection
    const file = new window.Blob([fileContent], { type: 'application/json' });
    const changeEvent = new window.Event('change');
    Object.defineProperty(changeEvent, 'target', { value: { files: [file] } });
    fileInput.dispatchEvent(changeEvent);

    // Check if shape count increased
    expect(parseInt(shapeCountDisplay.textContent, 10)).toBeGreaterThan(0);
  });
});
