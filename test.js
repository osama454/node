/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};
let /** @type {Window} */ window, /** @type {Document} */ document;

function set() {
  // Initialize elements to be tested
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

describe("Chessboard Setup", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("should have an 8x8 board", () => {
    const rows = document.querySelectorAll("#chessboard tr");
    expect(rows.length).toBe(8);
    rows.forEach((row) => {
      const squares = row.querySelectorAll("td");
      expect(squares.length).toBe(8);
    });
  });

  const pieceSetup = [
    ["black rook", "black knight", "black bishop", "black queen", "black king", "black bishop", "black knight", "black rook"],
    Array(8).fill("black pawn"),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill("white pawn"),
    ["white rook", "white knight", "white bishop", "white queen", "white king", "white bishop", "white knight", "white rook"],
  ];

  pieceSetup.forEach((rowSetup, rowIndex) => {
    describe(`Row ${rowIndex + 1}`, () => {
      rowSetup.forEach((expectedClass, colIndex) => {
        it(`Square (${rowIndex + 1}, ${colIndex + 1}) should have correct piece: ${expectedClass}`, () => {
          const row = document.querySelector(`#chessboard tr:nth-child(${rowIndex + 1})`);
          const cell = row.querySelector(`td:nth-child(${colIndex + 1})`);
          const piece = cell.querySelector(".piece");
          if (expectedClass) {
            expect(piece.className).toContain(expectedClass);
          } else {
            expect(piece).toBeNull();
          }
        });
      });
    });
  });

  it("should have alternating light and dark squares", () => {
    const squares = document.querySelectorAll("#chessboard td");
    squares.forEach((square, index) => {
      const row = Math.floor(index / 8);
      const isEven = (row + (index % 8)) % 2 === 0;
      if (isEven) {
        expect(square.classList.contains("dark")).toBe(true);
      } else {
        expect(square.classList.contains("light")).toBe(true);
      }
    });
  });

  describe("White pieces color", () => {
    it("should have a red filter for white pieces", () => {
      const whitePieces = document.querySelectorAll(".piece.white");
      whitePieces.forEach((piece) => {
        expect(window.getComputedStyle(piece).filter).toContain("invert(22%) sepia(96%) saturate(6451%) hue-rotate(0deg) brightness(102%) contrast(106%)");
      });
    });
  });

  describe("Black pieces color", () => {
    it("should have no filter for black pieces", () => {
      const blackPieces = document.querySelectorAll(".piece.black");
      blackPieces.forEach((piece) => {
        expect(piece.style.filter).toBe("");
      });
    });
  });
});
