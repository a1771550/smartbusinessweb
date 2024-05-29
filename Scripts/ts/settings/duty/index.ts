$infoblk = $("#infoblk");

$(function () {
	forduty = true;
	setFullPage();
	gTblId = "tblDuty";
	gFrmId = "frmDuty";
	triggerMenu(11, 6);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});