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
					url: "/WholeSales/Delete",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						Id,
					},
					success: function () {
						window.location.href = "/WholeSales/Index";
					},
					dataType: "json",
				});
			} else {
				$("#txtKeyword").trigger("focus");
			}
		},
	});
});

$(function () {
	setFullPage();
	gFrmId = "frmWholeSales";
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "asc" ? "fa fa-sort-down" : "fa fa-sort-up";
	$target.addClass(sortcls);

	initModals();
	triggerMenu(4, 1);

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
