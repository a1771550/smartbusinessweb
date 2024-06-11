$infoblk = $("#infoblk");

$(function () {
	forAbssSales = true;
	setFullPage();
	gTblId = "tblSales";
	gFrmId = "frmSales";
	triggerMenu(8, 0);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();

	initDatePicker("strDate");
});