angular.module('app.controllers')
	.controller('GraphController', function($scope, GraphIDFactory, NgTableParams, $localStorage, GraphFactory, AlertService, $stateParams, GraphOptionService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
		var gid = $stateParams.id;
		$scope.graph = {};
		$scope.view = [true, false];
		$scope.changeview = function(i) {
			$scope.view = [false, false];
			$scope.view[i] = true;
		}



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
					if ($scope.graph.conf.filedsx[0].prop == "dts" && $scope.graph.conf.filedsy[0].prop != "dts") setDateString($scope.graph.conf.x_transformation.d);
					else if ($scope.graph.conf.filedsx[0].prop != "dts" && $scope.graph.conf.filedsy[0].prop == "dts") setDateString($scope.graph.conf.y_transformation.d);

				}
				console.log(graphs);
			})
		}
		$scope.timeStamp = {
			start: null,
			end: null
		}
		$scope.deleteGraph = function() {

			AlertService.confirm("Delete Graph", "Are you sure you want to delete this graph").then(function() {
				H5_loading.show();
				GraphIDFactory.delete({
					id: gid
				}).$promise.then(function() {
					H5_loading.hide();
					$state.go("app.dashboard")
				})
			})
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

		function setDateString(s) {
			$scope.dateString = "";
			$scope.dateString = s.replace(/%Y/g, "YYYY");
			$scope.dateString = $scope.dateString.replace(/%d/g, "DD");
			$scope.dateString = $scope.dateString.replace(/%m/g, "MM");
			$scope.dateString = $scope.dateString.replace(/%H/g, "HH");
			$scope.dateString = $scope.dateString.replace(/%M/g, "mm");
		}
		$scope.dateString = "";

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
			if (s == "day") {
				$scope.dateString = "DD/MM/YYYY";
				graph_option.chart.xAxis.tickFormat = function(d) {
					return d3.time.format("%d/%m/%Y")(new Date(d))

				}
			}
			if (s == "week") {
				$scope.dateString = "w";
				graph_option.chart.xAxis.tickFormat = function(d) {
					var ds = new Date(d);
					ds.setDate(ds.getDate() + 7);
					return d3.time.format("%d/%m/%Y")(new Date(d)) + '-' + d3.time.format("%d/%m/%Y")(ds)
				}
			}
			if (s == "month") {
				$scope.dateString = "MM/YYYY";
				graph_option.chart.xAxis.tickFormat = function(d) {
					return d3.time.format("%m/%Y")(new Date(d))
				}
			}
			if (s == "year") {
				$scope.dateString = "YYYY";
				graph_option.chart.xAxis.tickFormat = function(d) {
					return d3.time.format("%Y")(new Date(d))
				}
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

		function createUsingFullOptions(data) {
			var initialParams = {
				count: 20,
				sorting: {
					t: "desc"
				} // initial page size
			};
			var initialSettings = {
				// page size buttons (right set of buttons in demo)
				counts: [],
				// determines the pager buttons (left set of buttons in demo)
				paginationMaxBlocks: 13,
				paginationMinBlocks: 2,
				dataset: data
			};
			return new NgTableParams(initialParams, initialSettings);
		}

		$scope.CSVFn = function(v) {
			for (var i = 0; i < v.length; i++) {
				if ($scope.graph.conf.filedsx[0].prop == "dts" && $scope.graph.conf.filedsy[0].prop != "dts") {
					v[i][0] = moment(v[i][0]).format($scope.dateString);
				} else if ($scope.graph.conf.filedsx[0].prop != "dts" && $scope.graph.conf.filedsy[0].prop == "dts") {
					v[i][1] = moment(v[i][1]).format($scope.dateString);
				}
			}
			return v;
		}

		function setForTable(ds) {
			var tbl = [];
			for (var i = 0; i < ds.length; i++) {
				tbl.push({
					t: ds[i][0],
					d: ds[i][1]
				})
			}
			return tbl;
		}

		function setForGraph(option, data) {
			//	console.log(option.chart.xAxis.tickFormat);
			$scope.chart.graph_option = option;
			$scope.chart.graph_data = data;
			$scope.chart_api.refresh();
			$scope.tableParams = createUsingFullOptions(setForTable($scope.chart.graph_data[0].values));
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
				//console.log(data);
				var dp1 = GraphDataService.formatData(form, GraphDataService.parseData(form, data))
				$scope.chart.showg = true;
				var g = redo(type, dp1, op1)
				setForGraph(g.o, g.d)
			})
		}

		$scope.printElem = function(i) {
			H5_loading.show();

			$timeout(function() {
				$scope.changeview(i);
				$timeout(function() {
					H5_loading.hide();
					window.print();
				}, 3000)
			})

			// setTimeout(function() {
			// 	H5_loading.hide();
			// 	window.print();
			// }, 3000);

		}
		getGraphs()
	})
