 angular.module('app.dashboard')
 	.controller('DashboardController', function($scope, $localStorage, GraphFactory, SitesFactory, GroupFactory, AlertService, GraphOptionService, ModalService, GraphDataService, GraphIDFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
 		var forms = []
 		$scope.graphs = [];

 		function getGraphs() {
 			GraphFactory.get({
 				type: 'groups'
 			}).$promise.then(function(graphs) {
 				console.log(graphs);
 				if (!graphs.error)
 					for (var i = 0; i < graphs.data.length; i++) {
 						var cnf = graphs.data[i].conf;
 						cnf._id = graphs.data[i]._id;
 						forms.push(cnf);
 					}

 				popandload();
 			})

 		}

 		$scope.deleteGraph = function(g) {

 			AlertService.confirm("Delete Graph", "Are you sure you want to delete this graph").then(function() {
 				H5_loading.show();
 				GraphIDFactory.delete({
 					id: g.form._id
 				}).$promise.then(function() {
 					H5_loading.hide();
 					g.del = true;
 				})
 			})
 		}

 		function popandload() {
 			if (forms.length == 0) {
 				return;
 			} else {

 				var form = forms[0];
 				console.log(form);
 				form.height = 150;
 				form.size = "small";

 				delete form.title;
 				delete form.subtitle;
 				delete form.caption;
 				GraphOptionService.prepareOption(form);
 				var g = {};
 				g.graph_option = (GraphOptionService.getOption());
 				g.form = form;
 				g.showg = false;
 				GraphDataService.createQuery(form);
 				GraphDataService.getData(form).then(function(data) {
 					g.graph_data = GraphDataService.parseData(form, data);
 					g.graph_data = GraphDataService.formatData(form, g.graph_data);
 					g.showg = true;
 					$scope.graphs.push(g)
 					forms.splice(0, 1);
 					popandload()
 				})
 			}
 		}
 		getGraphs();


 		$scope.sites = [];
 		$scope.groups = [];
 		$scope.form = {};

 		function loadSites() {
 			$scope.sites = [];
 			H5_loading.show();
 			SitesFactory.get().$promise.then(function(sites) {
 				H5_loading.hide();
 				if (!sites.error) {
 					$scope.sites.push.apply($scope.sites, sites.data);
 					$scope.sites.unshift({
 						name: "All Sites",
 						site_id: -1
 					});
 					$scope.form.site = $scope.sites[0]
 				}
 			})
 		}

 		function loadMyGroups() {
 			H5_loading.show();
 			GroupFactory.get().$promise.then(function(groups) {
 				H5_loading.hide();
 				if (!groups.error) {
 					$scope.groups.push.apply($scope.groups, groups.data);
 					$scope.groups.unshift({
 						group_name: "All Groups",
 						_id: -1
 					});
 					$scope.form.group = $scope.groups[0]
 				}
 			})
 		}
 		loadMyGroups();
 		loadSites();
 		//popandload();

 	});
