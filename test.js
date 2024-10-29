/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};
let /** @type {Window} */ window, /** @type {Document} */ document;

// Define the HTML components that will be interacted with here with convenient names
let button, out, products, promoAd, signupButton, reviewsContainer;

// Expected product details to test
const expectedProducts = [
  { color: "red", text: "Product 1 - $199" },
  { color: "green", text: "Product 2 - $249" },
  { color: "blue", text: "Product 3 - $399" },
  { color: "gray", text: "Product 4 - $149" },
];

// Expected review details to test
const expectedReviews = [
  { name: "John Doe", rating: "★★★★★", review: "Amazing quality and design!" },
  { name: "Jane Smith", rating: "★★★★", review: "Love the modern look." },
  { name: "Sam Brown", rating: "★★★★★", review: "Great customer service!" },
  { name: "Emily Davis", rating: "★★★★", review: "Fast delivery and easy setup." },
  { name: "Chris Wilson", rating: "★★★☆", review: "Good value for the price." },
  { name: "Lauren Miller", rating: "★★★★★", review: "Highly recommend this store!" },
];

function set() {
  // Set all the HTML components that will be interacted with here
  products = Array.from(document.querySelectorAll(".product"));
  promoAd = document.querySelector(".promo-ad");
  signupButton = document.querySelector(".signup-btn");
  reviewsContainer = document.querySelector(".reviews-container");

  // Mock window.alert if needed
  window.alert = jest.fn();
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
  jest.useFakeTimers(); // Use fake timers for time manipulation
});

describe("Landing Page Product Section", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should have 4 product images", () => {
    expect(products.length).toBe(4);
  });

  expectedProducts.forEach((expectedProduct, index) => {
    it(`should display product ${index + 1} with correct background color and text`, () => {
      const product = products[index];
      const productInfo = product.querySelector(".product-info");
      expect(product.style.backgroundColor).toBe(expectedProduct.color);
      expect(productInfo.textContent).toBe(expectedProduct.text);
    });
  });
});

describe("Promotional Ad Behavior", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should initially be positioned off-screen to the right", () => {
    // expect(window.getComputedStyle(promoAd).right).toBe("-100px"); // Will not work because the Pseudo class `:hover` doesn't work in JSDOM
  });

  it("should display 'Sign up' button when promo ad is hovered", () => {
    promoAd.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
    expect(window.getComputedStyle(signupButton).opacity).toBe("1");
  });

  it("should move promo ad into view on hover", () => {
    promoAd.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
    expect(window.getComputedStyle(promoAd).right).toBe("20px");
  });
});

describe("Customer Reviews Section", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should be horizontally scrollable", () => {
    expect(window.getComputedStyle(reviewsContainer).overflowX).toBe("auto");
  });

  it("should contain 6 reviews", () => {
    const reviews = reviewsContainer.querySelectorAll(".review");
    expect(reviews.length).toBe(6);
  });

  expectedReviews.forEach((expectedReview, index) => {
    it(`should display review ${index + 1} with correct details`, () => {
      const review = reviewsContainer.children[index];
      const nameAndRating = review.querySelector("p").textContent;
      const reviewText = review.querySelector("p:last-child").textContent;
      expect(nameAndRating).toContain(expectedReview.name);
      expect(nameAndRating).toContain(expectedReview.rating.replace(/☆/g,'â˜†').replace(/★/g,'â˜…'));
      expect(reviewText).toBe(expectedReview.review);
    });
  });
});
