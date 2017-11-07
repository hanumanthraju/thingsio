angular.module('app.groups')
    .controller('GroupsController', function($scope, $rootScope, $http, $state, $localStorage, dialogs, GroupFactory) {
        console.log("GroupsController");
        /*$scope.createGrp = {
                grpData: {
                    group_name: '',
                    parent_group: ''
                },
                createGrp: function() {
                    alert(1111);
                }
            },*/

        $scope.launch = function() {
            dialogs.notify('Create Group!');
        };




    });