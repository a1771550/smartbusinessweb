$infoblk = $("#infoblk");

$(function () {	
	forItem = true;
	setFullPage();
	gTblId = "tblItems";
	gFrmId = "frmItem";

	initModals();
	triggerMenu(2, 0);	

	sortByName = true;
	ConfigSimpleSortingHeaders();
});
