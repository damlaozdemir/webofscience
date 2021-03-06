// Generated by CoffeeScript 1.4.0
(function() {
  var R, d3cola, enter_nodes, graph, height, l, links, n, nodes, svg, width, _i, _j, _len, _len1, _ref, _ref1;
var numberofpublications = []
    var nameofauthors = []
              
  
    var name = $('li#name').text().substring(6);
    
    // id of Cytoscape Web container div
    var div_id = "cytoscapeweb";

                // NOTE: - the attributes on nodes and edges
                //       - it also has directed edges, which will automatically display edge arrows
                /*  data = {
                      nodes: [ { id: "1", label: String(nameofauthors[0]), foo: "Is this the real life?" },
                              { id: "2", label: String(nameofauthors[0]), foo: "Is this the real life?" },
                      ],
                      edges: [ { id: "2to1", target: "2", source: "1", label: "2 to 1", bar: "Caught in a landslide..." }
                      ]
                                     }*/
    
    var data = {}
    var node_list = []
    var edge_list = []
    var center_node = { id: String(name)}
    node_list.push(center_node)
    
    for(var i = 0; i < 50; i++){
        var nodes = {}
        var links = {}
        nodes['id'] = String(x[i])
        
        links['id'] = (i + 1) + "to0"
        links['target'] = String(name)
        links['source'] = String(x[i])
        
        

        node_list.push(nodes)
        edge_list.push(links)
    }
    data['nodes'] = node_list
    data['links'] = edge_list
    
    
    graph = data
  

  /* objectify the graph
  */


  /* resolve node IDs (not optimized at all!)
  */


  _ref = graph.links;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    l = _ref[_i];
    _ref1 = graph.nodes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      n = _ref1[_j];
      if (l.source === n.id) {
        l.source = n;
      }
      if (l.target === n.id) {
        l.target = n;
      }
    }
  }

  R = 18;

  svg = d3.select('svg');

  width = svg.node().getBoundingClientRect().width;

  height = svg.node().getBoundingClientRect().height;

  /* create nodes and links
  */


  links = svg.selectAll('.link').data(graph.links, function(d) {
    return d.id;
  });

  links.enter().append('line').attr('class', 'link');

  nodes = svg.selectAll('.node').data(graph.nodes, function(d) {
    return d.id;
  });

  enter_nodes = nodes.enter().append('g').attr('class', 'node');

  enter_nodes.append('circle').attr('r', R);

  /* draw the label
  */


  enter_nodes.append('text').text(function(d) {
    return d.id;
  }).attr('dy', '0.35em');

  /* cola layout
  */


  graph.nodes.forEach(function(v) {
    v.width = 2.5 * R;
    return v.height = 2.5 * R;
  });

  d3cola = cola.d3adaptor().size([width, height]).linkDistance(100).avoidOverlaps(true).nodes(graph.nodes).links(graph.links).on('tick', function() {
    /* update nodes and links
    */
    nodes.attr('transform', function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    return links.attr('x1', function(d) {
      return d.source.x;
    }).attr('y1', function(d) {
      return d.source.y;
    }).attr('x2', function(d) {
      return d.target.x;
    }).attr('y2', function(d) {
      return d.target.y;
    });
  });

  enter_nodes.call(d3cola.drag);

  d3cola.start(30, 30, 30);

}).call(this);