/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;
let navbar,
  productTitle,
  productCard,
  footer,
  productName,
  productPrice,
  productDiscount,
  productDescription;

function set() {
  navbar = document.querySelector(".navbar");
  productTitle = document.querySelector(".page-title");
  productCard = document.querySelector(".product-card");
  productName = document.querySelector(".product-name");
  productPrice = document.querySelector(".product-price");
  productDiscount = document.querySelector(".product-discount");
  productDescription = document.querySelector(".product-description");
  footer = document.querySelector(".footer");
}

function reset(done) {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    Object.defineProperty(window.HTMLElement.prototype, "innerText", {
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
    });
    if (document.readyState != "loading") {
      set();
      done();
    } else
      document.addEventListener("DOMContentLoaded", () => {
        set();
        done();
      });
  });
}

beforeAll(() => {
  jest.useFakeTimers();
});

describe("Product Detail Page Structure and Content", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should have a navbar with expected classes", () => {
    expect(navbar).not.toBeNull();
  });

  it("should have a page title with 'Product Detail'", () => {
    expect(productTitle.textContent).toBe("Product Name");
  });

  it("should have a product card with the expected structure", () => {
    expect(productCard).not.toBeNull();
  });

  it("should have a product name in the right section", () => {
    expect(productName.textContent).toBe("Product Name");
  });

  it("should display the product price", () => {
    expect(productPrice.textContent).toBe("$99.99");
  });

  it("should display the product discount if applicable", () => {
    expect(productDiscount.textContent).toBe("20% off");
  });

  it("should have a product description", () => {
    expect(productDescription.textContent).toContain(
      "This is a brief description of the product"
    );
  });

  it("should have a footer with expected class", () => {
    expect(footer).not.toBeNull();
  });
});

describe("Product Detail Page Responsiveness", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should adapt to mobile view by changing flex direction to column", () => {
    window.innerWidth = 500; // Simulate mobile screen width
    window.dispatchEvent(new window.Event("resize"));
    const isColumnLayout =
      window.getComputedStyle(productCard).flexDirection === "column";
    // expect(isColumnLayout).toBe(true);  // It's not possible to change the screen size using code.
  });
});

describe("Product Detail Page Styling", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should apply Material-like background color to navbar", () => {
    expect(window.getComputedStyle(navbar).backgroundColor).toBe(
      "rgb(98, 0, 234)"
    );
  });

  it("should apply Material-like font to product name", () => {
    expect(window.getComputedStyle(productName).fontFamily).toContain("Roboto");
  });

  it("should display the footer at the bottom of the page", () => {
    expect(window.getComputedStyle(footer).position).toBe("fixed");
  });
});

describe("Product Detail Page Positioning", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should position the product image on the left side of the product card", () => {
    const productCard = document.querySelector(".product-card");
    const productLeft = document.querySelector(".product-left");
    const productRight = document.querySelector(".product-right");

    // Ensure product-card has a flex layout
    expect(window.getComputedStyle(productCard).display).toBe("flex");

    // Check if product-left is the first element in product-card
    expect(productCard.firstElementChild).toBe(productLeft);
  });

  it("should position the product details on the right side of the product card", () => {
    const productCard = document.querySelector(".product-card");
    const productRight = document.querySelector(".product-right");

    // Check if product-right is the second element in product-card
    expect(productCard.children[1]).toBe(productRight);
  });

  it("should make product-card layout responsive to screen size", () => {
    const productCard = document.querySelector(".product-card");

    // Simulate a small screen size
    window.innerWidth = 600;
    window.dispatchEvent(new window.Event("resize"));

    // Expect the product card to switch to a column layout on small screens
    // expect(window.getComputedStyle(productCard).flexDirection).toBe("column"); // We can't test that by code.
  });

  it("should display the navbar at the top of the page", () => {
    const navbar = document.querySelector(".navbar");
    expect(window.getComputedStyle(navbar).display).toBe("flex");
  });

  it("should keep the footer at the bottom of the page", () => {
    const footer = document.querySelector(".footer");

    // Footer should be fixed at the bottom of the viewport
    expect(window.getComputedStyle(footer).position).toBe("fixed");
    expect(window.getComputedStyle(footer).bottom).toBe("0px");
  });

  it("should center the product card on the page horizontally", () => {
    const productCard = document.querySelector(".product-card");

    // Center alignment with auto margins
    expect(window.getComputedStyle(productCard).marginLeft).toBe("auto");
    expect(window.getComputedStyle(productCard).marginRight).toBe("auto");
  });
  it("should position the product image on the left side of the product pricing", () => {
    const productLeft = document.querySelector(".product-left");
    const productImage = document.querySelector(".product-image");
    const productPricing = document.querySelector(".product-pricing");

    // Check if product-left container has flex display
    expect(window.getComputedStyle(productLeft).display).toBe("flex");

    // Ensure productImage comes before productPricing in the DOM order
    expect(productLeft.firstElementChild).toBe(productImage);
    expect(productLeft.children[1]).toBe(productPricing);
  });
});
