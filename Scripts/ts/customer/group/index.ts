$infoblk = $("#infoblk");
$(document).on("click", ".remove", function () {
	handleCustomerGroupRemove(Number($(this).data("id")), true);
});
$(function () {
	forcustomergroup = true;
	setFullPage();
	gTblId = "tblCustomerGroup";
	gFrmId = "frmCustomerGroup";
	triggerMenu(1, 4);
	initModals();

	ConfigSimpleSortingHeaders();
});