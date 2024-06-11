$infoblk = $("#infoblk");
$(function () {
	setFullPage();
	gFrmId = "frmreport";
	triggerMenu(7, Number($infoblk.data("idx")));
	initDatePickers();
	let ispostback = $infoblk.data("ispostback") == "True";	
	let count: number = Number($infoblk.data("count"));

	console.log("ispostback:", ispostback);
	console.log("count:", count);
	console.log("reload:", reload);
	reload = getParameterByName("reload") == "1";
	if (ispostback) {
		if(!reload)toggleNoRecord(count==0);
	} else {
		toggleNoRecord(false);
	}	
});

function doFilter() {
	if (minDate !== "" && maxDate !== "") {
		$(`#${gFrmId}`).trigger("submit");
	}
}

$(document).on("click", "#btnPrintPreview", function () {
	$("#printblk").printThis();
});