//AuthService.js

angular.module('app.services').factory('AuthService', function($localStorage, $state, $http) {
	var account = {
		udata: undefined,
		token: undefined
	}
	var isLogged = false;


	function loadUser() {
		if ($localStorage.udata && $localStorage.token) {
			console.log($localStorage.udata);
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
