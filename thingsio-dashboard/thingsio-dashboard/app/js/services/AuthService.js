//AuthService.js

angular.module('app.services').factory('AuthService', function($localStorage, $state, $rootScope, $http, UserFactory) {
	var account = {
		udata: undefined,
		token: undefined
	}
	var isLogged = false;

	function getUser() {
		H5_loading.show();
		UserFactory.get().$promise.then(function(data) {
			H5_loading.hide();
			$rootScope.user = data.data;
			console.log($rootScope.user);
		})
	}
	// $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {
	// 	alert(1);
	// });

	function loadUser() {
		if ($localStorage.udata && $localStorage.token) {
			useUser($localStorage.udata, $localStorage.token);

		} else {
			$state.go("page.login");
		}
	}

	function useUser(udata1, token1) {
		account.udata = udata1;
		account.token = token1;
		isLogged = true;
		$http.defaults.headers.common['Authorization'] = token1;
		getUser();
	}

	function storeUser(udata, token) {
		$localStorage.udata = udata;
		$localStorage.token = token;
		useUser(udata, token)
	}

	function logout() {
		$localStorage.$reset();
		console.log("Logged Out");
		isLogged = false;
		account = {
			udata: undefined,
			token: undefined
		};
		$http.defaults.headers.common['Authorization'] = undefined;
		$state.go("page.login");
	}
	loadUser();
	return {
		loadUser: loadUser,
		storeUser: storeUser,
		logout: logout,
		isLogged: function() {
			return isLogged;
		}
	}
});
