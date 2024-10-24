const dataContainer = document.getElementById('dataContainer');
const data1Button = document.getElementById('data1Button');
const data2Button = document.getElementById('data2Button');
const data3Button = document.getElementById('data3Button');
const layoutButton = document.getElementById('layoutButton');
const plotsButton = document.getElementById('plotsButton');

let showData1 = false;
let showData2 = false;
let showData3 = false;
let isVertical = false;
let showPlots = true;

let data1 = null;
let data2 = null;
let data3 = null;

function generateRandomData() {
  return Math.floor(Math.random() * 10) + 1;
}

function generateData() {
  return [[1, generateRandomData()], [2, generateRandomData()], [3, generateRandomData()]];
}

function createTable(data) {
  const table = document.createElement('table');
  const headerRow = table.insertRow();
  headerRow.insertCell().textContent = 'Index';
  headerRow.insertCell().textContent = 'Value';

  data.forEach(rowData => {
    const row = table.insertRow();
    row.insertCell().textContent = rowData[0];
    row.insertCell().textContent = rowData[1];
  });

  return table;
}

function createPlot(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  // Simple line plot (replace with your preferred library)
  ctx.beginPath();
  ctx.moveTo(0, 100 - data[0][1] * 10);
  ctx.lineTo(100, 100 - data[1][1] * 10);
  ctx.lineTo(200, 100 - data[2][1] * 10);
  ctx.stroke();

  return canvas;
}

function updateDataDisplay() {
  dataContainer.innerHTML = ''; // Clear previous content

  if (showData1 && data1) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data1));
    if (showPlots) dataItem.appendChild(createPlot(data1));
    dataContainer.appendChild(dataItem);
  }
  if (showData2 && data2) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data2));
    if (showPlots) dataItem.appendChild(createPlot(data2));
    dataContainer.appendChild(dataItem);
  }
  if (showData3 && data3) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data3));
    if (showPlots) dataItem.appendChild(createPlot(data3));
    dataContainer.appendChild(dataItem);
  }

  dataContainer.style.flexDirection = isVertical ? 'column' : 'row';
}

function initializeData() {
  data1 = generateData();
  data2 = generateData();
  data3 = generateData();
}

data1Button.addEventListener('click', () => {
  showData1 = !showData1;
  updateDataDisplay();
});

data2Button.addEventListener('click', () => {
  showData2 = !showData2;
  updateDataDisplay();
});

data3Button.addEventListener('click', () => {
  showData3 = !showData3;
  updateDataDisplay();
});

layoutButton.addEventListener('click', () => {
  isVertical = !isVertical;
  updateDataDisplay();
});

plotsButton.addEventListener('click', () => {
  showPlots = !showPlots;
  updateDataDisplay();
});

// Initialize data once when the script loads
initializeData();
