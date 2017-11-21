angular.module('app.factories')
	.factory('SearchFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'search', {}, {
			post: {
				method: 'POST',
				url: TCloud.api + 'search',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	})
