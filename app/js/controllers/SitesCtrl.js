angular.module('app.sites')
    .controller('SitesController', function($scope, $rootScope, $http, $state, $localStorage, dialogs, SweetAlert, SitesIDFactory, SitesFactory, $rootScope) {

        function loadSites() {
            H5_loading.show();
            SitesFactory.get().$promise.then(function(sites) {
                H5_loading.hide();
                if (!sites.error) {
                    $scope.sites = sites.data;
                }
            })
        }
        loadSites();
        $scope.createSiteModal = function() {
            dialogs.create("app/tpls/create_site.html", 'customDialogCtrl', $scope.sites, {
                size: 'lg'
            })
        }
        var newSite = $rootScope.$on('newSite', function(event, args) {
            $scope.sites.push(args);
        });
        $scope.deleteSite = function(c) {
            SweetAlert.swal({
                    title: "Delete Site?",
                    text: "This will delete the sites",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Delete",
                    closeOnConfirm: true
                },
                function(s) {
                    if (s) {
                        SitesIDFactory.delete({
                            id: c.site_id
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
                    loadSites();
                });

        }
    }).controller('customDialogCtrl', function($scope, data, $rootScope, $uibModalInstance, SitesFactory, ) {
        $scope.site = {
            name: '',
            site_id: ''
        }
        $scope.sites = [];
        for (var i = 0; i < data.length; i++)
            $scope.createSite = function() {
                console.log($scope.site);

                H5_loading.show();
                SitesFactory.post($scope.site).$promise.then(function(data) {
                    if (!data.error) {
                        console.log(data.data)
                        $uibModalInstance.close()
                        $rootScope.$broadcast('newSite', data.data);
                    }
                    H5_loading.hide();
                })

                //$uibModalInstance.dismiss('Canceled');
            }
    }).controller('ViewSiteController', function($scope, $rootScope, $http, $stateParams, UserFactory, $state, $localStorage, dialogs, SweetAlert, SitesIDFactory, SitesFactory, $rootScope) {

        function getSite() {
            H5_loading.show();
            SitesIDFactory.get({
                id: $stateParams.id
            }).$promise.then(function(site) {
                H5_loading.hide();
                if (!site.error) {
                    $scope.site = site.data;
                    getUsers($stateParams.id);
                }
            })
        }

        function getUsers(sid) {
            UserFactory.get({
                site_id: sid
            }).$promise.then(function(data) {
                console.log(data.msg.msg);
                $scope.site.users = data.msg.msg;
            })
        }
        getSite();


    });