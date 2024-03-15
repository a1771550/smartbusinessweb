$infoblk = $("#infoblk");

$(document).on("click", "#btnReload", function () {
	window.location.href = "/InventoryAdjustment/Index";
});
$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	let $keyword = $("<input>").attr({
		type: "hidden",
		name: "Keyword",
		value: $(this).data("keyword"),
	});

	$("#frmInventoryAdjustment").append($sortcol).append($keyword).trigger("submit");
});

$(function () {
	forItem = true;
	setFullPage();
	
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	//console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "asc" ? "fa fa-sort-down" : "fa fa-sort-up";
	$target.addClass(sortcls);

	initModals();
	

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

	triggerMenu(2, 4);
});
