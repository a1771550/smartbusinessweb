$infoblk = $("#infoblk");

$(function () {
	forduty = true;
	setFullPage();
	gTblId = "tblDuty";
	gFrmId = "frmDuty";
	triggerMenu(0, 5);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});