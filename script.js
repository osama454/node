const modal = document.getElementById('modal'); // Access the modal element
const dropdown = document.getElementById('directionDropdown'); // Access the dropdown element

// Set initial position
modal.style.top = '50%'; // Centers modal vertically
modal.style.left = '50%'; // Centers modal horizontally
modal.style.transform = 'translate(-50%, -50%)'; // Offsets modal to be exactly centered

dropdown.addEventListener('change', () => { // Triggers movement on dropdown change
  const direction = dropdown.value; // Gets selected direction
  const currentLeft = parseFloat(modal.style.left) || 50; // Gets current left position as a percentage
  const currentTop = parseFloat(modal.style.top) || 50; // Gets current top position as a percentage
  const step = 10; // Step size for movement in percentage

  switch (direction) {
    case 'up':
      modal.style.top = Math.max(0, currentTop - step) + '%'; // Moves modal up with boundary check
      break;
    case 'down':
      modal.style.top = Math.min(100, currentTop + step) + '%'; // Moves modal down with boundary check
      break;
    case 'left':
      modal.style.left = Math.max(0, currentLeft - step) + '%'; // Moves modal left with boundary check
      break;
    case 'right':
      modal.style.left = Math.min(100, currentLeft + step) + '%'; // Moves modal right with boundary check
      break;
  }
  
  dropdown.value = ''; // Resets dropdown selection
});
