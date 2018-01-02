angular.module('app.filters')
	.filter('roleName', function() {
		return function(input) {
			if (input == 3) return "Administrator";
			else if (input == 2) return "Tenant";
			else return "User";
		}

	})
