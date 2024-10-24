const { generateScreenHTML } = require('./script'); // Adjust the path

describe('generateScreenHTML', () => {

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
    city: 'ny',
    terms: true
  };

  const emptyData = {};

  it('should generate correct HTML for view mode', () => {
    const html = generateScreenHTML(fields, data, 'view');
    expect(html).toContain('disabled'); // All fields should be disabled
    expect(html).toContain('John Doe');
    expect(html).toContain('New York');
    expect(html).toContain('checked'); // Checkbox should be checked
    expect(html).toContain('Age'); // Non-editable field should be disabled
  });

  it('should generate correct HTML for create mode', () => {
    const html = generateScreenHTML(fields, emptyData, 'create');
    expect(html).not.toContain('disabled'); // All fields should be enabled
    expect(html).toContain('select'); // Select control should be generated
    expect(html).not.toContain('checked'); // Checkbox should not be checked
    expect(html).toContain('input'); // Inputs should be rendered
  });

  it('should generate correct HTML for edit mode with editable fields', () => {
    const html = generateScreenHTML(fields, data, 'edit');
    expect(html).toContain('John Doe');

    expect(html).toContain('disabled'); // Non-editable fields should be disabled
    expect(html).toContain('checked'); // Checkbox should be checked
  });

  it('should generate correct HTML when there are fewer than 3 fields per row', () => {
    const html = generateScreenHTML([fields[0], fields[1]], data, 'view');
    expect(html).toContain('row'); // Should still generate a row
    expect(html.split('<div class="row">').length - 1).toBe(3); // Ensure 3 rows
  });

  it('should generate correct HTML for more than 3 fields per row', () => {
    const html = generateScreenHTML(fields, data, 'create');
    expect(html.split('<div class="row">').length - 1).toBe(4); 
  });

  it('should handle empty fields array gracefully', () => {
    const html = generateScreenHTML([], data, 'create');
    expect(html).toContain('<div class="container">');
    expect(html).not.toContain('input');
    expect(html).not.toContain('select');
  });

  it('should generate correct HTML when no data is provided (empty)', () => {
    const html = generateScreenHTML(fields, emptyData, 'view');
    expect(html).toContain('<input type="text" id="name" value=""'); // Empty value for input
    expect(html).toContain('<select id="city"'); // Select should be rendered
    expect(html).not.toContain('selected'); // No option should be selected
  });

  it('should render checkboxes correctly based on data', () => {
    const html = generateScreenHTML(fields, { terms: false }, 'view');
    expect(html).not.toContain('checked'); // Checkbox should not be checked
  });

  it('should disable fields in view mode and edit mode correctly', () => {
    const viewHtml = generateScreenHTML(fields, data, 'view');
    const editHtml = generateScreenHTML(fields, data, 'edit');
    expect(viewHtml).toContain('disabled'); // All fields should be disabled in view mode
    expect(editHtml).toContain('disabled'); // Non-editable fields should be disabled in edit mode
    expect(editHtml).not.toContain('disabled="disabled" style'); // Editable fields should not be disabled
  });

  it('should include the drag and drop script in the HTML', () => {
    const html = generateScreenHTML(fields, data, 'view');
    expect(html).toContain('<script>');
    expect(html).toContain('Sortable'); // Ensure SortableJS script placeholder exists
  });

  it('should handle undefined or missing style gracefully', () => {
    const customFields = [
      { id: 'custom', controlType: 'input', label: 'Custom Field', size: 4, editable: true } // No style provided
    ];
    const html = generateScreenHTML(customFields, data, 'create');
    expect(html).toContain('<input type="text" id="custom"'); // Ensure the input is rendered
  });

});
