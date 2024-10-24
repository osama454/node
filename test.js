// test.js
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const htmlContent = fs.readFileSync(
  path.resolve(__dirname, "index.html"),
  "utf8"
);
const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document, createRandomGraph, transposeGraph, colorGraph, getColor;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    if (document.readyState != "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        createRandomGraph = window.createRandomGraph;
        transposeGraph = window.transposeGraph;
        colorGraph = window.colorGraph;
        getColor = window.getColor;
        done();
      });
  });

});

describe("Graph Functions", () => {
  test("createRandomGraph generates a graph with specified number of nodes and edges", () => {
    const numNodes = 5;
    const numEdges = 10;
    const graph = createRandomGraph(numNodes, numEdges);

    expect(graph.nodes.length).toBe(numNodes);
    expect(graph.edges.length).toBe(numEdges);
  });

  test("transposeGraph reverses the direction of all edges", () => {
    const graph = createRandomGraph(5, 10);
    const transposed = transposeGraph(graph);

    transposed.edges.forEach((edge, index) => {
      expect(edge.from).toBe(graph.edges[index].to);
      expect(edge.to).toBe(graph.edges[index].from);
    });
  });

  test("colorGraph assigns a color to each node without adjacent nodes sharing the same color", () => {
    const graph = createRandomGraph(5, 10);
    const coloredGraph = colorGraph(graph);

    // Check that no two adjacent nodes share the same color
    const nodeColors = new Map();
    coloredGraph.nodes.forEach((node) => {
      nodeColors.set(node.id, node.color);
    });

    coloredGraph.edges.forEach((edge) => {
      expect(nodeColors.get(edge.from)).not.toEqual(nodeColors.get(edge.to));
    });
  });

  test("createRandomGraph does not create self-loops or duplicate edges", () => {
    const numNodes = 5;
    const numEdges = 10;
    const graph = createRandomGraph(numNodes, numEdges);

    const edgeSet = new Set();

    graph.edges.forEach((edge) => {
      // Check for self-loops
      expect(edge.from).not.toEqual(edge.to);

      // Check for duplicate edges
      const edgeKey = `${edge.from}-${edge.to}`;
      expect(edgeSet.has(edgeKey)).toBe(false);
      edgeSet.add(edgeKey);
    });
  });

  test("getColor returns valid HSL color strings and colors are appropriately distributed", () => {
    const maxColor = 5; // Assume we have 6 colors (0 to 5)
    const colors = [];
    for (let color = 0; color <= maxColor; color++) {
      const hslColor = getColor(color, maxColor);
      expect(hslColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      colors.push(hslColor);
    }
    // Check that colors are different
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});
