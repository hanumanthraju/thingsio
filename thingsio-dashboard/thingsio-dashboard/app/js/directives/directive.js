angular.module('app.directives').directive('tcSpinner', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {},
		templateUrl: 'app/tpls/loader.html',
		controller: ['$scope', '$attrs', '$element', function($scope, $attrs) {

		}],
		link: function(scope, element, attrs) {

		}
	}
}).directive('siteCard', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/tpls/partials/site-card.html',
		link: function(scope, element, attrs) {

		}
	}
}).directive('groupCard', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/tpls/partials/group-card.html',
		link: function(scope, element, attrs) {

		}
	}
}).directive('slaveCard', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/tpls/partials/slave-card.html',
		link: function(scope, element, attrs) {

		}
	}
}).directive('deviceCard', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/tpls/partials/device-card.html',
		link: function(scope, element, attrs) {

		}
	}
}).directive('siteTr', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'app/tpls/partials/site-tr.html',
		link: function(scope, element, attrs) {

		}
	}
}).directive('deviceTr', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'app/tpls/partials/device-tr.html',
		link: function(scope, element, attrs) {

		}
	}
})
