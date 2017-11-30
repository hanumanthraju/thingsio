angular.module('app.controllers')
	.controller('SlaveController', function($scope, $rootScope, SlaveFactory, ModalService) {
		$scope.slaves = [];


		function getSlaves() {
			H5_loading.show();
			SlaveFactory.get().$promise.then(function(slaves) {
				H5_loading.hide();
				if (!slaves.error)
					$scope.slaves = slaves.data
				console.log($scope.slaves);
			})
		}
		getSlaves();

		$scope.createSlave = function() {
			ModalService.createSlave();
		}
		var newSlave = $rootScope.$on('newSlave', function(event, args) {
			getSlaves();
		});
	})
	.controller('ViewSlaveController', function($scope, $rootScope, $stateParams, SweetAlert, SlaveFactory, SlaveIDFactory, ModalService) {
		$scope.slave = {};
		$scope.all_types = ["integer", "decimal", "string", "boolean"];

		function getSlave() {
			H5_loading.show();
			SlaveIDFactory.get({
				id: $stateParams.id
			}).$promise.then(function(slaves) {
				H5_loading.hide();
				if (!slaves.error)
					$scope.slave = slaves.data
				console.log($scope.slave);
			})
		}
		$scope.addNew = function() {
			$scope.slave.props.push({
				name: "",
				type: "decimal"
			})
		}
		$scope.removeProp = function($index) {
			$scope.slave.props.splice($index, 1)
		}

		function updateSlave() {
			H5_loading.show();
			SlaveIDFactory.put({
				id: $stateParams.id
			}, {
				name: $scope.slave.name,
				props: $scope.slave.props
			}).$promise.then(function(slaves) {
				H5_loading.hide();
				if (!slaves.error)
					$scope.slave = slaves.data
				console.log($scope.slave);
			})
		}

		function validKey(str) {

			var nameRegex = /^[a-z0-9\_]+$/;
			var patt = new RegExp(nameRegex);
			var res = patt.test(str);
			return res;
		}
		$scope.slaveUpdate = function() {
			var namedup = [];
			var props = $scope.slave.props;

			if ($scope.slave.name == '') {
				SweetAlert.swal("Oops!", "Invalid Slave Name", "error");
				return;
			}
			for (var i = 0; i < props.length; i++) {
				if (!props[i].name || props[i].name == '') {
					SweetAlert.swal("Oops!", "Invalid Property List", "error");
					return;
				}

				if (namedup.indexOf(props[i].name) > -1) {
					SweetAlert.swal("Oops!", "Duplicate Name", "error");
					return;
				} else namedup.push(props[i].name);

				if (!validKey(props[i].name)) {
					SweetAlert.swal("Oops!", "Only Lowercase, underscores and numbers allowed. should start with a-z", "error");
					return;
				}
			}
			//console.log($scope.slave.props);
			updateSlave()
		}
		getSlave();

	})
