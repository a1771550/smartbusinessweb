$infoblk = $("#infoblk");

$(document).on("click", ".paidout", function () {	
	handleReservePaidOut(Number($(this).data("id")));
});
$(document).on("click", ".cancel", function () {
	let Id = $(this).data("id");
	$.fancyConfirm({
		title: "",
		message: $infoblk.data("confirmcanceltxt"),
		shownobtn: true,
		okButton: yestxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: "/Reserve/Cancel",
					data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id },
					success: function (data) {
						if (data) window.location.reload();
					},
					dataType: "json"
				});
			}
		}
	});	
	
});
$(function () {
	setFullPage();
	forCreateReserve = true;
	gTblId = "tblReserveList";
	gFrmId = "frmReserveList";
	triggerMenuByCls("menuitem", 6);
	initModals();

	ConfigSimpleSortingHeaders();
});
