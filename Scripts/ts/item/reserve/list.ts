$infoblk = $("#infoblk");



$(function () {
	setFullPage();
	forCreateReserve = true;
	gTblId = "tblReserveList";
	gFrmId = "frmReserveList";
	triggerMenu(2, 6);
	initModals();

	ConfigSimpleSortingHeaders();
});
