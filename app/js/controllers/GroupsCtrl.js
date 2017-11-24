angular.module('app.groups')
	.controller('GroupsController', function($scope, $rootScope, $http, $state, ModalService, $localStorage, dialogs, SweetAlert, GroupIDFactory, GroupFactory, $rootScope) {

		function loadMyGroups() {
			H5_loading.show();
			GroupFactory.get().$promise.then(function(groups) {
				H5_loading.hide();
				if (!groups.error) {
					$scope.groups = groups.data;
				}
			})
		}
		loadMyGroups();

		$scope.createModal = function() {
			ModalService.createGroup($scope.groups)
		}

		var newGroup = $rootScope.$on('newGroup', function(event, args) {
			args.type = 'sub';
			$scope.groups.push(args);
		});
		$scope.deleteGroup = function(c) {
			SweetAlert.swal({
					title: "Delete Group?",
					text: "This will delete the group. Will delete the groups where this group is a parent and remove it from users",
					type: "success",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Delete",
					closeOnConfirm: true
				},
				function(s) {
					if (s) {
						GroupIDFactory.delete({
							id: c._id
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
	}).controller('ViewGroupController', function($scope, SitesFactory, $http, $rootScope, TCloud, GroupSiteFactory, SitesIDFactory, $http, ModalService, $timeout, $stateParams, UserFactory, $state, $localStorage, dialogs, SweetAlert, GroupIDFactory, GroupFactory, $rootScope) {

		function getGroup() {
			H5_loading.show();
			GroupIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(group) {
				H5_loading.hide();
				if (!group.error) {
					$scope.group = group.data;
					console.log($scope.group);
					$timeout(function() {
						getUsers($stateParams.id)
					}, 1000)
					$timeout(function() {
						getSites($stateParams.id)
					}, 1000)

				}
			})
		}
		$scope.createSite = function() {
			ModalService.createSite();
		}
		$scope.searchUser = function() {
			ModalService.searchUser($scope.group);
		}
		$scope.assignSite = function() {
			ModalService.assignSite($scope.group);
		}
		$scope.updateGroupName = function() {
			console.log($scope.group.t_group_name);
			$scope.group.group_name = $scope.group.t_group_name;
			GroupIDFactory.put({
				id: $stateParams.id
			}, {
				"group_name": $scope.group.group_name
			}).$promise.then(function(data) {

			})

		}

		function getUsers(gid) {
			UserFactory.get({
				group_id: gid
			}).$promise.then(function(data) {
				console.log(data.data);
				$scope.group.users = data.data;
			})
		}

		function getSites(gid) {
			SitesFactory.get({
				group_id: gid
			}).$promise.then(function(data) {
				console.log(data.data);
				$scope.group.site_full = data.data;
			})
		}
		var newSite = $rootScope.$on('newSite', function(event, args) {
			delete $scope.group.site_full;
			getSites($stateParams.id)
		});
		var GroupUser = $rootScope.$on('GroupUser', function(event, args) {
			delete $scope.group.users;
			getUsers($stateParams.id)
		});
		$scope.removeUser = function(user) {
			H5_loading.show();
			$http({
				method: 'DELETE',
				url: TCloud.api + 'groups/add-user/' + $scope.group._id,
				data: {
					user_id: user._id
				},
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(function(data) {
				H5_loading.hide();
				if (!data.error) {

					user.del = true;
				}
			}, function(err) {
				console.log(err);
			})
		}
		$scope.removeSite = function(site) {
			H5_loading.show();
			$http({
				method: 'DELETE',
				url: TCloud.api + 'groups/add-site/' + $scope.group._id,
				data: {
					site_id: site.site_id
				},
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(function(data) {
				H5_loading.hide();
				if (!data.error) {

					site.del = true;
				}
			}, function(err) {
				console.log(err);
			})
		}
		$scope.deleteSite = function(site) {
			SweetAlert.swal({
					title: "Delete Site?",
					text: "This will delete the site. Will delete the site from groups and devices",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Delete",
					closeOnConfirm: true
				},
				function(s) {
					if (s) {
						SitesIDFactory.delete({
							id: site.site_id
						}, {}).$promise.then(function(data) {
							console.log(data);
							if (!data.error) {
								H5_loading.hide();
								site.del = true;
							}

						}, function(err) {
							console.log(err);
						})

					}
				});

		}
		getGroup();


	});
