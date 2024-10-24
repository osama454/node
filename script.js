/**
 * Generates HTML for a customizable inventory screen based on fields configuration.
 * The fields are organized into rows of 3, support drag and drop, and handle states (view, create, edit).
 *
 * @param {Array} fields - List of field definitions (controlType, position, size, editable, items, style).
 * @param {Object} data - Object containing field values.
 * @param {string} mode - The mode of the form: 'view', 'create', or 'edit'.
 * @returns {string} - Generated HTML as a string.
 */
export function generateScreenHTML(fields, data, mode) {
  let html = '<div class="container">';  // Container for the entire screen layout
  let row = '<div class="row">';  // Row container to hold up to 3 fields
  let rowCount = 0;  // Keeps track of the number of fields in the current row

  fields.forEach((field, index) => {
    let fieldHTML = '';  // HTML string for the current field
    let disabled = (mode === 'view') || (mode === 'edit' && !field.editable);  // Determine if the field should be disabled based on the mode

    // Build HTML based on the field's control type
    switch (field.controlType) {
      case 'select':
        fieldHTML = `<select id="${field.id}" style="${field.style}" ${disabled ? 'disabled' : ''}>`;
        field.items.forEach(item => {
          fieldHTML += `<option value="${item.value}" ${data[field.id] === item.value ? 'selected' : ''}>${item.label}</option>`;
        });
        fieldHTML += '</select>';
        break;
      case 'input':
        fieldHTML = `<input type="text" id="${field.id}" value="${data[field.id] || ''}" style="${field.style}" ${disabled ? 'disabled' : ''}>`;
        break;
      case 'checkbox':
        fieldHTML = `<input type="checkbox" id="${field.id}" ${data[field.id] ? 'checked' : ''} style="${field.style}" ${disabled ? 'disabled' : ''}>`;
        break;
    }

    // Wrap field in a div with correct size and draggable class
    fieldHTML = `<div id="${field.id}-container" class="col-md-${field.size} draggable" style="position: relative;">${field.label}: ${fieldHTML}</div>`;

    row += fieldHTML;  // Append the field HTML to the current row
    rowCount++;

    // If 3 fields are in the row, close the row and start a new one
    if (rowCount === 3) {
      html += row + '</div>';
      row = '<div class="row">';
      rowCount = 0;
    }
  });

  // If the last row contains fewer than 3 fields, close the remaining row
  if (rowCount > 0) {
    html += row + '</div>';
  }

  html += '</div>';  // Close the main container

  // Add drag and drop functionality (if SortableJS is included)
  html += `
    <script>
      // Initialize SortableJS for drag and drop functionality if available
      if (typeof Sortable !== 'undefined') {
        new Sortable(document.querySelector('.container'), {
          animation: 150,
          ghostClass: 'sortable-ghost',  // Class for the placeholder during dragging
          onEnd: function(evt) {
            // Reorganize fields after drag-and-drop to ensure rows of 3
            const items = Array.from(document.querySelectorAll('.draggable'));
            let newHtml = '<div class="row">';
            items.forEach((item, index) => {
              newHtml += item.outerHTML;
              if ((index + 1) % 3 === 0) {
                newHtml += '</div><div class="row">';
              }
            });
            newHtml += '</div>';
            document.querySelector('.container').innerHTML = newHtml;
          }
        });
      }
    </script>
  `;

  return html;  // Return the generated HTML string
}


// Example usage:
const fields = [
  { id: 'name', controlType: 'input', label: 'Name', size: 4, editable: true, style: 'width: 100%;' },
  { id: 'age', controlType: 'input', label: 'Age', size: 4, editable: false, style: 'width: 100%;' },
  { id: 'city', controlType: 'select', label: 'City', size: 4, editable: true, items: [{ value: 'ny', label: 'New York' }, { value: 'la', label: 'Los Angeles' }], style: 'width: 100%;' },
  { id: 'country', controlType: 'input', label: 'Country', size: 4, editable: true, style: 'width: 100%;' },
  { id: 'terms', controlType: 'checkbox', label: 'Agree to Terms', size: 8, editable: true, style: 'width: 100%;' }
];

const data = {
  name: 'John Doe',
  age: 30,
  city: 'ny'
};

let screenHTMLView = generateScreenHTML(fields, data, 'view');
let screenHTMLCreate = generateScreenHTML(fields, {}, 'create');
let screenHTMLEdit = generateScreenHTML(fields, data, 'edit');

// Log generated HTML for different modes (view, create, edit)
console.log("View Mode:\n", screenHTMLView);
console.log("Create Mode:\n", screenHTMLCreate);
console.log("Edit Mode:\n", screenHTMLEdit);


// Another function to render the HTML into a container on the page
function renderScreen(html) {
  const screenContainer = document.getElementById('screen-container');
  screenContainer.innerHTML = html;

  // Reinitialize drag-and-drop functionality after rendering if necessary
  if (typeof Sortable !== 'undefined') {
    new Sortable(document.querySelector('.container'), {
      animation: 150
    });
  }
}

// Example usage of renderScreen to render the View screen:
// renderScreen(screenHTMLView);

