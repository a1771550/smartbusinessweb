$infoblk = $("#infoblk");

$(document).on("click", ".remove", function () {
	const Id = $(this).data("id");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: "/Category/Delete",
					data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id },
					success: function (data) {
						if (data.msg) $("#btnReload").trigger("click");
					},
					dataType: "json"
				});
			} else $("#txtKeyword").trigger("focus");
		}
	});
});

$(document).on("change", ".displayorder", function () {
	let $dorder = $(this);
	let dorder = $dorder.val();
	if (dorder) {
		Category = {Id:$dorder.data("id"),displayOrder:dorder} as ICategory;
		$.ajax({
			type: "POST",
			url: "/Category/SaveDisplayOrder",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),Category },
			success: function (data) {
				if (data) showMsg4Cls("msg", data);
			},
			dataType: "json"
		});
	}
});
$(function () {
	gFrmId = "frmCategory";
	gTblId = "tblCategory";
	setFullPage();
	
	initModals();
	triggerMenuByCls("menuitem", 7);

	ConfigSimpleSortingHeaders();
	
});
