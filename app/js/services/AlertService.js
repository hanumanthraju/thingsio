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
	function showInfoMsg(title, msg, msgType) {
		var msgType = msgType || 'info';
		SweetAlert.swal(
			{title:title, text:msg, type:msgType, html:false}
		);	
	}
	
	return {
		confirm: confirm,
		showInfoMsg: showInfoMsg
	}
})
