angular.module('angle').constant('TCloud', {
    'title': 'Things IO Dashboard',
    'api': 'http://139.59.10.145/api/',
    'version': "0.0.1.alpha",
    'developers': ["rajnandan@thethingscloud.com", "sandhya.harigar@thethingscloud.com"]
})


angular
    .module('app.settings')
    .run(function($rootScope, $localStorage) {
        $rootScope.toggleUserBlock = function() {
            $rootScope.$broadcast('toggleUserBlock');
        };
        $rootScope.app = {
            name: 'ThingsIO',
            description: 'Things IO Web App',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false,
                theme: null,
                asideScrollbar: false,
                isCollapsedText: false
            },
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };
        $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout === 'app-h');
        if (angular.isDefined($localStorage.layout))
            $rootScope.app.layout = $localStorage.layout;
        else
            $localStorage.layout = $rootScope.app.layout;
        $rootScope.$watch('app.layout', function() {
            $localStorage.layout = $rootScope.app.layout;
        }, true);
        $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
            if (newValue === false)
                $rootScope.$broadcast('closeSidebarMenu');
        });
    });