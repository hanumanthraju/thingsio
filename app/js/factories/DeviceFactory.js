angular.module('app.factories')
	.factory('DeviceFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'devices', {}, {
			post: {
				method: 'POST',
				url: TCloud.api + 'devices',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	}).factory('DeviceGetFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'devices', {}, {
			post: {
				method: 'GET',
				url: TCloud.api + 'devices',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	}).factory('DeviceIDFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'devices/:id', {
			id: '@id'
		}, {
			delete: {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	}).factory('DeviceIDFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'devices/:id', {
			id: '@id'
		}, {
			delete: {
				method: 'DELETE',
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

	}).factory('DeviceSlaveFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'devices/edit-slave/:id', {
			id: '@id'
		}, {
			delete: {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			},
			post: {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	})
