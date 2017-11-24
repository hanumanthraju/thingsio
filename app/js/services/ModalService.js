angular.module('app.services').factory('ModalService', function(dialogs) {
	function createGroup(data) {
		dialogs.create("app/tpls/create_group.html", 'customDialogCtrl', data, {
			size: 'lg'
		})
	}

	function createSite(data) {
		dialogs.create("app/tpls/create_site.html", 'customSiteCtrl', data, {
			size: 'lg'
		})
	}

	function searchUser(data) {
		dialogs.create("app/tpls/search_user.html", 'SearchUserCtrl', data, {
			size: 'lg'
		})
	}

	function assignSite(data) {
		dialogs.create("app/tpls/assign_site.html", 'AssignSiteCtrl', data, {
			size: 'lg'
		})
	}

	function assignGroupSite(data) {
		dialogs.create("app/tpls/assign_group.html", 'AssignGroupSiteCtrl', data, {
			size: 'lg'
		})
	}

	function assignSiteDevice(data) {
		dialogs.create("app/tpls/assign_site_device.html", 'AssignSiteDeviceCtrl', data, {
			size: 'lg'
		})
	}

	function assignDevice(data) {
		dialogs.create("app/tpls/assign_device.html", 'AssignDeviceCtrl', data, {
			size: 'lg'
		})
	}

	function createDevice(data) {
		dialogs.create("app/tpls/create_device.html", 'CreateDeviceCtrl', data, {
			size: 'lg'
		})
	}
	return {
		createGroup: createGroup,
		searchUser: searchUser,
		assignSite: assignSite,
		assignDevice: assignDevice,
		createDevice: createDevice,
		assignGroupSite: assignGroupSite,
		assignSiteDevice: assignSiteDevice,
		createSite: createSite
	}
});
angular.module('app.controllers')
	.controller('AssignSiteDeviceCtrl', function($scope, data, $rootScope, GroupFactory, $uibModalInstance, SitesFactory, $timeout, SiteDeviceFactory, GroupSiteFactory) {
		$scope.device = data;
		console.log($scope.device)


		function loadSites() {
			$scope.loading = true;
			SitesFactory.get().$promise.then(function(sites) {
				$scope.loading = false;
				console.log(sites.data)
				if (!sites.error) {
					$scope.sites = sites.data;
				}
			})
		}
		$scope.assignDevice = function(site) {
			H5_loading.show();
			$scope.users = [];
			SiteDeviceFactory.post({
				id: site.site_id
			}, {
				"devices": [$scope.device.device_id]
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$uibModalInstance.close()
					$timeout(function() {
						$rootScope.$broadcast('newSite', data.data);
					}, 500);

				}
			})
		}
		loadSites();
	})
	.controller('AssignGroupSiteCtrl', function($scope, data, $rootScope, GroupFactory, $uibModalInstance, SitesFactory, GroupSiteFactory) {
		$scope.site = (data);
		$scope.groups = [];
		$scope.loading = false;

		function loadMyGroups() {
			H5_loading.show();
			GroupFactory.get().$promise.then(function(groups) {
				console.log(groups);
				H5_loading.hide();
				if (!groups.error) {
					$scope.groups = groups.data;
				}
			})
		}
		loadMyGroups();
		$scope.assignGroupSite = function(group) {
			H5_loading.show();
			$scope.users = [];
			GroupSiteFactory.post({
				id: group._id
			}, {
				"site_id": $scope.site.site_id
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$uibModalInstance.close()
					$rootScope.$broadcast('newGroup', data.data);
				}
			})
		}
	})
	.controller('CreateDeviceCtrl', function($scope, data, $rootScope, $uibModalInstance, SitesFactory, SearchFactory, DeviceFactory) {
		$scope.device = {
			device_id: '',
			name: ''
		}
		$scope.maxDevice = true;

		function loadMaxDevice() {
			$scope.maxDevice = true;
			SearchFactory.aggregate({
				"table": "devices",
				"field": "device_id",
				"op": "max",
				"query": {}

			}).$promise.then(function(data) {
				console.log(data);
				$scope.maxDevice = false;
				$scope.device.device_id = parseInt(data.data._v) + 1;
			})
		}
		loadMaxDevice();
		$scope.createDevice = function() {
			console.log($scope.device);
			H5_loading.show();
			DeviceFactory.post($scope.device).$promise.then(function(data) {
				if (!data.error) {
					console.log(data.data)
					$uibModalInstance.close()
					$rootScope.$broadcast('newDevice', data.data);
				}
				H5_loading.hide();
			}, function(err) {
				console.log(err);
			})

			//$uibModalInstance.dismiss('Canceled');
		}
	})
	.controller('AssignSiteCtrl', function($scope, data, $rootScope, $uibModalInstance, SitesFactory, GroupSiteFactory) {
		$scope.group = (data);
		$scope.sites = [];
		$scope.loading = false;

		function loadSites() {
			$scope.loading = true;
			SitesFactory.get().$promise.then(function(sites) {
				$scope.loading = false;
				console.log(sites.data)
				if (!sites.error) {
					$scope.sites = sites.data;
				}
			})
		}
		loadSites();
		$scope.assignSite = function(site) {
			H5_loading.show();
			$scope.users = [];
			GroupSiteFactory.post({
				id: $scope.group._id
			}, {
				"site_id": site.site_id
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$uibModalInstance.close()
					$rootScope.$broadcast('newSite', data.data);
				}
			})
		}
	})
	.controller('AssignDeviceCtrl', function($scope, data, $rootScope, $timeout, $uibModalInstance, SiteDeviceFactory, DeviceFactory) {
		$scope.site = (data);
		$scope.devices = [];
		$scope.loading = false;

		function loadDevices() {
			$scope.loading = true;
			DeviceFactory.get().$promise.then(function(devices) {
				$scope.loading = false;
				console.log(devices.data)
				if (!devices.error) {
					$scope.devices = devices.data;
				}
			})
		}
		loadDevices();
		$scope.assignDevice = function(device) {
			H5_loading.show();
			$scope.users = [];
			SiteDeviceFactory.post({
				id: $scope.site.site_id
			}, {
				"devices": [device.device_id]
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$uibModalInstance.close()
					$timeout(function() {
						$rootScope.$broadcast('newDevice', data.data);
					}, 500);

				}
			})
		}
	})
	.controller('customDialogCtrl', function($scope, data, $rootScope, $uibModalInstance, GroupFactory) {
		$scope.group = {
			parent_group: '',
			group_name: ''
		}
		$scope.groups = [];
		for (var i = 0; i < data.length; i++)
			if (data[i].type == 'peer')
				$scope.groups.push(data[i]);
		$scope.createGroup = function() {
			console.log($scope.group);

			H5_loading.show();
			GroupFactory.post($scope.group).$promise.then(function(data) {
				if (!data.error) {
					console.log(data.data)
					$uibModalInstance.close()
					$rootScope.$broadcast('newGroup', data.data);
				}
				H5_loading.hide();
			})

			//$uibModalInstance.dismiss('Canceled');
		}
	}).controller('customSiteCtrl', function($scope, data, $rootScope, $uibModalInstance, SearchFactory, SitesFactory) {
		$scope.site = {
			name: '',
			site_id: ''
		}
		$scope.sites = [];
		$scope.maxSite = true;

		function loadMaxSite() {
			$scope.maxDevice = true;
			SearchFactory.aggregate({
				"table": "sites",
				"field": "site_id",
				"op": "max",
				"query": {}

			}).$promise.then(function(data) {
				console.log(data);
				$scope.maxSite = false;
				$scope.site.site_id = parseInt(data.data._v) + 1;
			})
		}
		loadMaxSite();
		$scope.createSite = function() {
			console.log($scope.site);
			H5_loading.show();
			SitesFactory.post($scope.site).$promise.then(function(data) {
				if (!data.error) {
					console.log(data.data)
					$uibModalInstance.close()
					$rootScope.$broadcast('newSite', data.data);
				}
				H5_loading.hide();
			})
		}
	}).controller('SearchUserCtrl', function($scope, data, $rootScope, SearchFactory, GroupUserFactory, $uibModalInstance, SitesFactory, ) {
		$scope.form = {
			ne: ''
		}
		$scope.users = [];
		$scope.group = (data);
		$scope.searchUser = function() {
			console.log($scope.form.ne);
			H5_loading.show();
			$scope.users = [];
			SearchFactory.post({
				"query": $scope.form.ne,
				"fields": ["users"]
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$scope.users = data.data[0]
				}
			})

		}
		$scope.addUser = function(user) {
			H5_loading.show();
			$scope.users = [];
			GroupUserFactory.post({
				id: $scope.group._id
			}, {
				"user_id": user._id
			}).$promise.then(function(data) {
				H5_loading.hide();
				if (!data.error) {
					$uibModalInstance.close()
					$rootScope.$broadcast('GroupUser', data.data);
				}
			})
		}
	})
