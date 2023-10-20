$infoblk = $("infoblk");
let SalesOrder: ISalesLn;
SalesLnList = [];
$(function () {
	forpreorder = true;
	retailType = RtlType.preorder;
	setFullPage();
	initModals();

	SalesOrder = $infoblk.data("salesorder");
	SalesLnList = $infoblk.data("saleslnlist");

	console.log("SalesOrder:", SalesOrder);
	console.log("SalesLnList:", SalesLnList);
});