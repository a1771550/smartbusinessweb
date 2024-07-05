$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	gTblId = "tblCoupon";
	gFrmId = "frmCoupon";
	initModals();
	triggerMenuByCls("menusetup", 6);
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});