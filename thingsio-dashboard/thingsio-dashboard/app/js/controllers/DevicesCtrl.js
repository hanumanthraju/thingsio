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
				SweetAlert.swal("Working", str);
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
				$scope.site.last_dts = "N/A";
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
			SearchFactory.query({
				table: "slaves",
				filter: {
					slave_id: {
						$in: $scope.device.slaves
					}
				}
			}).$promise.then(function(slaves_full) {
				if (!slaves_full.error)
					$scope.device.slaves_full = slaves_full.data
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
		$scope.deleteSlave = function(slave, ind) {
			H5_loading.show();
			$http({
				method: 'DELETE',
				url: TCloud.api + 'devices/edit-slave/' + $scope.device.device_id,
				data: {
					slaves: [slave]
				},
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(function(data) {
				H5_loading.hide();
				if (!data.error) {

					$scope.device.slaves_full.splice(ind, 1)
				}
			}, function(err) {
				console.log(err);
			})
		}
		getDevice();


	});
