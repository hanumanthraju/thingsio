angular.module('app.controllers')
	.controller('SearchController', function($scope, $stateParams, $rootScope, $http, $state, ModalService, $rootScope, SearchFactory) {
		var q_r = $stateParams.q;
		if (q_r !== '') {
			q_r = JSON.parse(decodeURI(q_r))
		} else {
			q_r = {
				fields: ["users", "groups", "sites", "devices"],
				query: ''
			}
		}
		$scope.search = {
			loading: false,
			results: [],
			q: q_r
		};
		$scope.fields = [false, false, false, false];
		if ($scope.search.q.fields.indexOf("users") > -1) $scope.fields[0] = true;
		if ($scope.search.q.fields.indexOf("groups") > -1) $scope.fields[1] = true;
		if ($scope.search.q.fields.indexOf("sites") > -1) $scope.fields[2] = true;
		if ($scope.search.q.fields.indexOf("devices") > -1) $scope.fields[3] = true;

		function beginSearch() {
			if ($scope.search.q.query == '') return;
			$scope.search.q.fields = [];
			if ($scope.fields[0]) $scope.search.q.fields.push("users");
			if ($scope.fields[1]) $scope.search.q.fields.push("groups");
			if ($scope.fields[2]) $scope.search.q.fields.push("sites");
			if ($scope.fields[3]) $scope.search.q.fields.push("devices");
			$scope.search.loading = true;
			SearchFactory.post($scope.search.q).$promise.then(function(res) {

				$scope.search.loading = false;
				$scope.search.results = res.data;
				console.log($scope.search.results);
			})
		}
		$scope.submitSearch = function() {
			if ($scope.search.q.query == '') return;
			beginSearch();
		}
		beginSearch()
	})
