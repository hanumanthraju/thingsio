angular.module('app.sites')
	.controller('SitesController', function($scope, $rootScope, $http, $state, ModalService, $localStorage, dialogs, SweetAlert, SitesIDFactory, SitesFactory, $rootScope) {

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
		loadSites();
		$scope.createSiteModal = function() {
			ModalService.createSite();
		}
		var newSite = $rootScope.$on('newSite', function(event, args) {
			loadSites();
		});
		$scope.deleteSite = function(c) {
			SweetAlert.swal({
					title: "Delete Site?",
					text: "This will delete the site. Will delete the site from groups and devices",
					type: "success",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Delete",
					closeOnConfirm: true
				},
				function(s) {
					if (s) {
						H5_loading.show();
						SitesIDFactory.delete({
							id: c.site_id
						}, {}).$promise.then(function(data) {
							console.log(data);
							if (!data.error) {
								H5_loading.hide();
								c.del = true;
							}

						}, function(err) {
							console.log(err);
						})

					}
				});

		}
	}).controller('ViewSiteController', function($scope, ModalService, $rootScope, TCloud, $http, $stateParams, UserFactory, $state, $localStorage, dialogs, SweetAlert, SitesIDFactory, SitesFactory, DeviceFactory, DeviceIDFactory) {

		function getSite() {
			H5_loading.show();
			SitesIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(site) {
				H5_loading.hide();
				if (!site.error) {
					$scope.site = site.data;
					console.log($scope.site);
					getDevices($stateParams.id)
				}
			})
		}

		function getDevices(gid) {
			DeviceFactory.get({
				site_id: gid
			}).$promise.then(function(data) {
				$scope.site.devices = data.data;
			})
		}
		$scope.assignDevice = function() {
			ModalService.assignDevice($scope.site);
		}
		var newDevice = $rootScope.$on('newDevice', function(event, args) {
			delete $scope.site.devices;
			getDevices($stateParams.id)
		});
		$scope.removeDevice = function(device) {
			H5_loading.show();
			$http({
				method: 'DELETE',
				url: TCloud.api + 'sites/edit-device/' + $scope.site.site_id,
				data: {
					devices: [device.device_id]
				},
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(function(data) {
				H5_loading.hide();
				if (!data.error) {

					device.del = true;
				}
			}, function(err) {
				console.log(err);
			})
		}
		$scope.updateSiteName = function() {
			$scope.site.name = $scope.site.t_site_name;
			SitesIDFactory.put({
				id: $stateParams.id
			}, {
				"name": $scope.site.name
			}).$promise.then(function(data) {

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
							console.log(err);
						})

					}
				});

		}
		getSite();
	});
