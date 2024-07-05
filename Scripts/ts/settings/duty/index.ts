$infoblk = $("#infoblk");

$(function () {
	forduty = true;
	setFullPage();
	gTblId = "tblDuty";
	gFrmId = "frmDuty";
	triggerMenuByCls("menusetup", 5);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});