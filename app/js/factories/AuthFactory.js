//Factory for user login
angular.module('app.factories').factory('SessionFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'sessions', {}, {
		login: {
			method: 'POST',
			url: TCloud.api + 'sessions',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	});

}).factory('HTTPInterceptor', function($rootScope, $q, SweetAlert) {
	return {
		responseError: function(response) {

			H5_loading.hide();
			if (response.status)
				if (response.data)
					SweetAlert.swal("Oops!", JSON.stringify(response.data, null, 2), "error");
				else
					SweetAlert.swal("Oops!", "There was some error. Please check your network connection", "error");

			return $q.reject(response);
		}
	};
})
