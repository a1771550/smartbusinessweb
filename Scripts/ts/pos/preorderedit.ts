$infoblk = $("#infoblk");
SalesLnList = [];
$(function () {
	forpreorder = true;
	retailType = RtlType.preorder;
	setFullPage();
	initModals();

	gTblName = "tblSales";

	Sales = $infoblk.data("salesorder");
	SalesLnList = $infoblk.data("saleslnlist");

	
	$(".NextSalesInvoice").val(Sales.rtsCode);
	$("#txtNotes").val(Sales.rtsRmks);
	$("#drpLocation").val(Sales.rtsSalesLoc);
	selectedCus = $infoblk.data("customer");	
	selectCus();
	ItemList = $infoblk.data("items");	
	currentY = 0;
	$target = $(`#${gTblName} tbody tr`);

	console.log("Sales:", Sales);
	console.log("SalesLnList:", SalesLnList);
	console.log("selectedCus:", selectedCus);
	console.log("ItemList:", ItemList);

});