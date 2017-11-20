angular.module('app.devices')
    .controller('DevicesController', function($scope, $rootScope, $http, $state, $localStorage, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

        function loadDevices() {
            H5_loading.show();
            DeviceFactory.get().$promise.then(function(devices) {
                H5_loading.hide();
                if (!devices.error) {
                    $scope.devices = devices.data;
                }
                console.log($scope.devices);
            })
        }
        loadDevices();
        $scope.createDeviceModal = function() {
            dialogs.create("app/tpls/create_device.html", 'confirmDialogCtrl', $scope.devices, {
                size: 'lg'
            })
        }
        var newDevice = $rootScope.$on('newDevice', function(event, args) {
            $scope.devices.push(args);
        });
        $scope.deleteDevice = function(c) {
            SweetAlert.swal({
                    title: "Delete Device?",
                    text: "This will delete the devices",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Delete",
                    closeOnConfirm: true
                },
                function(s) {
                    if (s) {
                        DeviceIDFactory.delete({
                            id: c.device_id
                        }, {}).$promise.then(function(data) {
                            console.log(data);
                            if (!data.error) {
                                H5_loading.hide();
                                c.del = true;
                            }

                        }, function(err) {
                            console.log(err);
                        })

                    }
                    loadDevices();
                });
        }
    }).controller('confirmDialogCtrl', function() {
        $scope.device = {
            device_id: '',
            name: ''
        }
        $scope.devices = [];
        for (var i = 0; i < data.length; i++)
            /*if (data[i] == 1)
                $scope.devices.push(data[i]);*/
            $scope.createDevice = function() {
                console.log($scope.device);

                H5_loading.show();
                DeviceFactory.post($scope.device).$promise.then(function(data) {
                    if (!data.error) {
                        console.log(data.data)
                        $uibModalInstance.close()
                        $rootScope.$broadcast('newDevice', data.data);
                    }
                    H5_loading.hide();
                })

                //$uibModalInstance.dismiss('Canceled');
            }
    }).controller('ViewDeviceController', function($scope, $rootScope, $http, $stateParams, UserFactory, $state, $localStorage, dialogs, SweetAlert, DeviceIDFactory, DeviceFactory) {

        function getDevice() {
            H5_loading.show();
            DeviceIDFactory.get({
                id: $stateParams.id
            }).$promise.then(function(device) {
                H5_loading.hide();
                if (!device.error) {
                    $scope.device = device.data;
                    getUsers($stateParams.id);
                }
            })
        }

        function getUsers(did) {
            UserFactory.get({
                device_id: did
            }).$promise.then(function(data) {
                console.log(data.msg.msg);
                $scope.device.users = data.msg.msg;
            })
        }
        getDevice();


    });