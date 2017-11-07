angular.module('app.factories')
	.factory('GroupFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'groups', {}, {
			post: {
				method: 'POST',
				url: TCloud.api + 'groups',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	})
	.factory('GroupIDFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'groups/:id', {
			id: '@id'
		}, {
			delete: {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	})
