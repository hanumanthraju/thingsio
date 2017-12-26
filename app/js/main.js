var app = angular.module('angle', [
	'app.core',
	'app.routes',
	'app.sidebar',
	'app.preloader',
	'app.translate',
	'app.settings',
	'app.dashboard',
	'app.lazyload',
	'app.bootstrapui',
	'app.pages',
	'app.utils',
	'app.services',
	'app.factories',
	'app.controllers',
	'app.groups',
	'app.sites',
	'app.devices',
	'app.users',
	'angularjs-datetime-picker',
	'oitozero.ngSweetAlert',
	'dialogs.main',
	'ngTable',
	'app.filters',
	'angularMoment',
	'app.directives',
	'nvd3',
	'ngSanitize',
	'ngCsv',
	// 'htmlToPdfSave'
]);

angular
	.module('app.core')
	.run(function($rootScope, $state, $stateParams, $window, $templateCache, Colors, AuthService) {

		var offevent = $rootScope.$on('ocLazyLoad.fileLoaded', function(e, file) {
			if (file.indexOf('ag-grid.js') > -1) {
				agGrid.initialiseAgGridWithAngular1(angular);
				offevent();
			}
		});

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.$storage = $window.localStorage;

		// Uncomment this to disable template cache
		/*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		    if (typeof(toState) !== 'undefined'){
		      $templateCache.remove(toState.templateUrl);
		    }
		});*/

		// {{ colorByName('primary') }}
		$rootScope.colorByName = Colors.byName;
		$rootScope.cancel = function($event) {
			$event.stopPropagation();
		};
		$rootScope.$on('$stateNotFound',
			function(event, unfoundState /*, fromState, fromParams*/ ) {
				console.log(unfoundState.to); // "lazy.state"
				console.log(unfoundState.toParams); // {a:1, b:2}
				console.log(unfoundState.options); // {inherit:false} + default options
			});
		$rootScope.$on('$stateChangeError',
			function(event, toState, toParams, fromState, fromParams, error) {
				console.log(error);
			});
		$rootScope.$on('$stateChangeSuccess',
			function( /*event, toState, toParams, fromState, fromParams*/ ) {
				$window.scrollTo(0, 0);
				$rootScope.currTitle = $state.current.title;
			});
		$rootScope.currTitle = $state.current.title;
		$rootScope.pageTitle = function() {
			var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
			document.title = title;
			return title;
		};
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {

			if (toState.requiresLogin) {
				if (!AuthService.isLogged()) {
					event.preventDefault();
					$state.go("page.login")
				}
			}

			if (!toState.requiresLogin) {
				if (AuthService.isLogged()) {
					event.preventDefault();
					$state.go("app.dashboard")
				}
			}
		});
	}).config(function($httpProvider) {
		$httpProvider.interceptors.push('HTTPInterceptor');
	});
