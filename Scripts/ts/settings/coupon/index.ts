$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	gTblId = "tblCoupon";
	gFrmId = "frmCoupon";
	initModals();
	triggerMenuByCls("menusetup", 5);
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});