angular.module('app.factories')
	.factory('DeviceDataFactory', function($resource, TCloud) {
		return $resource(TCloud.api + 'device-datas', {}, {

		});

	})
