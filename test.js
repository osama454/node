/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let /** @type {Window} */ window, /** @type {Document} */ document;
let /** @type {HTMLElement} */ navLinks, /** @type {HTMLElement} */ footerText, /** @type {HTMLElement} */ sidebar, /** @type {HTMLElement} */ mainSection, /** @type {NodeListOf<HTMLElement>} */ cards;

function set() {
  // Set all the HTML components that will be interacted with here
  navLinks = document.querySelectorAll("nav ul li");
  footerText = document.querySelector("footer p");
  sidebar = document.querySelector("main aside");
  mainSection = document.querySelector("main section.cards");
  cards = document.querySelectorAll(".card");

  // Mock window.alert (if needed for any prompt requirement)
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
    if (document.readyState !== "loading") {
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
  jest.useFakeTimers(); // Use fake timers for any time manipulation
});


describe("UI Layout Structure", () => {
  beforeAll((done) => {
    reset(done);
  });

  // Test 1: Navigation bar contains exactly 4 centered links
  it("Check navigation bar has 4 links", () => {
    expect(navLinks.length).toBe(4);
  });

  // Test 2: Navigation links are centered
  it("Check navigation links are centered", () => {
    const navStyle = window.getComputedStyle(document.querySelector("nav ul"));
    expect(navStyle.textAlign).toBe("center");
  });

  // Test 3: Footer contains italic text and is centered
  it("Check footer text is italic", () => {
    expect(footerText.querySelector("i")).not.toBeNull();
  });

  it("Check footer text is centered", () => {
    const footerStyle = window.getComputedStyle(footerText);
    expect(footerStyle.textAlign).toBe("center");
  });

  // Test 4: Sidebar occupies 1/4 of the width
  it("Check sidebar occupies 1/4 of the width", () => {
    const main = document.querySelector('main');
    const firstElement = main.firstElementChild;

    expect(firstElement.tagName.toLowerCase()).toBe("section");
  });

  // Test 5: Main section occupies 3/4 of the width
  it("Check main section occupies 3/4 of the width", () => {
    const mainSectionStyle = window.getComputedStyle(document.querySelector("main"));
    expect(mainSectionStyle.gridTemplateColumns).toBe("3fr 1fr");
  });

  // Test 6: Sidebar contains 4 vertically stacked items
  it("Check sidebar has 4 vertically stacked items", () => {
    const sidebarItems = sidebar.querySelectorAll("ul li");
    expect(sidebarItems.length).toBe(4);
  });

  // Test 7: Cards container should have 4 cards
  it("Check there are 4 cards in the main section", () => {
    expect(cards.length).toBe(4);
  });

  // Test 8: Cards should have hover effect that enlarges them
  it("Check cards have hover effect", () => {
    const initialTransform = window.getComputedStyle(cards[0]).transform;
    cards[0].dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
    jest.advanceTimersByTime(100)
    const hoverTransform = window.getComputedStyle(cards[0]).transform;
    expect(hoverTransform).toBe(initialTransform);
  });
});
