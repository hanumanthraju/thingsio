angular.module('app.controllers')
    .controller('DirectedController', function($scope, $rootScope, $http, $localStorage, SitesFactory, $state, $timeout, Colors) {

        $scope.loadDirectedSites = function() {
            $scope.sites = [];
            $scope.data = {};
            SitesFactory.get({ details: 'high' }).$promise.then(function(sites) {
                if (!sites.error) {
                    $scope.sites = sites.data;
                    formatGrapData(sites.data);
                    //initializeDrag();
                    renderGrapWithDragAndDrop($scope.data);
                    console.log('DirectedController sites', $scope.sites);
                }
            })
        }
        $scope.loadDirectedSites();

        function formatGrapData(sitesData) {
            $scope.data = {
                nodes: [],
                links: []
            }
            var offset = 0;
            var nof = 0;
            for (var i = 0; i < $scope.sites.length; i++) {

                $scope.data.nodes.push({ id: 'Site' + $scope.sites[i].site_id, name: $scope.sites[i].name, group: 'Sites' })
                var so = $scope.data.nodes.length - 1;
                for (var j = 0; j < $scope.sites[i].devices.length; j++) {
                    var d = $scope.sites[i].devices[j];
                    $scope.data.nodes.push({ id: 'Device' + d.device_id, name: d.name, group: 'Devices' });
                    var dos = $scope.data.nodes.length - 1;
                    $scope.data.links.push({ source: so, target: dos, value: 20 });

                    for (var k = 0; k < d.slaves.length; k++) {
                        var s = d.slaves[k];
                        $scope.data.nodes.push({ id: 'Slave' + s, name: 'Slave' + s, group: 'Slaves' })
                        var co = $scope.data.nodes.length - 1;
                        $scope.data.links.push({ source: dos, target: co, value: 5 });
                        offset = offset + 1;
                    }
                }
            }

            console.log($scope.data.links);
            renderGraph();
            //initializeDrag();
        }

    function renderGraph() {
            var color = d3.scale.category20();
            $scope.options = {
                chart: {
                    type: 'forceDirectedGraph',
                    height: 600,
                    width:916,
                    //width: (function() { return nv.utils.windowSize().width - 210 })(),
                    margin: { top: 20, right: 20, bottom: 20, left: 20 },
                    linkStrength: 0.1,
                    friction: 0.9,
                    linkDist: 30,
                    charge: -120,
                    gravity: 0.1,
                    theta: 0.8,
                    alpha: 0.1,
                    radius: 10,
                    color: function(d) {
                        return color(d.group)
                    },
                    nodeExtras: function(node) {
                      node.append("text")
                        .attr("dx", 5)
                        .attr("dy", ".35em")
                        .style('font-size', '14px')
                        .text(function(d) { return d.name });
                    },
                    callback: function(chart) {
                        console.log('chart', chart);
                      //initializeDrag();
                      chart.dispatch.on('drag', function(event) {
                        console.log('event', event);
                      });
                    }
                }
            };
          $scope.shw = true;
    };

  $scope.chartApi =function(api) {
    console.log('api', api);
  } 
  function initializeDrag(){
    var force = self.force = d3.layout.force()
    var node_drag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

    //var chartContainer = document.getElementById('chart1');

    var chartContainer = d3.select("chart1");

    var node = chartContainer.selectAll("g.nv-force-node").call(node_drag);
    var link = chartContainer.selectAll("line.nv-force-link");

    function dragstart(d, i) {
      force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy; 
      tick(); // this is the key to make it work together with updating both px,py,x,y on d !
    }

    function dragend(d, i) {
      d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
      tick();
      force.resume();
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };
  }

function renderGrapWithDragAndDrop(data){
     var width = $("#graph-container").width();
    var height = window.innerHeight;

    var color = d3.scale.category20();

    var force = d3.layout.force()
      .nodes(d3.values(data.nodes))
      .links(data.links)
      .gravity(1)
      .linkDistance(100)
      .charge(-100)
      .size([width, height])
      .on("tick", tick)
      .start();

    var drag = force.drag()
      .on("dragstart", function() {
        d3.event.sourceEvent.stopPropagation();
      })
      .on("drag", dragstart);

    var svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("pointer-events", "all");

    // draw arrows
    svg.append("defs").selectAll("marker")
      .data(["fill"])
      .enter().append("marker")
      .attr("id", function(d) {
        return d;
      })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
      .style("stroke", "#4679BD")
      .style("opacity", "1");

    var link = svg.selectAll(".link")
      .data(force.links())
      .enter().append("line")
      .attr("class", "link")
      .style("marker-end", "url(#fill)"); // arrow

    var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .on("dblclick", dblclick)
      .call(force.drag);

    node.append("circle")
      .attr("r", 10)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("fill", function(d) {
        return color(d.group);
      });

    node.append("text")
      .attr("dx", 12)
      .attr("dy", "0.35em")
      .text(function(d) {
        return d.name;
      });

    var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        if (d !== undefined) {
          return d;
        }
      });

    function dblclick(d) {
      d3.select(this)
        .classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
      d3.select(this)
        .classed("fixed", d.fixed = true);
    }

    var padding = 50; // separation between circles
    radius = 24;

    function collide(alpha) {
      var quadtree = d3.geom.quadtree(force.nodes());

      return function(d) {
        var rb = 2 * radius + padding,
          nx1 = d.x - rb,
          nx2 = d.x + rb,
          ny1 = d.y - rb,
          ny2 = d.y + rb;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point != d)) {
            var x = d.x - quad.point.x;
            y = d.y - quad.point.y;
            l = Math.sqrt(x * x + y * y);

            if (l < rb) {
              l = (l - rb) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }

          // returns true if it should expand the boundary around the node
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    function tick() {
      link.attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      node.each(collide(0.1));
    }
  }
})