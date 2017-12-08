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
			numyv: 1,
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
		$scope.preview = function() {
			if (!$scope.form.combined && $scope.form.devices.device_id == 0) $scope.form.gDevices = $scope.devices;
			if ($scope.form.graph == 'pieChart') {
				$scope.form.combined = false;
				$scope.form.devices = $scope.devices[0];
			}
			for (var i = 0; i < $scope.form.groups.length; i++) {
				$scope.form.groups[i] = $scope.form.groups[i]._id;
			}
			console.log($scope.form);
			//ModalService.graphPreview($scope.form);
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
			console.log($scope.graph_option);
			GraphDataService.createQuery($scope.form);

			GraphDataService.getData().then(function(data) {

				$scope.graph_data = GraphDataService.parseData($scope.form, data);
				$scope.graph_data = GraphDataService.formatData($scope.form, $scope.graph_data);
				$scope.showg = true;

			})
		}
		$scope.preview();
		$scope.saveGraph = function() {
			GraphFactory.post({
				conf: $scope.form
			}).$promise.then(function(graph) {
				if (!graph.error) {
					console.log(graph.data);
				}
			})
		}
	})
