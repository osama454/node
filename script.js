const modal = document.getElementById('my-modal');
const select = document.getElementById('direction-select');

let isDragging = false;
let offsetX, offsetY;

// Make the modal draggable
modal.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Keep the modal within the screen bounds
    x = Math.max(0, Math.min(x, window.innerWidth - modal.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - modal.offsetHeight));

    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Handle direction selection
select.addEventListener('change', () => {
    const direction = select.value;
    moveModal(direction);
    select.value = ''; // Reset the dropdown
});

function moveModal(direction) {
    let x = modal.offsetLeft;
    let y = modal.offsetTop;
    const moveAmount = 50;

    switch (direction) {
        case 'up':
            y = Math.max(0, y - moveAmount); // Moves modal up by moveAmount if space allows
            break;
        case 'down':
            y = Math.min(y + moveAmount, window.innerHeight - modal.offsetHeight); // Moves modal down, preventing it from going off screen
            break;
        case 'left':
            x = Math.max(0, x - moveAmount); // Moves modal left by moveAmount
            break;
        case 'right':
            x = Math.min(x + moveAmount, window.innerWidth - modal.offsetWidth); // Moves modal right, keeping it within screen bounds
            break;
    }

    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
}
