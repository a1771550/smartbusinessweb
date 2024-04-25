$infoblk = $("#infoblk");

$(document).on("click", "#btnPaidOut", function () {
	//todo:
});
$(document).on("click", "#btnEdit", function () {
	let Id = Number($(this).data("orderid"));
	Reserve = { Id:Id } as IReserve;
	openReserveModal();
});
function fillInReserveLnList(ele) {
	//todo:
}
$(document).on("click", ".save", function () {
	fillInReserveLnList(this);
	
	//return false;
	$.ajax({
		type: "POST",
		url: "/Transfer/Edit",
		data: { "__RequestVerificationToken": $("input[name=__RequestVerificationToken]").val(), stocktransfer },
		success: function (data) {
			if (data) {
				$.fancyConfirm({
					title: "",
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							window.location.reload();
						}
					}
				});
			}
		},
		dataType: "json"
	});
});


$(document).on("dblclick", "#txtRemark", function () {
	getRowCurrentY.call(this);
	openTextAreaModal();
});

$(function () {	
	forEditReserve = true;
	gTblId = "tblEdit";
	setFullPage();
	triggerMenu(2, 6);
	initModals();

	setInput4NumberOnly("number");
});

