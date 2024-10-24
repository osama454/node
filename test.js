// test.js
const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    if (document.readyState != "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
  });
});

describe('Discrete Math Graph Visualizations', () => {
  test('getRandomInt returns integer within specified range', () => {
    const min = 5;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const value = window.getRandomInt(min, max);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
  });

  test('generateRandomGraph returns graph with correct number of nodes and edges', () => {
    const numNodes = 6;
    const numEdges = 10;
    const graph = window.generateRandomGraph(numNodes, numEdges);

    expect(graph.nodes.length).toBe(numNodes);
    expect(graph.edges.length).toBe(numEdges);

    // Check that there are no self-loops
    graph.edges.forEach(edge => {
      expect(edge.from).not.toBe(edge.to);
    });
  });

  test('transposeGraph reverses the edges of the graph', () => {
    // Create a test graph
    const graph = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      edges: [
        { from: 0, to: 1, arrows: 'to' },
        { from: 1, to: 2, arrows: 'to' },
      ],
    };

    const transposed = window.transposeGraph(graph);

    expect(transposed.edges.length).toBe(graph.edges.length);

    for (let i = 0; i < graph.edges.length; i++) {
      expect(transposed.edges[i].from).toBe(graph.edges[i].to);
      expect(transposed.edges[i].to).toBe(graph.edges[i].from);
    }
  });

  test('colorGraph assigns colors such that adjacent nodes have different colors', () => {
    // Create a test graph
    const graph = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      edges: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
        { from: 0, to: 2 },
      ],
    };

    const coloredNodes = window.colorGraph(graph);

    // Map node ids to colors
    const nodeColors = {};
    coloredNodes.forEach(node => {
      nodeColors[node.id] = node.color;
    });

    // Check that adjacent nodes have different colors
    graph.edges.forEach(edge => {
      expect(nodeColors[edge.from]).not.toBe(nodeColors[edge.to]);
    });
  });

  test('Graph containers exist in the document', () => {
    expect(document.getElementById('directedGraph')).not.toBeNull();
    expect(document.getElementById('transposedGraph')).not.toBeNull();
    expect(document.getElementById('coloredGraph')).not.toBeNull();
  });
});
