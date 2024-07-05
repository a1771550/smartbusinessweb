$infoblk = $("#infoblk");

$(function () {	
	forItem = true;
	setFullPage();
	gTblId = "tblItems";
	gFrmId = "frmItem";

	initModals();
	triggerMenuByCls("menuitem", 0);	

	sortByName = true;
	ConfigSimpleSortingHeaders();
});
