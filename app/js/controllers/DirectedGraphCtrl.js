angular.module('app.controllers')
	.controller('DirectedController', function($scope, $rootScope, $http, $localStorage, SitesFactory, $state, $timeout, Colors) {

		$scope.loadDirectedSites = function() {
			$scope.sites = [];
			$scope.data = {};
			SitesFactory.get({
				details: 'high'
			}).$promise.then(function(sites) {
				if (!sites.error) {
					$scope.sites = sites.data;
					formatGrapData(sites.data);
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

				$scope.data.nodes.push({
					id: 'Site ' + $scope.sites[i].site_id,
					name: $scope.sites[i].name,
					group: 1
				})
				var so = $scope.data.nodes.length - 1;
				for (var j = 0; j < $scope.sites[i].devices.length; j++) {
					var d = $scope.sites[i].devices[j];
					$scope.data.nodes.push({
						id: 'Device ' + d.device_id,
						name: d.name,
						group: 2
					});
					var dos = $scope.data.nodes.length - 1;
					$scope.data.links.push({
						source: so,
						target: dos,
						value: 20
					});

					for (var k = 0; k < d.slaves.length; k++) {
						var s = d.slaves[k];
						$scope.data.nodes.push({
							id: 'Slave ' + s,
							name: 'Slave ' + s,
							group: 3
						})
						var co = $scope.data.nodes.length - 1;
						$scope.data.links.push({
							source: dos,
							target: co,
							value: 5
						});
						offset = offset + 1;
					}
				}
			}
			console.log($scope.data.links);
			renderGraph()
		}

		function renderGraph() {
			var color = d3.scale.category10();
			$scope.options = {
				chart: {
					type: 'forceDirectedGraph',
					height: 600,
					width: (function() {
						return nv.utils.windowSize().width - 110
					})(),
					margin: {
						top: 20,
						right: 20,
						bottom: 20,
						left: 20
					},
					color: function(d) {
						return color(d.group)
					},
					nodeExtras: function(node) {
						node && node
							.append("text")
							.attr("dx", 10)
							.attr("dy", ".40em")
							.style('font-size', '16px')
							.text(function(d) {
								return d.name
							});
					}
				}
			};
			$scope.shw = true;
		}
	});
