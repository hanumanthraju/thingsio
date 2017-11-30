angular.module('app.factories').factory('SlaveFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'slaves', {}, {
		post: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	});

}).factory('SlaveIDFactory', function($resource, TCloud) {
	return $resource(TCloud.api + 'slaves/:id', {
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
