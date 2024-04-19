$infoblk = $("#infoblk");

$(document).on("click", "#btnReload", function () {
	window.location.href = "/Reserve/List";
});


$(document).on("click", "#btnSearch", function (e) {
	e.preventDefault();
	$("#frmReserve").trigger("submit");
});
$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	$("#txtKeyword").val($(this).data("keyword"));

	$("#frmReserve")
		.append($sortcol)
		.trigger("submit");
});
$(function () {
	setFullPage();
	forreserve = true;
	gTblName = "tblReserveList";
	gFrmName = "frmReserveList";
	triggerMenu(2, 6);
	initModals();

	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	//console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $(".colheader").eq(Number($sortcol.val()));
	let sortcls =
		$sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);

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
	
	$("#txtKeyword").trigger("focus");
});
