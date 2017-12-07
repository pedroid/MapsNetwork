cytoscape({
  container: document.getElementById('cy'),
  
  layout: {
    name: 'dagre',
    padding: 10
  },
  
  boxSelectionEnabled: false,
  autounselectify: true,

  style: [
    {
      selector: 'node',
      css: {
        'shape': 'data(shape)',
        'content': 'data(label)',
        'color': 'white',
        'text-outline-width': 2,
        'text-outline-color': 'grey',
        'text-valign': 'center',
        'text-halign': 'center'
      }
    },
    {
      selector: '$node > node',
      css: {
        'padding-top': '10px',
        'padding-left': '10px',
        'padding-bottom': '10px',
        'padding-right': '10px',
        'text-valign': 'top',
        'text-halign': 'center',
        'background-color': '#bbb'
      }
    },
	
    {
      selector: 'edge',
      css: {
		  /*
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle'
      */
	        'curve-style': 'bezier',
      'opacity': 0.666,
      // 'width': 'mapData(strength, 70, 100, 2, 6)',
      'target-arrow-shape': 'triangle',
      'source-arrow-shape': 'circle',
      'line-color': 'orange',
      'source-arrow-color': 'orange',
      'target-arrow-color': 'orange',
      label: 'data(label)'
	  }
    },
    {
      selector: ':selected',
      css: {
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      }
    }
  ],

  elements: {
    nodes: [
      { data: { id: '1', label: 'Graph Input 1', shape: 'roundrectangle' } },
      { data: { id: '2', label: 'x+y=z x1', shape: 'rectangle' } },
      { data: { id: '3', label: 'Graph Output 1', shape: 'roundrectangle' } },
	   { data: { id: '4', label: 'Graph Output 1', shape: 'roundrectangle' } }
    ],
    edges: [
      { data: { source: '1', target: '2' ,label:'route NTHU_NCTU'} },
	  { data: { source: '2', target: '1'} },
      { data: { source: '2', target: '3' } },
	  { data: { source: '2', target: '4' } }
    ]
  },
  
  ready: function() {
    window.cy = this;
    //startWebSocket();
  }
});

function CreateNode(nodeId, name) {
  cy.add({
    group: 'nodes',
    data: { id: nodeId, label: name }
  });
}

function CreateEdge(firstNodeId, secondNodeId, edgeId, name) {
  if (edgeId === '0') {
    edgeId = undefined;
  }

  cy.add({
    group: 'edges',
    data: { id: edgeId, source: firstNodeId, target: secondNodeId, label:name }
  });
}

function ChangeColor(nodeId, color) {
  cy.getElementById(nodeId).style('color', color);
}

function ChangeName(nodeId, name) {
  cy.getElementById(nodeId).data('label', name);
}