//Factory for user login
angular.module('app.factories').factory('SessionFactory', function($resource, TCloud) {
    return $resource(TCloud.api + 'sessions', {}, {
        login: {
            method: 'POST',
            url: TCloud.api + 'sessions',
            headers: { 'Content-Type': 'application/json' }
        }
    });

})