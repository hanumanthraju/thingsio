 angular.module('app.dashboard')
 	.controller('DashboardController', function($scope, $localStorage, GraphFactory, GraphOptionService, ModalService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
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
 		getGraphs()
 		//popandload();

 	});
