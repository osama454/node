const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const shapeCountDisplay = document.getElementById('shapeCount');
const drawCircleBtn = document.getElementById('drawCircle');
const drawSquareBtn = document.getElementById('drawSquare');
const drawTriangleBtn = document.getElementById('drawTriangle');
const drawPentagonBtn = document.getElementById('drawPentagon');
const clearCanvasBtn = document.getElementById('clearCanvas');
const gridSizeSelect = document.getElementById('gridSize');
const shapeSizeRange = document.getElementById('shapeSize');
const borderColorPicker = document.getElementById('borderColor');
const borderWidthRange = document.getElementById('borderWidth');
const animationToggle = document.getElementById('animationToggle');
const saveShapesBtn = document.getElementById('saveShapes');
const loadShapesBtn = document.getElementById('loadShapes');
const fileInput = document.getElementById('fileInput');

let shapes = [];
let gridSize = parseInt(gridSizeSelect.value);
let isDragging = false;
let selectedShape = null;
let offsetX, offsetY;
let animationFrameId;

function drawCircle(shape) {
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size / 2, 0, 2 * Math.PI);
  const gradient = ctx.createLinearGradient(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.x + shape.size / 2, shape.y + shape.size / 2);
  gradient.addColorStop(0, '#f0f');
  gradient.addColorStop(1, '#0ff');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = shape.borderColor;
  ctx.lineWidth = shape.borderWidth;
  ctx.stroke();
}

function drawSquare(shape) {
  ctx.beginPath();
  ctx.rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
  const gradient = ctx.createLinearGradient(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.x + shape.size / 2, shape.y + shape.size / 2);
  gradient.addColorStop(0, '#f00');
  gradient.addColorStop(1, '#0f0');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = shape.borderColor;
  ctx.lineWidth = shape.borderWidth;
  ctx.stroke();
}

function drawTriangle(shape) {
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size / 2);
  ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
  ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.x + shape.size / 2, shape.y + shape.size / 2);
  gradient.addColorStop(0, '#00f');
  gradient.addColorStop(1, '#ff0');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = shape.borderColor;
  ctx.lineWidth = shape.borderWidth;
  ctx.stroke();
}

function drawPentagon(shape) {
  const numberOfSides = 5;
  const size = shape.size / 2;
  const angle = (2 * Math.PI) / numberOfSides;
  ctx.beginPath();
  for (let i = 0; i <= numberOfSides; i++) {
      const currentAngle = i * angle;
      const currentX = shape.x + size * Math.cos(currentAngle);
      const currentY = shape.y + size * Math.sin(currentAngle);
      if (i === 0) {
          ctx.moveTo(currentX, currentY);
      } else {
          ctx.lineTo(currentX, currentY);
      }
  }
  ctx.closePath();
  const gradient = ctx.createLinearGradient(shape.x - size, shape.y - size, shape.x + size, shape.y + size);
  gradient.addColorStop(0, '#f0f');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = shape.borderColor;
  ctx.lineWidth = shape.borderWidth;
  ctx.stroke();
}
function createShape(type) {
  const size = parseInt(shapeSizeRange.value);
  const x = Math.random() * (canvas.width - size) + size / 2;
  const y = Math.random() * (canvas.height - size) + size / 2;
  const borderColor = borderColorPicker.value;
  const borderWidth = parseInt(borderWidthRange.value);
  const newShape = {
      type: type,
      x: x,
      y: y,
      size: size,
      borderColor: borderColor,
      borderWidth: borderWidth,
      rotation: 0  // Initial rotation set to 0 degrees
  };
  shapes.push(newShape);
  shapeCountDisplay.textContent = shapes.length.toString();
  drawShapes();
}
function selectShape(mouseX, mouseY) {
  for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation * Math.PI / 180);
      ctx.translate(-shape.x, -shape.y);
      ctx.beginPath();
      switch (shape.type) {
          case 'circle':
              ctx.arc(shape.x, shape.y, shape.size / 2, 0, 2 * Math.PI);
              break;
          case 'square':
              ctx.rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
              break;
          case 'triangle':
              ctx.moveTo(shape.x, shape.y - shape.size / 2);  // top vertex
              ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);  // bottom left vertex
              ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);  // bottom right vertex
              ctx.closePath();
              break;
          case 'pentagon':
              const numberOfSides = 5, size = shape.size / 2, angle = Math.PI * 2 / numberOfSides;
              ctx.moveTo(shape.x + size * Math.cos(0), shape.y + size * Math.sin(0));
              for (let n = 1; n < numberOfSides; n++) {
                  ctx.lineTo(shape.x + size * Math.cos(n * angle), shape.y + size * Math.sin(n * angle));
              }
              ctx.closePath();
              break;
      }
      ctx.restore();
      if (ctx.isPointInPath(mouseX, mouseY)) {
          return shape;
      }
  }
  return null; // If no shape is found under the cursor
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      if (shape.rotation) {
          ctx.rotate(shape.rotation * Math.PI / 180);
      }
      ctx.translate(-shape.x, -shape.y);
      if (shape.type === 'circle') {
          drawCircle(shape);
      } else if (shape.type === 'square') {
          drawSquare(shape);
      } else if (shape.type === 'triangle') {
          drawTriangle(shape);
      } else if (shape.type === 'pentagon') {
          drawPentagon(shape);
      }
      ctx.restore();
  });
}

function handleMouseDown(e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  selectedShape = selectShape(mouseX, mouseY);
  if (selectedShape) {
      isDragging = true;
      offsetX = mouseX - selectedShape.x;
      offsetY = mouseY - selectedShape.y;
  }
}

function handleMouseMove(e) {
  if (isDragging && selectedShape) {
      selectedShape.x = e.offsetX - offsetX;
      selectedShape.y = e.offsetY - offsetY;
      drawShapes();
  }
}

function handleMouseUp() {
  if (isDragging && selectedShape) {
      // Snap to grid
      selectedShape.x = Math.round(selectedShape.x / gridSize) * gridSize;
      selectedShape.y = Math.round(selectedShape.y / gridSize) * gridSize;
      drawShapes();
  }
  isDragging = false;
  selectedShape = null;
}

function handleDoubleClick(e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  const shapeToDelete = selectShape(mouseX, mouseY);
  if (shapeToDelete) {
      shapes = shapes.filter(shape => shape !== shapeToDelete);
      shapeCountDisplay.textContent = shapes.length;
      drawShapes();
  }
}

function handleKeyDown(e) {
  if (selectedShape) {
      const angle = 10;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          selectedShape.rotation = (selectedShape.rotation || 0) + angle;
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          selectedShape.rotation = (selectedShape.rotation || 0) - angle;
      }
      drawShapes();
  }
}
function animateShapes() {
  if (animationToggle.checked) {
      shapes.forEach(shape => {
          shape.rotation = (shape.rotation || 0) + 1;
      });
      drawShapes();
      animationFrameId = requestAnimationFrame(animateShapes);
  } else {
      cancelAnimationFrame(animationFrameId);
  }
}

function saveShapes() {
  const dataStr = JSON.stringify(shapes);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'shapes.json';
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function loadShapes(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          shapes = JSON.parse(e.target.result);
          shapeCountDisplay.textContent = shapes.length;
          drawShapes();
      };
      reader.readAsText(file);
  }
}


// Add event listeners to buttons, canvas, etc.
drawCircleBtn.addEventListener('click', () => createShape('circle'));
drawSquareBtn.addEventListener('click', () => createShape('square'));
drawTriangleBtn.addEventListener('click', () => createShape('triangle'));
drawPentagonBtn.addEventListener('click', () => createShape('pentagon'));
clearCanvasBtn.addEventListener('click', () => {
    shapes = [];
    shapeCountDisplay.textContent = shapes.length;
    drawShapes();
});
gridSizeSelect.addEventListener('change', () => {
    gridSize = parseInt(gridSizeSelect.value);
    drawShapes();
});
shapeSizeRange.addEventListener('input', drawShapes);
borderColorPicker.addEventListener('input', drawShapes);
borderWidthRange.addEventListener('input', drawShapes);
animationToggle.addEventListener('change', animateShapes);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('dblclick', handleDoubleClick);
document.addEventListener('keydown', handleKeyDown);
saveShapesBtn.addEventListener('click', saveShapes);
loadShapesBtn.addEventListener('click', () => fileInput.click());

// Initial drawing
drawShapes();
