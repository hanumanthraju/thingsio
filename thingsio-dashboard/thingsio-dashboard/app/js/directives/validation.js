angular.module('app.directives')
    .directive('validateCreateGroup', function(SweetAlert, dialogs) {
        function errorName() {
            SweetAlert.swal({
                title: "Oops!!!",
                text: "Group Name is Invalid",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: true
            });
        }
        return {
            restrict: "EA",
            link: function(scope, element, attrs) {
                element.bind('submit', function($event) {
                    $event.preventDefault();
                    var pattern1 = new RegExp("^([a-zA-Z0-9 _-]+)$");
                    var res1 = pattern1.test(scope.group.group_name);
                    if (res1 == false) {
                        errorName();
                        dialogs.create("app/tpls/create_group.html", 'customDialogCtrl', data, {
                            size: 'lg'
                        });
                    }
                });
            }
        };
    }).directive('validateCreateSite', function(SweetAlert, dialogs) {
        function errorName() {
            SweetAlert.swal({
                title: "Oops!!!",
                text: "Site Name or Site_ID is Invalid",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: true
            });
        }
        return {
            restrict: "EA",
            link: function(scope, element, attrs) {
                element.bind('submit', function($event) {
                    $event.preventDefault();
                    var pattern1 = new RegExp("^([a-zA-Z0-9 _-]+)$");
                    var pattern2 = new RegExp("^([0-9]+)$");
                    var res1 = pattern1.test(scope.site.name);
                    var res2 = pattern2.test(scope.site.site_id);
                    if (res1 == false || res2 == false) {
                        errorName();
                        dialogs.create("app/tpls/create_site.html", 'customSiteCtrl', data, {
                            size: 'lg'
                        });
                    }
                });
            }
        };
    }).directive('validateCreateDevice', function(SweetAlert, dialogs) {
        function errorName() {
            SweetAlert.swal({
                title: "Oops!!!",
                text: "Device Name or Device_ID is Invalid",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: true
            });
        }
        return {
            restrict: "EA",
            link: function(scope, element, attrs) {
                element.bind('submit', function($event) {
                    $event.preventDefault();
                    var pattern1 = new RegExp("^([a-zA-Z0-9 _-]+)$");
                    var pattern2 = new RegExp("^([0-9]+)$");
                    var res1 = pattern1.test(scope.device.name);
                    var res2 = pattern2.test(scope.device.device_id);
                    if (res1 == false || res2 == false) {
                        errorName();
                        dialogs.create("app/tpls/create_device.html", 'CreateDeviceCtrl', data, {
                            size: 'lg'
                        });
                    }
                });
            }
        };
    });