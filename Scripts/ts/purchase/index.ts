$infoblk = $("#infoblk");

$(document).on("click", ".remark", function () {
	let remark: string = $(this).data("remark");
	$.fancyConfirm({
		title: "",
		message: remark,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$("#txtKeyword").trigger("focus");
			}
		},
	});
});

$(document).on("click", ".remove", function () {
	let purchasestockId = $(this).data("id");
	let token = $("input[name=__RequestVerificationToken]").val();
	$.fancyConfirm({
		title: "",
		message: confirmremove,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/Purchase/Delete",
					data: { Id: purchasestockId, __RequestVerificationToken: token },
					success: function () {
						window.location.reload();
					},
					dataType: "json",
				});
			}
		},
	});
});

$(document).on("change", "#txtKeyword", function () {
	keyword = <string>$(this).val();
	if (keyword !== "") {
		openWaitingModal();
		let $sortcol = $("<input>").attr({
			type: "hidden",
			name: "Keyword",
			value: keyword.trim(),
		});
		$("#frmPurchaseStock").append($sortcol).trigger("submit");
	}
});

$(document).on("click", "#btnSearch", function () {
	$("#txtKeyword").trigger("change");
});

$(function () {
	gFrmId = "frmPurchaseStock";
	setFullPage();
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	//console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "asc" ? "fa fa-sort-down" : "fa fa-sort-up";
	$target.addClass(sortcls);

	initModals();
	triggerMenu(5, 1);

	$("#txtKeyword").trigger("focus");

	$target = $(".pagination");
	$target
		.wrap('<nav aria-label="Page navigation"></nav>')
		.find("li")
		.addClass("page-item")
		.find("a")
		.addClass("page-link");

	let keyword = getParameterByName("Keyword");
	if (keyword !== null) {
		$("#txtKeyword").val(keyword);
	}
});
