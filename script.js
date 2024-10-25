const modal = document.getElementById('modal');
const dropdown = document.getElementById('directionDropdown');

// Set initial position
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';

dropdown.addEventListener('change', () => {
  const direction = dropdown.value;
  const currentLeft = parseFloat(modal.style.left) || 50;
  const currentTop = parseFloat(modal.style.top) || 50;
  const step = 10; // percentage to move

  switch (direction) {
    case 'up':
      modal.style.top = Math.max(0, currentTop - step) + '%';
      break;
    case 'down':
      modal.style.top = Math.min(100, currentTop + step) + '%';
      break;
    case 'left':
      modal.style.left = Math.max(0, currentLeft - step) + '%';
      break;
    case 'right':
      modal.style.left = Math.min(100, currentLeft + step) + '%';
      break;
  }
  
  dropdown.value = ''; // Reset the dropdown
});