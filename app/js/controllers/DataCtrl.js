angular.module('app.controllers')
	.controller('CreateGraphCtrl', function($scope, $localStorage, GraphOptionService, GraphFactory, GroupFactory, ModalService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
		$scope.yTransformation = GraphOptionService.yTransformation();
		$scope.xTransformation = GraphOptionService.xTransformation();
		$scope.form = {
			property_x: "dts",
			zoom: false,
			xy: "single",
			xy_y: "single",
			xy_x: "single",
			graph: "lineChart",
			combined: true,
			default_days: 7,
			last_record: false,
			size: "large",
			numyv: 1,
			numxv: 1,
			y_transformation: $scope.yTransformation[0],
			x_transformation: $scope.xTransformation[0]
		}
		$scope.operators = ["/", "*", "+", "-"];
		$scope.form.filedsy = [];
		$scope.form.filedsx = [];
		$scope.fileds_arr = [];
		$scope.addAFiled = function() {
			$scope.fileds_arr.push({})
		}
		$scope.getNumber = function(num) {
			$scope.form.filedsy = [];
			for (var i = 0; i < num; i++) $scope.form.filedsy.push({
				op: $scope.operators[0],
				prop: $scope.prop_str_y[0]
			})
		}
		$scope.getNumberX = function(num) {
			$scope.form.filedsx = [];
			for (var i = 0; i < num; i++) $scope.form.filedsx.push({
				op: $scope.operators[0],
				prop: $scope.prop_str_x[0]
			})
		}
		$scope.changeYformula = function() {
			if ($scope.form.xy_y == 'single') $scope.form.xy_y = 'formula';
			else if ($scope.form.xy_y == 'formula') {
				$scope.form.xy_y = 'single';
				$scope.form.numyv = 1;
				$scope.getNumber($scope.form.numyv);
			}
		}
		$scope.changeXformula = function() {
			if ($scope.form.xy_x == 'single') $scope.form.xy_x = 'formula';
			else if ($scope.form.xy_x == 'formula') {
				$scope.form.xy_x = 'single';
				$scope.form.numxv = 1;
				$scope.getNumberX($scope.form.numxv);
			}
		}
		$scope.onlyTimeY = function(p) {
			if (p == "dts") {
				$scope.form.filedsy = [{
					op: $scope.operators[0],
					prop: "dts"
				}];
				$scope.form.numyv = 1;
				$scope.form.xy_y = 'single'
			}
		}
		$scope.onlyTimeX = function(p) {
			if (p == "dts") {
				$scope.form.filedsx = [{
					op: $scope.operators[0],
					prop: "dts"
				}];
				$scope.form.numxv = 1;
				$scope.form.xy_x = 'single'
			}
		}
		$scope.preview = function() {
			if (!$scope.form.combined && $scope.form.devices.device_id == 0) $scope.form.gDevices = $scope.devices;
			if ($scope.form.graph == 'pieChart') {
				$scope.form.combined = false;
				$scope.form.devices = $scope.devices[0];
			}
			$scope.form.groups = [];
			for (var i = 0; i < $scope.form.t_groups.length; i++) {
				$scope.form.groups[i] = $scope.form.t_groups[i]._id;
			}
			console.log($scope.form);
			ModalService.graphPreview($scope.form);
		}

		function getDevices(gid) {
			$scope.devices = [{
				name: "All Devices",
				device_id: 0
			}];
			DeviceFactory.get({
				site_id: gid
			}).$promise.then(function(data) {

				var devices = data.data;
				for (var i = 0; i < devices.length; i++) $scope.devices.push(devices[i]);
				$scope.form.devices = $scope.devices[0];
				getSlaves($scope.form.devices);
			})
		}

		function getSlaves(dev) {
			var slave_ids = [];
			if (dev) {
				if (dev.device_id == 0) {
					for (var i = 1; i < $scope.devices.length; i++) slave_ids.push.apply(slave_ids, $scope.devices[i].slaves);
					$scope.form.combined = true;
				} else {
					slave_ids = dev.slaves;
					$scope.form.combined = false;
				}
			}
			slave_ids = slave_ids.filter(function(item, pos) {
				return slave_ids.indexOf(item) == pos;
			})
			expandSlave(slave_ids)
		}

		function expandSlave(slave_ids) {
			$scope.slaves = [{
				name: "All Slaves",
				slave_id: 0
			}];
			SearchFactory.query({
				table: "slaves",
				filter: {
					slave_id: {
						$in: slave_ids
					}
				}
			}).$promise.then(function(slaves_full) {
				console.log(slaves_full);
				if (!slaves_full.error) {
					for (var i = 0; i < slaves_full.data.length; i++) $scope.slaves.push(slaves_full.data[i]);
					$scope.form.slaves = $scope.slaves[0];
					$scope.expandProperties($scope.form.slaves);
					$scope.getNumber($scope.form.numyv);
					$scope.getNumberX($scope.form.numxv);
				}

			})
		}
		var properties = [];

		$scope.expandProperties = function(sls) {
			properties = [];

			$scope.prop_str_y = [];
			$scope.prop_str_x = [];
			if (sls) {
				if (sls.slave_id == 0)
					for (var i = 1; i < $scope.slaves.length; i++) properties.push.apply(properties, $scope.slaves[i].props);
				else properties = sls.props
			}
			var prop_str = [];
			for (var i = 0; i < properties.length; i++) {
				if (prop_str.indexOf(properties[i].name) == -1)
					prop_str.push(properties[i].name)
			}

			$scope.prop_str_y = prop_str;
			$scope.form.property_y = $scope.prop_str_y[0]

			$scope.prop_str_x = prop_str;



		}
		$scope.fetchSlaves = function() {
			getSlaves($scope.form.devices);
		}

		function loadSites() {
			$scope.sites = [];
			H5_loading.show();
			SitesFactory.get().$promise.then(function(sites) {
				H5_loading.hide();
				if (!sites.error) {
					$scope.sites = sites.data;
				}
			})
		}
		$scope.fetchDevices = function() {
			getDevices($scope.form.site.site_id)
			getGroups($scope.form.site.site_id)
		}

		function getGroups(site_id) {
			GroupFactory.get({
				site_id: site_id
			}).$promise.then(function(groups) {
				if (!groups.error) {
					$scope.groups = groups.data;
				}
			})
		}
		loadSites();


	}).controller('GraphPreviewCtrl', function($scope, data, $localStorage, GraphFactory, GraphOptionService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
		$scope.graph_option = {};
		$scope.form = data;
		$scope.preview = function() {

			$scope.showg = false;
			if ($scope.clearAPI) $scope.clearAPI.clearElement();
			$scope.graph_option = {};
			$scope.graph_data = [];
			GraphOptionService.prepareOption($scope.form);
			$scope.graph_option = (GraphOptionService.getOption());
			GraphDataService.createQuery($scope.form);

			GraphDataService.getData($scope.form).then(function(data) {

				$scope.graph_data = GraphDataService.parseData($scope.form, data);
				$scope.graph_data = GraphDataService.formatData($scope.form, $scope.graph_data);
				$scope.showg = true;
			})
		}
		$scope.preview();
		$scope.saveGraph = function() {
			$scope.form.qsites = [$scope.form.site.site_id];
			$scope.form.qdevies = [];
			if ($scope.form.gDevices && $scope.form.gDevices.length > 0)
				for (var i = 1; i < $scope.form.gDevices.length; i++)
					$scope.form.qdevies.push($scope.form.gDevices[i].device_id);

			GraphFactory.post({
				conf: $scope.form
			}).$promise.then(function(graph) {
				if (!graph.error) {
					alert("Saved")
					console.log(graph.data);
				}
			})
		}
	})
