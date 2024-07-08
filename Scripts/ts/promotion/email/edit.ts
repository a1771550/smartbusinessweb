$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;

$(function () {
	setFullPage();
	foremail = true;
	gTblId = "tblEmail";
	gFrmId = "frmEmail";	
	initModals();
	triggerMenuByCls("menupromotion", 5);
	$("#txtSubject").trigger("focus");	
});
