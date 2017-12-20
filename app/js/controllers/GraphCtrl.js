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
					createGraph('none');
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

		function redo(s, graph_data, graph_option) {

			if (s == "none") return {
				d: graph_data,
				o: graph_option
			};
			for (var k = 0; k < graph_data.length; k++) {
				var values = (graph_data[k].values);
				var new_values = {};
				for (var i = 0; i < values.length; i++) {
					var month = moment(values[i][0]).startOf(s).format("x");
					if (new_values[month]) new_values[month] = new_values[month] + values[i][1];
					else new_values[month] = values[i][1]
				}
				console.log(new_values);
				graph_data[k].values = [];
				for (var key in new_values) {
					if (new_values.hasOwnProperty(key)) {
						graph_data[k].values.push([parseInt(key), new_values[key]])
					}
				}

			}
			if (s == "day") graph_option.chart.xAxis.tickFormat = function(d) {
				return d3.time.format("%d/%m/%Y")(new Date(d))
			}
			if (s == "week") graph_option.chart.xAxis.tickFormat = function(d) {
				var ds = new Date(d);
				ds.setDate(ds.getDate() + 7);
				return d3.time.format("%d/%m/%Y")(new Date(d)) + '-' + d3.time.format("%d/%m/%Y")(ds)
			}
			if (s == "month") graph_option.chart.xAxis.tickFormat = function(d) {
				return d3.time.format("%m/%Y")(new Date(d))
			}
			if (s == "year") graph_option.chart.xAxis.tickFormat = function(d) {
				return d3.time.format("%Y")(new Date(d))
			}
			return {
				d: graph_data,
				o: graph_option
			};
		}
		$scope.changeDm = function() {

			createGraph($scope.pdm)
		}

		$scope.pdm = "none";
		$scope.dm = ["none", "day", "week", "month", "year"];
		$scope.setDateTime = function() {

			var ts = {};
			ts.start = toIso3($scope.timeStamp.start);
			ts.end = toIso3($scope.timeStamp.end);
			$scope.graph.conf.customTime = true;
			$scope.graph.conf.ets = (moment(ts.end).format("x"));
			$scope.graph.conf.sts = (moment(ts.start).format("x"));
			$scope.graph.conf.default_days = ((parseInt($scope.graph.conf.ets) - parseInt($scope.graph.conf.sts)) / 86400000);
			createGraph($scope.pdm)

		}
		var options = null;
		var gdata = null;

		function setForGraph(option, data) {
			//	console.log(option.chart.xAxis.tickFormat);
			$scope.chart.graph_option = option;
			$scope.chart.graph_data = data;
			$scope.chart_api.refresh();
		}

		function createGraph(type) {
			$scope.chart = {};
			var form = $scope.graph.conf;
			GraphOptionService.prepareOption(form);
			var op1 = GraphOptionService.getOption();
			$scope.chart.form = form;
			$scope.chart.showg = false;
			GraphDataService.createQuery(form);
			GraphDataService.getData(form).then(function(data) {
				console.log(data);
				var dp1 = GraphDataService.formatData(form, GraphDataService.parseData(form, data))
				$scope.chart.showg = true;
				var g = redo(type, dp1, op1)
				setForGraph(g.o, g.d)
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
