$infoblk = $("#infoblk");
SalesLnList = [];
$(function () {
	forpreorder = true;
	setFullPage();
	initModals();

	salesType = SalesType.preorder;
	batchidx = 5;
	snidx = batchidx + 1;
    vtidx = snidx + 1;

    comInfo = $infoblk.data("cominfo");
	Sales = $infoblk.data("salesorder");
	SalesLnList = $infoblk.data("saleslnlist");

	shop = Sales.rtsSalesLoc;
	$("#drpLocation").val(shop);
	device = Sales.rtsDvc;
	$("#drpDevice").val(device);
	exRate = 1;
	gTblName = "tblSales";
	$("#rtsExRate").val(1);
	displayExRate(1);

    cpplList = $infoblk.data("customerpointpricelevels");
    
    dicPayTypes = $infoblk.data("dicpaytypes");
	defaultcustomer = $infoblk.data("defaultcustomer");
	taxModel = $infoblk.data("taxmodel");
	inclusivetax = $infoblk.data("inclusivetax")=="True";
	inclusivetaxrate = $infoblk.data("inclusivetaxrate");
	enableTax = $infoblk.data("enabletax")=="True";
	DicCurrencyExRate = $infoblk.data("diccurrencyexrate");

	DicLocation = $infoblk.data("diclocation");
	JobList = $infoblk.data("joblist");
    useForexAPI = comInfo.UseForexAPI;
	
	$(".NextSalesInvoice").val(Sales.rtsCode);
	$("#txtNotes").val(Sales.rtsRmks);

	editmode = Sales.rtsUID > 0;
	if (editmode) {
		selectedCus = $infoblk.data("customer");
		selectCus();
		ItemList = $infoblk.data("items");
	} else {
		if (defaultcustomer !== null) {
			selectedCus = defaultcustomer;
			selectedCusCodeName = defaultcustomer.cusCode;
			selectCus();
		} else {
			$("#txtCustomerName").trigger("focus");
		}
	}

	//console.log("Sales:", Sales);
	//console.log("SalesLnList:", SalesLnList);
	//console.log("selectedCus:", selectedCus);
	//console.log("ItemList:", ItemList);

});