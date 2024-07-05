$infoblk = $("#infoblk");

$(document).on("click", ".remove", function () {
	let Id = $(this).data("id");
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
					url: "/ItemQtyPromotion/Delete",
					data: {
						Id,
						__RequestVerificationToken: token,
					},
					success: function () {
						window.location.reload();
					},
					dataType: "json",
				});
			}
		},
	});
});



$(function () {
	setFullPage();
	gFrmId = "frmItemQtyPromotion";
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	//console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);

	initModals();
	triggerMenuByCls("menupromotion", 3);

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
	$(".pagination li").addClass("page-item");
});
