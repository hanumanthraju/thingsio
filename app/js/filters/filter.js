angular.module('app.filters')
	.filter('roleName', function() {
		return function(input) {
			if (input == 3) return "Administrator";
			else if (input == 2) return "Tenant";
			else return "User";
		}

	})
	.filter('graphFilter', function() {
		return function(input, clause) {
			var out = [];
			if (clause.site.site_id != -1 || clause.group._id != -1) {
				angular.forEach(input, function(cp) {
					var gind = cp.form.groups.indexOf(clause.group._id)
					var sind = cp.form.qsites.indexOf(clause.site.site_id)
					if (gind > -1 || sind > -1)
						out.push(cp);
				});
			} else {
				angular.forEach(input, function(cp) {
					out.push(cp);
				})
			}

			return out;
		}

	})
