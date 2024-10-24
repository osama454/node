// Accessing the data container and buttons from the HTML document
const dataContainer = document.getElementById('dataContainer');
const data1Button = document.getElementById('data1Button');
const data2Button = document.getElementById('data2Button');
const data3Button = document.getElementById('data3Button');
const layoutButton = document.getElementById('layoutButton');
const plotsButton = document.getElementById('plotsButton');

// State variables to track visibility of data, layout orientation, and plot visibility
let showData1 = false;
let showData2 = false;
let showData3 = false;
let isVertical = false; // Determines layout (row vs column)
let showPlots = true;   // Determines plot visibility

// Data variables for each set of data (populated when the script loads)
let data1 = null;
let data2 = null;
let data3 = null;

// Generates random data between 1 and 10 for the tables and plots
function generateRandomData() {
  return Math.floor(Math.random() * 10) + 1;
}

// Generates a 3x2 table of data with indexes 1, 2, 3 and random values
function generateData() {
  return [[1, generateRandomData()], [2, generateRandomData()], [3, generateRandomData()]];
}

// Dynamically creates a table for the data
function createTable(data) {
  const table = document.createElement('table');
  const headerRow = table.insertRow(); // Create header row
  headerRow.insertCell().textContent = 'Index'; // Column 1: Index
  headerRow.insertCell().textContent = 'Value'; // Column 2: Value

  // Create data rows
  data.forEach(rowData => {
    const row = table.insertRow(); // Create a row for each data pair
    row.insertCell().textContent = rowData[0]; // First column: Index
    row.insertCell().textContent = rowData[1]; // Second column: Random value
  });

  return table; // Return the constructed table
}

// Creates a simple line plot for the data (you can replace this with a charting library)
function createPlot(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  // Basic line plot drawing (replace with more advanced plotting)
  ctx.beginPath();
  ctx.moveTo(0, 100 - data[0][1] * 10); // Plot the first point
  ctx.lineTo(100, 100 - data[1][1] * 10); // Plot the second point
  ctx.lineTo(200, 100 - data[2][1] * 10); // Plot the third point
  ctx.stroke();

  return canvas; // Return the constructed canvas for the plot
}

// Updates the displayed data sections based on the current state
function updateDataDisplay() {
  dataContainer.innerHTML = ''; // Clear the previous content

  // Display Data 1 if toggled on
  if (showData1 && data1) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data1)); // Append the table
    if (showPlots) dataItem.appendChild(createPlot(data1)); // Append the plot if plots are visible
    dataContainer.appendChild(dataItem); // Add the data section to the container
  }

  // Display Data 2 if toggled on
  if (showData2 && data2) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data2)); // Append the table
    if (showPlots) dataItem.appendChild(createPlot(data2)); // Append the plot if plots are visible
    dataContainer.appendChild(dataItem); // Add the data section to the container
  }

  // Display Data 3 if toggled on
  if (showData3 && data3) {
    const dataItem = document.createElement('div');
    dataItem.classList.add('data-item');
    dataItem.appendChild(createTable(data3)); // Append the table
    if (showPlots) dataItem.appendChild(createPlot(data3)); // Append the plot if plots are visible
    dataContainer.appendChild(dataItem); // Add the data section to the container
  }

  // Update the layout orientation (horizontal or vertical)
  dataContainer.style.flexDirection = isVertical ? 'column' : 'row';
}

// Initialize the data for all three datasets once when the script loads
function initializeData() {
  data1 = generateData();
  data2 = generateData();
  data3 = generateData();
}

// Event listeners for toggling data and layouts

// Toggle Data 1 visibility
data1Button.addEventListener('click', () => {
  showData1 = !showData1; // Toggle the state for Data 1
  updateDataDisplay();    // Update the display to reflect the changes
});

// Toggle Data 2 visibility
data2Button.addEventListener('click', () => {
  showData2 = !showData2; // Toggle the state for Data 2
  updateDataDisplay();    // Update the display to reflect the changes
});

// Toggle Data 3 visibility
data3Button.addEventListener('click', () => {
  showData3 = !showData3; // Toggle the state for Data 3
  updateDataDisplay();    // Update the display to reflect the changes
});

// Toggle layout between horizontal and vertical
layoutButton.addEventListener('click', () => {
  isVertical = !isVertical; // Toggle the layout direction
  updateDataDisplay();      // Update the display to reflect the new layout
});

// Toggle visibility of plots
plotsButton.addEventListener('click', () => {
  showPlots = !showPlots;   // Toggle plot visibility
  updateDataDisplay();      // Update the display to show/hide plots
});

// Call this function to initialize the data when the script loads
initializeData();
