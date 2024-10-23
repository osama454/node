import { generateDynamicScreen, generateFieldControl } from './script'; // Replace with your actual file path

describe('generateFieldControl', () => {
  const data = {
    productName: 'Test Product',
    category: 'electronics',
    inStock: true
  };

  it('should generate input field correctly', () => {
    const field = { name: 'productName', label: 'Product Name', type: 'input', editable: true };
    expect(generateFieldControl(field, data, 'create')).toMatchSnapshot();
  });

  it('should generate select field correctly', () => {
    const field = { name: 'category', label: 'Category', type: 'select', items: [{ value: 'electronics', label: 'Electronics' }, { value: 'books', label: 'Books' }], editable: true };
    expect(generateFieldControl(field, data, 'edit')).toMatchSnapshot();
  });

  it('should generate checkbox field correctly', () => {
    const field = { name: 'inStock', label: 'In Stock', type: 'checkbox', editable: false };
    expect(generateFieldControl(field, data, 'view')).toMatchSnapshot();
  });


  it('should handle unsupported field type', () => {
    const field = { name: 'test', label: 'Test', type: 'unsupported', editable: true };
    expect(generateFieldControl(field, data, 'create')).toContain('Unsupported field type: unsupported');
  });

  it('should disable fields in view mode', () => {
    const field = { name: 'productName', label: 'Product Name', type: 'input', editable: true };
    expect(generateFieldControl(field, data, 'view')).toContain('disabled');
  });

  it('should disable non-editable fields in edit mode', () => {
    const field = { name: 'price', label: 'Price', type: 'input', editable: false };
    expect(generateFieldControl(field, data, 'edit')).toContain('disabled');
  });

  it('should enable editable fields in create and edit mode', () => {
    const field = { name: 'productName', label: 'Product Name', type: 'input', editable: true };
    expect(generateFieldControl(field, data, 'create')).not.toContain('disabled');
    expect(generateFieldControl(field, data, 'edit')).not.toContain('disabled');
  });
});

describe('generateDynamicScreen', () => {
    const fields = [
      { name: 'productName', label: 'Product Name', type: 'input', editable: true },
      { name: 'category', label: 'Category', type: 'select', items: [{ value: 'electronics', label: 'Electronics' }, { value: 'books', label: 'Books' }], editable: true },
      { name: 'price', label: 'Price', type: 'input', editable: false },
      { name: 'inStock', label: 'In Stock', type: 'checkbox', editable: true }
    ];

    const data = {
        productName: 'Test Product',
        category: 'electronics',
        price: 19.99,
        inStock: true
    };

    it('should generate screen with empty data', () => {
        expect(generateDynamicScreen(fields, {}, 'create')).toMatchSnapshot();
    });

    it('should generate screen with data in view mode', () => {
        expect(generateDynamicScreen(fields, data, 'view')).toMatchSnapshot();
    });

    it('should generate screen with data in create mode', () => {
        expect(generateDynamicScreen(fields, data, 'create')).toMatchSnapshot();
    });

    it('should generate screen with data in edit mode', () => {
        expect(generateDynamicScreen(fields, data, 'edit')).toMatchSnapshot();
    });

    it('should handle empty fields array', () => {
        expect(generateDynamicScreen([], data, 'create')).toEqual('<div class="container"></div>');
    });

    it('should render fields in rows of 3', () => {
      const screenHTML = generateDynamicScreen(fields, data, 'create');
      expect(screenHTML.match(/<div class="row">/g).length).toBe(2);
    });

    it('should render the last row with less than 3 fields', () => {
        const screenHTML = generateDynamicScreen(fields.slice(0,2), data, 'create');
        expect(screenHTML.match(/<div class="row">/g).length).toBe(1);
    });
});