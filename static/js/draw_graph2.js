window.onload = function() {
    
    var numberofpublications = []
    var nameofauthors = []
							
	
    var name = $('li#name').text().substring(6);
    
    // id of Cytoscape Web container div
    var div_id = "cytoscapeweb";

                // NOTE: - the attributes on nodes and edges
                //       - it also has directed edges, which will automatically display edge arrows
								/*	data = {
											nodes: [ { id: "1", label: String(nameofauthors[0]), foo: "Is this the real life?" },
															{ id: "2", label: String(nameofauthors[0]), foo: "Is this the real life?" },
											],
											edges: [ { id: "2to1", target: "2", source: "1", label: "2 to 1", bar: "Caught in a landslide..." }
											]
                                     }*/
    
    var data = {}
    var node_list = []
    var edge_list = []
    var center_node = { id: "0", label: name, foo: null }
    node_list.push(center_node)
    var l = 0
    
    for(var i = 0; i < 50; i++){
        var node = {}
        var edge = {}
        node['id'] = String(i + 1)
        node['label'] = String(x[i])
        node['foo'] = null
        edge['id'] = (i + 1) + "to0"
        edge['target'] = String(0)
        edge['source'] = String(i+1)
        edge['directed'] = false
        edge['label'] = null
        edge['bar'] = null

        node_list.push(node)
        edge_list.push(edge)
    }
    data['nodes'] = node_list
    data['edges'] = edge_list
    
    /*
    data = {
        nodes: [ { id: "1", label: "bio", foo: "Is this the real life?" },{ id: "2", label: String(nameofauthors[0]), foo: "Is this the real life?" },{ id: "3", label: String(nameofauthors[0]), foo: "Is this the real life?" },{ id: "4", label: String(nameofauthors[0]), foo: "Is this the real life?" }],
        edges: [ { id: "2to1", target: "1", source: "2", label: "2 to 1", bar: "Caught in a landslide..." },{ id: "2to1", target: "1", source: "3", label: "2 to 1", bar: "Caught in a landslide..." },{ id: "2to1", target: "1", source: "4", label: "2 to 1", bar: "Caught in a landslide..." }]
    }*/


                                  


                                    var network_json = {
                                     dataSchema: {
                                        nodes: [ { name: "label", type: "string" },
                                        { name: "foo", type: "string" }
                                        ],
                                        edges: [ { name: "label", type: "string" },
                                        { name: "bar", type: "string" }
                                        ]
                                    },
                        // NOTE the custom attributes on nodes and edges
                        data: data
                    };

                    function rand_color() {
                        function rand_channel() {
                            return Math.round( Math.random() * 255 );
                        }

                        function hex_string(num) {
                            var ret = num.toString(16);

                            if (ret.length < 2) {
                                return "0" + ret;
                            } else {
                                return ret;
                            }
                        }

                        var r = rand_channel();
                        var g = rand_channel();
                        var b = rand_channel();

                        return "#" + hex_string(r) + hex_string(g) + hex_string(b);
                    }

                // visual style we will use
                var visual_style = {
                    global: {
                        backgroundColor: "#ABCFD6"
                    },
                    nodes: {
                        shape: "CIRCLE",
                        borderWidth: 3,
                        borderColor: "#ffffff",
                        size: {
                            defaultValue: 25,
                            continuousMapper: { attrName: "weight", minValue: 25, maxValue: 75 }
                        },
                        color: {
                            discreteMapper: {
                                attrName: "id",
                                entries: [
                                
                                { attrValue: 0, value: "#9A0B0B" }
                                
                                ]
                            }
                        },
                        labelHorizontalAnchor: "center"
                    },
                    edges: {
                        width: 3,
                        
                        color: "#0B94B1"
                    }
                };

                // initialization options
                var options = {
                    swfPath: "{{=URL('static','/swf/CytoscapeWeb')}}",
                    flashInstallerPath: "{{=URL('static','/swf/playerProductInstall')}}"
                };

                var vis = new org.cytoscapeweb.Visualization(div_id, options);

                vis.ready(function() {
                    // set the style programmatically
                    document.getElementById("color").onclick = function(){
                        visual_style.global.backgroundColor = rand_color();
                        vis.visualStyle(visual_style);
                    };
                });

                var draw_options = {

										// your data goes here
								

                    network: network_json,

                    // show edge labels too
                    edgeLabelsVisible: true,

                    // let's try another layout
                    layout: "Radial",

                    // set the style at initialisation
                    visualStyle: visual_style,

                    // hide pan zoom
                    panZoomControlVisible: true
                };

                vis.draw(draw_options);
            };
