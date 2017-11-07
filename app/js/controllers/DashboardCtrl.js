 angular.module('app.dashboard')
     .controller('DashboardController', function($scope, $localStorage, $state, $timeout, Colors) {

         console.log("dashboard");

         function todayf() {
             var today = new Date();
             var dd = today.getDate();
             var mm = today.getMonth() + 1; //January is 0!
             var hh = today.getHours();
             var mm1 = today.getMinutes();
             var yyyy = today.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             if (hh < 10) {
                 hh = '0' + hh;
             }
             if (mm1 < 10) {
                 mm1 = '0' + mm1;
             }
             if (yyyy < 10) {
                 yyyy = '0' + yyyy;
             }

             return dd + '-' + mm + '-' + yyyy + "  " + hh + ":" + mm1;
         }

         function yesterdayf() {
             var today = new Date();
             var dd = today.getDate() - 1;
             var mm = today.getMonth() + 1; //January is 0!
             var hh = today.getHours();
             var mm1 = today.getMinutes();
             var yyyy = today.getFullYear();
             if (dd < 10) {
                 dd = '0' + dd;
             }
             if (mm < 10) {
                 mm = '0' + mm;
             }
             if (hh < 10) {
                 hh = '0' + hh;
             }
             if (mm1 < 10) {
                 mm1 = '0' + mm1;
             }
             if (yyyy < 10) {
                 yyyy = '0' + yyyy;
             }

             return dd + '-' + mm + '-' + yyyy + "  " + hh + ":" + mm1;
         }
         $scope.startDate = yesterdayf();
         $scope.endDate = todayf();


     });