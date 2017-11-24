angular.module('app.controllers')
	.controller('ProfileController', function($scope, $rootScope, SearchFactory, $stateParams, UserFactoryID) {


		function getGroups() {
			$scope.group_loading = true;
			SearchFactory.query({
				table: "groups",
				filter: {
					_id: {
						$in: $scope.user.groups
					}
				}
			}).$promise.then(function(res) {
				$scope.group_loading = false;
				if (!res.error) {
					$scope.groups = res.data;
				}
			})
		}

		function getControlGroups() {
			$scope.cgroup_loading = true;
			SearchFactory.query({
				table: "groups",
				filter: {
					_id: {
						$in: $scope.user.control_groups
					}
				}
			}).$promise.then(function(res) {
				$scope.cgroup_loading = false;
				if (!res.error) {
					$scope.cgroups = res.data;
				}
			})
		}

		function getSites() {
			$scope.site_loading = true;
			SearchFactory.query({
				table: "sites",
				filter: {
					site_id: {
						$in: $scope.user.sites
					}
				}
			}).$promise.then(function(res) {
				$scope.site_loading = false;
				if (!res.error) {
					$scope.sites = res.data;
				}
			})
		}

		function getDevices() {
			$scope.device_loading = true;
			SearchFactory.query({
				table: "devices",
				filter: {
					device_id: {
						$in: $scope.user.devices
					}
				}
			}).$promise.then(function(res) {
				$scope.device_loading = false;
				if (!res.error) {
					$scope.devices = res.data;
				}
			})
		}



		function callAll() {
			getGroups();
			getSites();
			getControlGroups();
			getDevices();
		}
		var uid = $stateParams.id;
		console.log(uid);
		if (uid.length == 0) {
			$scope.user = $rootScope.user;
			callAll();
		} else {
			H5_loading.show();
			UserFactoryID.get({
				id: uid
			}).$promise.then(function(data) {
				H5_loading.hide();
				console.log(data);
				if (!data.error) {
					$scope.user = data.data;
					callAll();
				}
			})
		}


	})
