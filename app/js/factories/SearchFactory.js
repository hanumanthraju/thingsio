angular.module('app.factories')
	.factory('SearchFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'search', {}, {
			post: {
				method: 'POST',
				url: TCloud.api + 'search',
				headers: {
					'Content-Type': 'application/json'
				}
			},
			query: {
				method: 'POST',
				url: TCloud.api + 'search/query',
				headers: {
					'Content-Type': 'application/json'
				}
			},
			aggregate: {
				method: 'POST',
				url: TCloud.api + 'search/aggregate',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		});

	})
