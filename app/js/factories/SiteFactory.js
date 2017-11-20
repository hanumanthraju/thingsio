angular.module('app.factories')
    .factory('SitesFactory', function($resource, TCloud) {
        return $resource(TCloud.api + 'sites', {}, {
            post: {
                method: 'POST',
                url: TCloud.api + 'sites',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });

    }).factory('SitesIDFactory', function($resource, TCloud) {
        return $resource(TCloud.api + 'sites/:id', {
            id: '@id'
        }, {
            delete: {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });

    })