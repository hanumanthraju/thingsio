angular.module('app.controllers')
	.controller('AnalyzeCtrl', function($scope, $rootScope, $q, DataService, SitesIDFactory, DeviceFactory, DataService, $stateParams, DeviceDataFactory) {
		$scope.q_r = $stateParams.q;
		$scope.devices = []
		$scope.datas = [];
		if ($scope.q_r !== '') {
			$scope.q_r = JSON.parse(decodeURI($scope.q_r))
		} else {

		}
		var promiseArray = []

		function promiseDone() {
			H5_loading.show();
			$q.all(promiseArray).then(function(data) {
				H5_loading.hide();

				$scope.datas = [];
				for (var i = 0; i < data.length; i++) {
					var res = data[i];
					//console.log(data[i]);
					if (!res.error) $scope.datas.push({
						device_id: $scope.site.devices[i],
						data: res.data,
						display: false
					})
					else $scope.datas.push({
						device_id: $scope.site.devices[i],
						data: [],
						display: false
					})
				}
				//console.log($scope.datas);
				processGraphs();
			})
		}

		function processData(data) {
			var rdata = [];

			for (var i = data.length - 1; i > -1; i--) {
				//console.log(data[i].dts);
				if (data[i].data.today_wh)
					rdata.push({
						x: parseInt(moment(data[i].dts).format("x")), // parseInt(moment(data[i].dts, "x")) * 1000,
						y: data[i].data.today_wh
					})
			}
			return rdata;
		}
		$scope.linechart = {
			data: [],
			option: DataService.getOption1()
		};

		function processGraphs() {

			for (var i = 0; i < $scope.datas.length; i++) {
				$scope.linechart.data.push({
					values: processData($scope.datas[i].data), //values - represents the array of {x,y} data points
					key: "Device ID " + $scope.datas[i].device_id, //key  - the name of the series.
					color: randomColor(), //color - optional: choose your own line color.
					strokeWidth: 2
				})

			}
			console.log($scope.linechart);
		}

		function getDeviceData() {
			promiseArray = []
			$scope.q_r.order = "DESC";
			$scope.q_r.pageno = 1;
			$scope.q_r.pagesize = 30000;

			for (var i = 0; i < $scope.site.devices.length; i++) {
				$scope.q_r.device_id = $scope.site.devices[i];

				promiseArray.push(DeviceDataFactory.get($scope.q_r).$promise)
			}
			promiseDone()
		}


		function getSite() {
			H5_loading.show();
			SitesIDFactory.get({
				id: $scope.q_r.site_id
			}).$promise.then(function(site) {
				H5_loading.hide();
				if (!site.error) {
					$scope.site = site.data;
					if (!$scope.q_r.device_id) getDevices($scope.q_r.site_id);
					else {
						$scope.site.devices = [$scope.q_r.device_id];
						getDeviceData();
					}

				}
			})
		}

		function getDevices(gid) {
			DeviceFactory.get({
				site_id: gid
			}).$promise.then(function(data) {
				$scope.site.devices = [];
				var devices = data.data;
				for (var i = 0; i < devices.length; i++) $scope.site.devices.push(devices[i].device_id)
				//console.log($scope.site.devices);
				getDeviceData();
			})
		}
		getSite();

	})
