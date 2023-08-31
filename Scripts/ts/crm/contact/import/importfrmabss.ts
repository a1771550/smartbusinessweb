$infoblk = $('#infoblk');

$('#btnImportCustomer').on('click', function () {
	$.fancyConfirm({
		title: '',
		message: $infoblk.data('confirmimporttxt'),
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				openWaitingModal();
				$('#frmImport').submit();
				//$.ajax({
				//	type: "POST",
				//	url: '/Contact/DoImportFrmABSSAsync',
				//	data: $('#frmImport').serialize(),
				//	success: function (data) {
				//		if (data) {
				//			closeWaitingModal();
				//			$.fancyConfirm({
				//				title: '',
				//				message: data,
				//				shownobtn: false,
				//				okButton: oktxt,
				//				noButton: notxt,
				//				callback: function (value) {
				//					if (value) {
				//						$('#btnImportCustomer').focus();
				//					}
				//				}
				//			});	
    //                    }
				//	},
				//	dataType: 'json'
				//});	
			}
		}
	});
});

$(document).ready(function () {
    initModals();
});