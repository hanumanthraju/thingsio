angular.module('app.controllers')
	.controller('GraphController', function($scope, GraphIDFactory, $localStorage, GraphFactory, $stateParams, GraphOptionService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
		var gid = $stateParams.id;
		$scope.graph = {};

		function getGraphs() {
			H5_loading.show();
			GraphIDFactory.get({
				id: gid
			}).$promise.then(function(graphs) {
				H5_loading.hide();
				if (!graphs.error) {
					$scope.graph = graphs.data;
					createGraph();
					initializeTime($scope.graph.conf)
				}
				console.log(graphs);
			})
		}
		$scope.timeStamp = {
			start: null,
			end: null
		}

		function toIso3(s) {
			var dd = s.split(" ");
			var dar = dd[0].split("/");
			var xs = dar[1] + "/" + dar[0] + "/" + dar[2] + " " + dd[1];

			return xs;
		}

		function initializeTime(form) {
			if (form.last_record) var m = moment().startOf('day').add(1, 'days');
			else var m = moment();
			var ets = m.format("DD/MM/YYYY HH:mm");
			var sts = m.subtract(form.default_days, 'days').format("DD/MM/YYYY HH:mm");
			$scope.timeStamp.start = sts;
			$scope.timeStamp.end = ets;
		}

		function redo(s) {
			for (var k = 0; k < $scope.chart.graph_data.length; k++) {
				var values = ($scope.chart.graph_data[k].values);
				var new_values = {};
				for (var i = 0; i < values.length; i++) {
					var month = moment(values[i][0]).startOf(s).format("x");
					if (new_values[month]) new_values[month] = new_values[month] + values[i][1];
					else new_values[month] = values[i][1]
				}

				$scope.chart.graph_data[k].values = [];
				for (var key in new_values) {
					if (new_values.hasOwnProperty(key)) {
						$scope.chart.graph_data[k].values.push([parseInt(key), new_values[key]])
					}
				}

			}
		}
		$scope.changeDm = function() {
			$scope.chart.showg = false;

			if ($scope.pdm == "weekly") {
				redo('day')
			}
			if ($scope.pdm == "monthly") {
				redo('month');
				$scope.chart.graph_option.chart.xAxis.tickFormat = function(d) {
					return d3.time.format("%m/%Y")(new Date(d))
				}
			}
			if ($scope.pdm == "yearly") {
				redo('year');
				$scope.chart.graph_option.chart.xAxis.tickFormat = function(d) {
					return d3.time.format("%Y")(new Date(d))
				}
			}

			$scope.chart.showg = true;

		}

		$scope.pdm = "weekly";
		$scope.dm = ["weekly", "monthly", "yealy"];
		$scope.setDateTime = function() {

			var ts = {};
			ts.start = toIso3($scope.timeStamp.start);
			ts.end = toIso3($scope.timeStamp.end);
			$scope.graph.conf.customTime = true;
			$scope.graph.conf.ets = (moment(ts.end).format("x"));
			$scope.graph.conf.sts = (moment(ts.start).format("x"));
			createGraph()

		}

		function createGraph() {
			$scope.chart = {};
			var form = $scope.graph.conf;
			GraphOptionService.prepareOption(form);
			$scope.chart.graph_option = (GraphOptionService.getOption());
			$scope.chart.form = form;
			$scope.chart.showg = false;
			GraphDataService.createQuery(form);
			GraphDataService.getData(form).then(function(data) {
				$scope.chart.graph_data = GraphDataService.parseData(form, data);
				$scope.chart.graph_data = GraphDataService.formatData(form, $scope.chart.graph_data);
				$scope.chart.showg = true;
			})
		}

		$scope.printElem = function() {
			var elem = "pageg";
			var mywindow = window.open('', 'PRINT', 'height=400,width=600');

			mywindow.document.write('<html><head><title>' + document.title + '</title>');
			mywindow.document.write('</head><body >');
			mywindow.document.write('<h1>' + document.title + '</h1>');
			mywindow.document.write(document.getElementById(elem).innerHTML);
			mywindow.document.write('</body></html>');

			mywindow.document.close(); // necessary for IE >= 10
			mywindow.focus(); // necessary for IE >= 10*/

			mywindow.print();
			mywindow.close();

			return true;
		}
		getGraphs()
	})
