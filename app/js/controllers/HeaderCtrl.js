 angular.module('app.controllers')
 	.controller('HeaderCtrl', ['$scope', '$localStorage', 'SweetAlert', 'AuthService', '$state', function($scope, $localStorage, SweetAlert, AuthService, $state) {

 		$scope.logout = function() {
 			SweetAlert.swal({
 				title: "Are you sure?",
 				text: "Want to Logout!",
 				type: "warning",
 				showCancelButton: true,
 				confirmButtonColor: "#DD6B55",
 				confirmButtonText: "Logout",
 				closeOnConfirm: true,
 				closeOnCancel: true

 			}, function(confirm) {
 				if (confirm)
 					AuthService.logout();
 			});

 		}
 		$scope.search = {
 			open: false,
 			query: ''
 		}
 		$scope.searchOpen = function() {
 			$scope.search.open = true;
 			$("#navSearch2").focus();
 		}
 		$scope.searchClose = function() {
 			$scope.search.open = false;
 			$("#navSearch2").blur();
 		}
 		$scope.searchGo = function() {
 			if ($scope.search.query == '') return;
 			else {
 				var final = {
 					query: $scope.search.query,
 					fields: ["users", "groups", "sites", "devices"]
 				}
 				console.log(encodeURI(JSON.stringify(final)));
 				$scope.searchClose();
 			}
 		}


 	}]);
