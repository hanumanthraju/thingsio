angular.module('app.factories').factory('GraphFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'graphs', {}, {
		post: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	});

}).factory('GraphIDFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'graphs/:id', {
		id: '@id'
	}, {
		put: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	});

})
