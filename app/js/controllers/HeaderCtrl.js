 angular.module('app.controllers')
     .controller('HeaderCtrl', ['$scope', '$localStorage', 'SweetAlert', 'AuthService', '$state', function($scope, $localStorage, SweetAlert, AuthService, $state) {

         $scope.logout = function() {
             SweetAlert.swal({
                 title: "Are you sure?",
                 text: "Want to Logout!",
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 confirmButtonText: "Logout",
                 closeOnConfirm: true,
                 closeOnCancel: true

             }, function(confirm) {
                 if (confirm)
                     AuthService.logout();
             });

         }

     }]);