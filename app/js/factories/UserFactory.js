angular.module('app.factories').factory('UserFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'users', {}, {
		post: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		},
		put: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	});

})
