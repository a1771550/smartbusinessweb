$infoblk = $("#infoblk");

$(function () {
	foremail = true;
	setFullPage();
	gTblId = "tblEmail";
	gFrmId = "frmEmail";
	initModals();
	triggerMenuByCls("menupromotion", 5);
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
});