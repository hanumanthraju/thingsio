angular.module('app.devices')
	.controller('DevicesController', function($scope, $rootScope, $http, $state, $localStorage, ModalService, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

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
	}).controller('ViewDeviceController', function($scope, $rootScope, ModalService, $http, $stateParams, TCloud, UserFactory, $state, DeviceSlaveFactory, $localStorage, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

		function getDevice() {
			H5_loading.show();
			DeviceIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(device) {
				H5_loading.hide();
				if (!device.error) {
					$scope.device = device.data;
					console.log($scope.device);
				}
			})
		}
		Array.prototype.max = function() {
			return Math.max.apply(null, this);
		};
		$scope.addSlave = function() {
			if (!$scope.device.slaves || $scope.device.slaves.length == 0) var slave_id = 1
			else var slave_id = $scope.device.slaves.max() + 1;

			H5_loading.show();
			$scope.users = [];
			DeviceSlaveFactory.post({
				id: $scope.device.device_id
			}, {
				"slaves": [slave_id]
			}).$promise.then(function(data) {
				H5_loading.hide();
				console.log(data)
				if (!data.error) {
					console.log($scope.device)
					$scope.device.slaves.push(slave_id);

				}
			})
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

					$scope.device.slaves.splice(ind, 1)
				}
			}, function(err) {
				console.log(err);
			})
		}
		getDevice();


	});
