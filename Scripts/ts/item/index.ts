$infoblk = $("#infoblk");


$(function () {	
	forItem = true;
	setFullPage();
	gTblId = "tblItems";
	gFrmId = "frmItem";
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "asc" ? "fa fa-sort-down" : "fa fa-sort-up";
	$target.addClass(sortcls);

	initModals();
	triggerMenu(2, 0);

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
