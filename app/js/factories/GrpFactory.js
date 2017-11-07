/*angular.module('app.groups').factory('GroupFactory', function($resource, TCloud) {
    return $resource(TCloud.api + 'groups', {}, {
        createGrp: {
            method: 'GET',
            url: TCloud.api + 'groups',
            headers: { 'Content-Type': 'application/json' },
            grpData: {
                group_name: '',
                parent_group: ''
            }

        }
    });

})*/