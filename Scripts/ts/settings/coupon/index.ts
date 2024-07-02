$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	gTblId = "tblCoupon";
	gFrmId = "frmCoupon";
	triggerMenu(0, 6);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});