$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	gTblId = "tblCoupon";
	gFrmId = "frmCoupon";
	initModals();
	triggerMenu(0, 6);
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});