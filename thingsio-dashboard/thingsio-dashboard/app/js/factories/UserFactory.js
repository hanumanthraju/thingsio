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

}).factory('User2Facotry', function($resource, TCloud) {
	return $resource(TCloud.api + 'users/users2/:id', {
		id: '@id'
	}, {
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

}).factory('UserFactoryID', function($resource, TCloud) {
	return $resource(TCloud.api + 'users/:id', {
		id: '@id'
	}, {
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
