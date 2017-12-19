angular.module('app.devices')
	.controller('DevicesController', function($scope, $rootScope, GraphDataService, $http, $state, DataService, $localStorage, ModalService, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

		function loadDevices() {
			H5_loading.show();
			DeviceFactory.get().$promise.then(function(devices) {
				H5_loading.hide();
				if (!devices.error) {
					$scope.devices = devices.data;
				}
				console.log($scope.devices);
			})
		}
		loadDevices();
		$scope.createDeviceModal = function() {
			ModalService.createDevice();
		}
		var newDevice = $rootScope.$on('newDevice', function(event, args) {
			$scope.devices.unshift(args);
		});

		function health(d) {
			var d1 = moment().diff(moment(d), 'hours');

			if (d1 <= 1) return "Excellent";
			else if (d1 <= 3) return "Very Good";
			else if (d1 <= 6) return "Good";
			else if (d1 <= 12) return "Not Looking good";
			else if (d1 <= 24) return "Poor";
			else if (d1 <= 48) return "Bad";
			else if (d1 > 48) return "Very Bad";

		}
		$scope.goToAnalyze = function(dev) {
			console.log(dev);
			var filter = {
				site_id: dev.site_id,
				device_id: dev.device_id
			}
			GraphDataService.testSite(filter).then(function(data) {
				var str = "Last Data Received was on - " + moment(data[0].dts).format("DD/MM/YYYY HH:mm") + "\n";
				str = str + "Data was sent by Device id - " + data[0].device_id + "\n";
				str = str + "Data was sent by Slave id -" + data[0].slave_id + "\n";
				SweetAlert.swal(health(data[0].dts), str);
			}, function(err) {
				SweetAlert.swal("Not Working", "Not Working", "error");
			})
		}
		$scope.deleteDevice = function(device) {
			SweetAlert.swal({
					title: "Delete Device?",
					text: "This will delete the Device. However all the data from this device will be kept",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Delete",
					closeOnConfirm: true
				},
				function(s) {
					if (s) {
						H5_loading.show();
						DeviceIDFactory.delete({
							id: device.device_id
						}, {}).$promise.then(function(data) {
							console.log(data);
							if (!data.error) {
								H5_loading.hide();
								device.del = true;
							}
						}, function(err) {
							H5_loading.hide();
							console.log(err);
						})
					}
				});

		}
	}).controller('ViewDeviceController', function($scope, $rootScope, GraphFactory, GraphDataService, SearchFactory, ModalService, $http, $stateParams, TCloud, UserFactory, $state, DeviceSlaveFactory, $localStorage, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

		function getDevice() {
			H5_loading.show();
			DeviceIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(device) {
				H5_loading.hide();
				if (!device.error) {
					$scope.device = device.data;
					$scope.goToAnalyze($scope.device);
					expandSlave();
					getGraphs()
				}
			})
		}
		$scope.goToAnalyze = function(dev) {
			console.log(dev);
			var filter = {
				site_id: dev.site_id,
				device_id: dev.device_id
			}
			GraphDataService.testSite(filter).then(function(data) {
				$scope.device.last_dts = moment(data[0].dts).format("DD/MM/YYYY HH:mm");
			}, function(err) {
				$scope.device.last_dts = "N/A";
			})
		}

		function getGraphs() {
			GraphFactory.get({
				type: 'devices',
				device_id: $stateParams.id
			}).$promise.then(function(graphs) {
				if (!graphs.error) {
					$scope.graph = graphs.data;
				}

			})
		}

		function expandSlave() {
			var s_ids = [];
			for (var i = 0; i < $scope.device.slave_types.length; i++) s_ids.push($scope.device.slave_types[i].type);
			SearchFactory.query({
				table: "slaves",
				filter: {
					_id: {
						$in: s_ids
					}
				}
			}).$promise.then(function(slaves_full) {
				if (!slaves_full.error && slaves_full.data.length > 0)
					for (var i = 0; i < $scope.device.slave_types.length; i++)
						for (var j = 0; j < slaves_full.data.length; j++)
							if ($scope.device.slave_types[i].type == slaves_full.data[j]._id)
								$scope.device.slave_types[i].name = slaves_full.data[j].name
			})
		}
		Array.prototype.max = function() {
			return Math.max.apply(null, this);
		};
		var newSlave = $rootScope.$on('newSlave', function(event, args) {
			getDevice();
		});
		$scope.addSlave = function() {
			ModalService.assignSlave($scope.device);
		}
		$scope.updateDeviceName = function() {
			$scope.device.name = $scope.device.t_device_name;
			DeviceIDFactory.put({
				id: $stateParams.id
			}, {
				"name": $scope.device.name
			}).$promise.then(function(data) {

			})

		}
		$scope.assignSiteDevice = function() {
			ModalService.assignSiteDevice($scope.device);
		}
		var newSite = $rootScope.$on('newSite', function(event, args) {
			console.log(args);
			$scope.device.site = args;
		});
		$scope.deleteSlave = function(slave, ind, _id) {
			H5_loading.show();
			$http({
				method: 'DELETE',
				url: TCloud.api + 'devices/edit-slave/' + $scope.device.device_id,
				data: {
					slaves: [{
						type: _id,
						slave_id: slave
					}]
				},
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$scope.device.slave_types.splice(ind, 1)
				}
			}, function(err) {
				console.log(err);
			})
		}
		getDevice();


	});
