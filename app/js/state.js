(function() {
	'use strict';
	angular
		.module('app.routes')
		.config(routesConfig);
	routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

	function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		$locationProvider.html5Mode(false);
		$urlRouterProvider.otherwise('/page/login');
		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: helper.basepath('app.html'),
				resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'easypiechart', 'toaster', 'whirl')
			})
			.state('app.dashboard', {
				url: '/dashboard',
				title: 'Dashboard',
				templateUrl: helper.basepath('dashboard.html'),
				resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons'),
				controller: 'DashboardController',
				requiresLogin: true
			})
			.state('app.groups', {
				url: '/groups',
				title: 'Groups',
				templateUrl: helper.basepath('groups.html'),
				resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons'),
				controller: 'GroupsController',
				requiresLogin: true
			})
			.state('app.view_group', {
				url: '/view_group/:id',
				title: 'Group',
				templateUrl: helper.basepath('view_group.html'),
				controller: 'ViewGroupController',
				requiresLogin: true
			})
			.state('app.sites', {
				url: '/sites',
				title: 'Sites',
				templateUrl: helper.basepath('sites.html'),
				resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons'),
				controller: 'SitesController',
				requiresLogin: true
			})
			.state('app.view_site', {
				url: '/view_site/:id',
				title: 'Site',
				templateUrl: helper.basepath('view_site.html'),
				controller: 'ViewSiteController',
				requiresLogin: true
			})
			.state('app.view_slave', {
				url: '/view_slave/:id',
				title: 'Slave',
				templateUrl: helper.basepath('view_slave.html'),
				controller: 'ViewSlaveController',
				requiresLogin: true
			})
			.state('app.devices', {
				url: '/devices',
				title: 'Devices',
				templateUrl: helper.basepath('devices.html'),
				resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons'),
				controller: 'DevicesController',
				requiresLogin: true
			})
			.state('app.create_graph', {
				url: '/create_graph/:id',
				title: 'Create Graph',
				templateUrl: helper.basepath('create_graph.html'),
				controller: 'CreateGraphCtrl',
				requiresLogin: true
			})
			.state('app.view_directed', {
				url: '/view_directed',
				title: 'Directed Graph',
				templateUrl: helper.basepath('view_directed.html'),
				controller: 'DirectedController',
				requiresLogin: true
			})
			.state('app.view_device', {
				url: '/view_device/:id',
				title: 'Device',
				templateUrl: helper.basepath('view_device.html'),
				controller: 'ViewDeviceController',
				requiresLogin: true
			})
			.state('app.users', {
				url: '/users',
				title: 'Users',
				templateUrl: helper.basepath('users.html'),
				resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons'),
				controller: 'UsersController',
				requiresLogin: true
			})
			.state('app.search', {
				url: '/search/:q',
				title: 'Search',
				templateUrl: helper.basepath('search.html'),
				controller: 'SearchController',
				requiresLogin: true
			})
			.state('app.profile', {
				url: '/profile/:id',
				title: 'Profile',
				templateUrl: helper.basepath('profile.html'),
				controller: 'ProfileController',
				requiresLogin: true
			})
			.state('app.slaves', {
				url: '/slaves',
				title: 'Slaves',
				templateUrl: helper.basepath('slaves.html'),
				controller: 'SlaveController',
				requiresLogin: true
			})
			.state('app.view_graph', {
				url: '/view_graph/:id',
				title: 'Graph',
				templateUrl: helper.basepath('view_graph.html'),
				controller: 'GraphController',
				requiresLogin: true
			})
			.state('page', {
				url: '/page',
				templateUrl: 'app/pages/page.html',
				resolve: helper.resolveFor('modernizr', 'icons'),
				controller: ['$rootScope', function($rootScope) {
					$rootScope.app.layout.isBoxed = false;
				}]
			})
			.state('page.login', {
				url: '/login',
				title: 'Login',
				templateUrl: 'app/pages/login.html',
				controller: 'LoginFormController',
				requiresLogin: false
			})
			.state('page.register', {
				url: '/register',
				title: 'Register',
				templateUrl: 'app/pages/register.html',
				controller: 'LogupFormController',
				requiresLogin: false
			})
			.state('page.recover', {
				url: '/recover',
				title: 'Recover',
				templateUrl: 'app/pages/recover.html'
			})
			.state('page.lock', {
				url: '/lock',
				title: 'Lock',
				templateUrl: 'app/pages/lock.html'
			})
			.state('page.404', {
				url: '/404',
				title: 'Not Found',
				templateUrl: 'app/pages/404.html'
			})
			.state('page.500', {
				url: '/500',
				title: 'Server error',
				templateUrl: 'app/pages/500.html'
			})
			.state('page.maintenance', {
				url: '/maintenance',
				title: 'Maintenance',
				templateUrl: 'app/pages/maintenance.html'
			})
			.state('app-h', {
				url: '/app-h',
				abstract: true,
				templateUrl: helper.basepath('app-h.html'),
				resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'easypiechart', 'toaster', 'whirl')
			});
	}
})();
