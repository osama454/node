// Function to create a random directed graph
function createRandomGraph(numNodes, numEdges) {
  const nodes = [];
  // Create nodes with ids and labels
  for (let i = 0; i < numNodes; i++) {
    nodes.push({ id: i, label: i.toString() });
  }

  const edges = [];
  let edgeCount = 0;
  // Randomly create edges between nodes
  while (edgeCount < numEdges) {
    const from = Math.floor(Math.random() * numNodes);
    const to = Math.floor(Math.random() * numNodes);
    // Ensure no self-loops and no duplicate edges
    if (from !== to && !edges.some((e) => e.from === from && e.to === to)) {
      edges.push({ from, to, arrows: "to" }); // Add an arrow to indicate direction
      edgeCount++;
    }
  }

  return { nodes, edges };
}

// Function to transpose the graph (reverse all edge directions)
function transposeGraph(graph) {
  const transposedEdges = graph.edges.map((edge) => ({
    from: edge.to,
    to: edge.from,
    arrows: "to",
  }));
  return { nodes: graph.nodes, edges: transposedEdges };
}

// Function for chromatic coloring using a simplified greedy algorithm
function colorGraph(graph) {
  const numNodes = graph.nodes.length;
  const colors = {};
  // Initialize all node colors to 0
  for (let i = 0; i < numNodes; i++) {
    colors[i] = 0;
  }

  let maxColor = 0;
  // Assign colors to nodes
  for (let i = 0; i < numNodes; i++) {
    let usedColors = new Set();
    // Check colors of adjacent nodes
    for (let j = 0; j < graph.edges.length; j++) {
      if (graph.edges[j].from == i) {
        usedColors.add(colors[graph.edges[j].to]);
      } else if (graph.edges[j].to == i) {
        usedColors.add(colors[graph.edges[j].from]);
      }
    }
    // Find the smallest color not used by adjacent nodes
    let color = 0;
    while (usedColors.has(color)) {
      color++;
    }
    colors[i] = color; // Assign the color to the node
    maxColor = Math.max(maxColor, color); // Keep track of the maximum color used
  }

  // Apply the colors to the graph nodes
  for (let i = 0; i < numNodes; i++) {
    graph.nodes[i].color = getColor(colors[i], maxColor);
  }

  return graph;
}

// Function to generate an HSL color based on the color index
function getColor(color, maxColor) {
  let h = (color * 360) / (maxColor + 1); // Distribute hues evenly
  let s = "80%";
  let l = "50%";
  return `hsl(${h}, ${s}, ${l})`; // Return the HSL color string
}

// Generate random numbers for nodes and edges
const numNodes = Math.floor(Math.random() * 5) + 4; // Random number between 4 and 8
const numEdges = Math.floor(Math.random() * 11) + 10; // Random number between 10 and 20

// Create the initial graph data
const graphData = createRandomGraph(numNodes, numEdges);

// Options for the directed graphs (with arrows)
const directedOptions = {
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1 },
      middle: { enabled: false },
      from: { enabled: false },
    },
  },
  physics: false, // Disable physics for static layout
};

// Options for the undirected graph (no arrows)
const undirectedOptions = {
  edges: {
    arrows: {
      to: { enabled: false },
      middle: { enabled: false },
      from: { enabled: false },
    },
  },
  physics: false,
};

// Initialize the Directed Graph visualization
new vis.Network(
  document.getElementById("directedGraph"),
  graphData,
  directedOptions
);

// Initialize the Transposed Graph visualization
new vis.Network(
  document.getElementById("transposedGraph"),
  transposeGraph(graphData),
  directedOptions
);

// Prepare data for the Colored Graph by removing arrow properties
new vis.Network(
  document.getElementById("coloredGraph"),
  colorGraph({
    ...graphData,
    edges: graphData.edges.map((e) => ({ from: e.from, to: e.to })),
  }),
  undirectedOptions
);
