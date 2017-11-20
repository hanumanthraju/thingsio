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
})
