angular.module('app.users')
	.controller('UsersController', function($scope, $rootScope, $http, $state, User2Facotry, $localStorage) {
		H5_loading.show();
		$scope.users = [];
		User2Facotry.get({
			id: 'all_users'
		}).$promise.then(function(users) {
			H5_loading.hide();
			if (!users.error) {
				console.log(users.data);
				$scope.users = users.data;
			}
		})

	});
