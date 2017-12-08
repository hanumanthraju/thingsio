 angular.module('app.dashboard')
 	.controller('DashboardController', function($scope, $localStorage, GraphFactory, GraphOptionService, ModalService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
 		var forms = []
 		$scope.graphs = [];

 		function getGraphs() {
 			GraphFactory.get().$promise.then(function(graphs) {
 				console.log(graphs);
 				if (!graphs.error)
 					for (var i = 0; i < graphs.data.length; i++) forms.push(graphs.data[i].conf);

 				popandload();
 			})

 		}

 		function popandload() {
 			if (forms.length == 0) {
 				return;
 			} else {

 				var form = forms[0];
 				GraphOptionService.prepareOption(form);
 				var g = {};
 				g.graph_option = (GraphOptionService.getOption());
 				g.form = form;
 				g.showg = false;
 				GraphDataService.createQuery(form);
 				GraphDataService.getData().then(function(data) {
 					g.graph_data = GraphDataService.parseData(form, data);
 					g.graph_data = GraphDataService.formatData(form, g.graph_data);
 					g.showg = true;
 					$scope.graphs.push(g)
 					forms.splice(0, 1);
 					popandload()
 				})
 			}
 		}
 		getGraphs()
 		//popandload();

 	});
