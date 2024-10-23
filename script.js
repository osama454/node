export function generateDynamicScreen(fields, data, mode) {
  let html = '<div class="container">';
  let rowCounter = 0;
  let currentRow = '<div class="row">';

  fields.forEach((field, index) => {
    // Determine if a new row is needed
    if (rowCounter === 3) {
      html += currentRow + "</div>";
      currentRow = '<div class="row">';
      rowCounter = 0;
    }

    // Generate HTML for the field
    let fieldHTML = `<div class="col-md-4 draggable" data-field-index="${index}" draggable="true">`;
    fieldHTML += generateFieldControl(field, data, mode);
    fieldHTML += "</div>";

    // Add field to the current row
    currentRow += fieldHTML;
    rowCounter++;
  });

  // Add the last row if it's not empty
  if (rowCounter > 0) {
    html += currentRow + "</div>";
  }

  html += "</div>";
  return html;
}

export function generateFieldControl(field, data, mode) {
  let fieldHTML = `<div class="form-group" style="${field.style || ""}">`;
  fieldHTML += `<label for="${field.name}">${field.label}</label>`;

  let isDisabled = mode === "view" || (mode === "edit" && !field.editable);

  switch (field.type) {
    case "select":
      fieldHTML += `<select class="form-control" id="${field.name}" ${
        isDisabled ? "disabled" : ""
      }>`;
      field.items.forEach((item) => {
        let selected = data[field.name] === item.value ? "selected" : "";
        fieldHTML += `<option value="${item.value}" ${selected}>${item.label}</option>`;
      });
      fieldHTML += "</select>";
      break;
    case "input":
      fieldHTML += `<input type="text" class="form-control" id="${
        field.name
      }" value="${data[field.name] || ""}" ${isDisabled ? "disabled" : ""}>`;
      break;
    case "checkbox":
      let checked = data[field.name] ? "checked" : "";
      fieldHTML += `<input type="checkbox" id="${field.name}" ${checked} ${
        isDisabled ? "disabled" : ""
      }>`;
      break;
    default:
      fieldHTML += `<p>Unsupported field type: ${field.type}</p>`;
  }

  fieldHTML += "</div>";
  return fieldHTML;
}
