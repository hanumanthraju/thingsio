angular.module('app.services').factory('AlertService', function($q, SweetAlert) {
	function confirm(title, text, type) {
		return $q(function(resolve, reject) {
			SweetAlert.swal({
				title: title,
				text: text,
				type: type || "warning",
				showCancelButton: true,
				confirmButtonColor: "#23b7e5",
				confirmButtonText: "Okay",
				closeOnConfirm: true,
				closeOnCancel: true

			}, function(confirm) {
				if (confirm) resolve(true);
				else reject(false);

			});
		})

	}
	return {
		confirm: confirm
	}
})
