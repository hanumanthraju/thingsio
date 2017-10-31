 angular.module('app.controllers')
     .controller('LoginFormController', function($scope, $rootScope, SweetAlert, $http, $state, $localStorage, SessionFactory, AuthService) {
         var account = {};
         $scope.login = {
             account: {
                 email: '',
                 password: '',
                 remember: ''
             },
             login: function() {
                 console.log("login");
                 H5_loading.show();
                 SessionFactory.login($scope.login.account).$promise.then(function(data) {
                     console.log(data);
                     AuthService.storeUser(data.data, data.token);
                     $state.go("app.dashboard");
                     H5_loading.hide();
                 }, function(err) {
                     console.log(err);
                     H5_loading.hide();
                     SweetAlert.swal("Error!", "There was some error!", "error");

                 })

             }
         }

     })