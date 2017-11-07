angular.module('app.groups')
	.controller('GroupsController', function($scope, $rootScope, $http, $state, $localStorage, dialogs, SweetAlert, GroupIDFactory, GroupFactory, $rootScope) {

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
			dialogs.create("app/tpls/create_group.html", 'customDialogCtrl', $scope.groups, {
				size: 'lg'
			})
		}
		var newGroup = $rootScope.$on('newGroup', function(event, args) {
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
	}).controller('customDialogCtrl', function($scope, data, $rootScope, $uibModalInstance, GroupFactory) {
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
	}).controller('ViewGroupController', function($scope, $rootScope, $http, $stateParams, UserFactory, $state, $localStorage, dialogs, SweetAlert, GroupIDFactory, GroupFactory, $rootScope) {

		function getGroup() {
			H5_loading.show();
			GroupIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(group) {
				H5_loading.hide();
				if (!group.error) {
					$scope.group = group.data;
					console.log($scope.group);
					getUsers($stateParams.id);
				}
			})
		}

		function getUsers(gid) {
			UserFactory.get({
				group_id: gid
			}).$promise.then(function(data) {
				console.log(data.msg.msg);
				$scope.group.users = data.msg.msg;
			})
		}
		getGroup();


	});
